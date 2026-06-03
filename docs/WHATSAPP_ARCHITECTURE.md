# 📱 BrokerCloud — Arquitetura WhatsApp

> **Documento de referência técnica** para toda a integração WhatsApp do BrokerCloud.  
> Qualquer desenvolvedor que tocar nessa parte do sistema **deve ler este documento primeiro**.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack & Dependências](#2-stack--dependências)
3. [Modelo de Dados](#3-modelo-de-dados)
4. [Fluxo de Conexão (QR Code)](#4-fluxo-de-conexão-qr-code)
5. [Recebimento de Mensagens (Webhook)](#5-recebimento-de-mensagens-webhook)
6. [Processamento de Mídia](#6-processamento-de-mídia)
7. [Envio de Mensagens](#7-envio-de-mensagens)
8. [Captura de Mensagens Enviadas Fora do App](#8-captura-de-mensagens-enviadas-fora-do-app)
9. [Real-time com Socket.IO](#9-real-time-com-socketio)
10. [Frontend — Chat UI](#10-frontend--chat-ui)
11. [Eventos Socket.IO — Referência](#11-eventos-socketio--referência)
12. [Evolution Go API — Referência Rápida](#12-evolution-go-api--referência-rápida)
13. [Variáveis de Ambiente](#13-variáveis-de-ambiente)
14. [Regras & Convenções](#14-regras--convenções)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Visão Geral

O BrokerCloud integra com o WhatsApp através do **Evolution Go** — um servidor open-source que atua como ponte entre o WhatsApp Web (Baileys) e nossa API.

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐     ┌──────────────┐
│  WhatsApp   │◄───►│ Evolution Go │────►│  BrokerCloud API    │────►│   Frontend   │
│  (celular)  │     │  (servidor)  │     │  (Fastify + Prisma) │     │  (Next.js)   │
└─────────────┘     └──────────────┘     └─────────────────────┘     └──────────────┘
                          │                       │     │                    ▲
                          │                       ▼     ▼                    │
                          │               ┌──────────┐ ┌──────────┐         │
                          │               │PostgreSQL│ │ Supabase │         │
                          │               │  (dados) │ │ Storage  │         │
                          │               └──────────┘ │ (mídias) │         │
                          │                            └──────────┘         │
                          │                       ┌──────────┐              │
                          └───────────────────────│Socket.IO │──────────────┘
                                                  │(real-time)│
                                                  └──────────┘
```

### Princípios da arquitetura

1. **O Evolution Go é a ponte, não o armazenamento.** Não dependemos dele pra guardar mensagens. Ele apenas entrega e recebe — nós salvamos tudo no nosso banco.
2. **Supabase Storage é o repositório de mídia.** Toda mídia (imagem, áudio, vídeo, documento) que chega pelo WhatsApp é salva no Supabase Storage e referenciada por URL pública.
3. **Socket.IO é o canal real-time.** O frontend NUNCA faz polling para novas mensagens. Tudo chega via WebSocket.
4. **Mensagens enviadas fora do app são capturadas.** Se o corretor manda mensagem pelo WhatsApp nativo do celular, o Evolution Go nos notifica e nós registramos.
5. **Uma instância do Evolution Go por deploy.** Cada tenant do BrokerCloud cria uma "instância" dentro do mesmo Evolution Go server.

---

## 2. Stack & Dependências

### Backend (`api/`)

| Pacote | Uso |
|---|---|
| `fastify` | Servidor HTTP |
| `@prisma/client` | ORM — PostgreSQL |
| `socket.io` | WebSocket server (real-time) |
| `@supabase/supabase-js` | Upload de mídia no Supabase Storage |
| `@fastify/jwt` | Autenticação JWT |
| `ioredis` | Cache / filas (futuro scaling do Socket.IO) |

### Frontend (`web/`)

| Pacote | Uso |
|---|---|
| `next` | Framework React |
| `socket.io-client` | WebSocket client |
| `@tanstack/react-query` | Cache de dados + optimistic updates |
| `@supabase/supabase-js` | Upload direto de imagens (imóveis) |
| `zustand` | State management (auth) |

---

## 3. Modelo de Dados

### Conversation (conversa WhatsApp)

```prisma
model Conversation {
  id               String   @id @default(cuid())
  tenantId         String
  leadId           String?             // Link opcional com Lead
  assignedBrokerId String?             // Corretor responsável
  whatsappJid      String              // Ex: "5511999999999@s.whatsapp.net"
  unreadCount      Int      @default(0)
  isArchived       Boolean  @default(false)
  lastMessageAt    DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@unique([tenantId, whatsappJid])    // Uma conversa por JID por tenant
}
```

### Message (mensagem)

```prisma
model Message {
  id                 String           @id @default(cuid())
  conversationId     String
  evolutionMessageId String?          // ID da msg no Evolution Go (dedup + status)
  direction          MessageDirection // 'in' = recebida, 'out' = enviada
  type               MessageType     // text, image, audio, video, document, sticker
  content            String           // Texto da msg ou caption da mídia
  mediaUrl           String?          // URL pública no Supabase Storage
  mediaMimetype      String?          // Ex: "image/jpeg", "audio/ogg; codecs=opus"
  mediaSize          Int?             // Bytes
  fileName           String?          // Nome original do arquivo (documentos)
  status             MessageStatus   // sent, delivered, read, failed
  sentAt             DateTime         @default(now())

  @@index([conversationId, sentAt])
  @@index([evolutionMessageId])       // Para dedup e status updates
}
```

### Campos do Tenant relevantes

```prisma
model Tenant {
  ...
  whatsappInstanceId    String?   // UUID da instância no Evolution Go
  whatsappInstanceToken String?   // Token de autenticação da instância
  ...
}
```

> **⚠️ ATENÇÃO:** Os campos `whatsappInstanceUrl` e `evolutionApiKey` no Tenant são legados (referentes à configuração per-tenant). A URL e API Key global do Evolution Go ficam no `.env` da API (`EVOLUTION_API_URL`, `EVOLUTION_API_KEY`). Os campos `whatsappInstanceId` e `whatsappInstanceToken` são per-tenant e identificam a instância do tenant dentro do Evolution Go.

---

## 4. Fluxo de Conexão (QR Code)

Quando um tenant conecta seu WhatsApp pela primeira vez:

```
Frontend                    API                         Evolution Go
   │                         │                              │
   │  POST /whatsapp/connect │                              │
   │────────────────────────►│                              │
   │                         │  POST /instance/create       │
   │                         │  (se não existe)             │
   │                         │─────────────────────────────►│
   │                         │◄─────────────────────────────│
   │                         │  Salva instanceId + token    │
   │                         │  no Tenant                   │
   │                         │                              │
   │                         │  POST /instance/connect      │
   │                         │  body: {                     │
   │                         │    webhookUrl: API_URL/webhooks/evolution,
   │                         │    subscribe: ['ALL'],       │
   │                         │    immediate: true           │
   │                         │  }                           │
   │                         │─────────────────────────────►│
   │                         │◄─── { qrcode: base64 } ─────│
   │◄── { state, qrCode } ──│                              │
   │                         │                              │
   │  (exibe QR na tela)     │                              │
   │                         │                              │
   │  GET /whatsapp/qr       │                              │
   │  (polling a cada 3s)    │                              │
   │────────────────────────►│  GET /instance/qr            │
   │                         │─────────────────────────────►│
   │                         │◄─────────────────────────────│
   │◄── { qrCode } ─────────│                              │
   │                         │                              │
   │  ... usuário escaneia QR no celular ...                │
   │                         │                              │
   │  GET /whatsapp/status   │                              │
   │────────────────────────►│  GET /instance/status        │
   │                         │─────────────────────────────►│
   │                         │◄── { state: 'connected' } ──│
   │◄── { state:'connected' }│                              │
   │                         │                              │
   │  (redireciona pro chat) │                              │
```

### Regras importantes da conexão

1. **O `webhookUrl` DEVE ser passado no `POST /instance/connect`.** Sem isso, o Evolution Go não sabe pra onde mandar os eventos. A URL é `{API_PUBLIC_URL}/webhooks/evolution`.
2. **O `subscribe` DEVE incluir pelo menos:** `MESSAGE`, `SEND_MESSAGE`, `READ_RECEIPT`, `CONNECTION`.  Na prática, usamos `['ALL']`.
3. **Cada tenant tem sua própria instância** no Evolution Go, identificada pelo `whatsappInstanceId`.
4. **O QR Code expira** em ~45 segundos. O frontend faz polling no `/whatsapp/qr` para pegar um novo quando expira.

### Headers da Evolution Go API

Toda chamada para a Evolution Go API usa esses headers:

```
Content-Type: application/json
apikey: {GLOBAL_API_KEY ou tenant.whatsappInstanceToken}
instanceId: {tenant.whatsappInstanceId}
```

---

## 5. Recebimento de Mensagens (Webhook)

O Evolution Go envia eventos HTTP POST para `{API_PUBLIC_URL}/webhooks/evolution`.

### Estrutura do payload

```json
{
  "event": "Message",
  "data": {
    "Info": {
      "Chat": "5511999999999@s.whatsapp.net",
      "Sender": "5511999999999:38@s.whatsapp.net",
      "IsFromMe": false,
      "IsGroup": false,
      "ID": "3EB0C05FF2D3A0068B2A2D",
      "Type": "text",
      "PushName": "João Silva",
      "Timestamp": "2024-10-10T17:17:44-03:00",
      "MediaType": ""
    },
    "Message": {
      "conversation": "Olá, tenho interesse no apartamento",
      "base64": null
    }
  },
  "instanceId": "249aad2e-68f9-464f-bc84-aca560c38f0e",
  "instanceToken": "token-da-instancia"
}
```

### Mapeamento de eventos

| Evento Evolution Go | O que significa | Ação no BrokerCloud |
|---|---|---|
| `Message` | Mensagem recebida (cliente → corretor) | Salva com `direction: 'in'`, incrementa `unreadCount`, emite socket |
| `SendMessage` | Mensagem enviada (pelo celular do corretor) | Salva com `direction: 'out'`, emite socket (dedup com `evolutionMessageId`) |
| `Receipt` | Confirmação de leitura/entrega | Atualiza `status` da mensagem (sent→delivered→read) |
| `Connected` | Instância conectou no WhatsApp | Log informativo |
| `LoggedOut` | Instância desconectou | Log + notificar frontend se socket conectado |

### Fluxo de processamento de cada mensagem

```
1. VALIDAR payload
   └─ Tem event? Tem data.Info? Tem instanceId?

2. IDENTIFICAR TENANT
   └─ prisma.tenant.findFirst({ where: { whatsappInstanceId: payload.instanceId } })
   └─ Se não encontrar → return 200 (não reprocessar)

3. EXTRAIR JID
   └─ data.Info.Chat → "5511999999999@s.whatsapp.net"

4. ENCONTRAR OU CRIAR CONVERSATION
   └─ prisma.conversation.findUnique({ where: { tenantId_whatsappJid } })
   └─ Se não existe → criar, tentar linkar com Lead pelo telefone

5. DETECTAR TIPO
   └─ data.Info.MediaType: '' → text, 'image' → image, 'video' → video, etc.

6. PROCESSAR MÍDIA (se houver)
   └─ Ver seção 6

7. EXTRAIR CONTEÚDO DE TEXTO
   └─ Ver tabela abaixo

8. VERIFICAR DUPLICATA
   └─ data.Info.ID → evolutionMessageId
   └─ Se já existe no DB → skip

9. SALVAR MENSAGEM
   └─ direction: data.Info.IsFromMe ? 'out' : 'in'

10. ATUALIZAR CONVERSATION
    └─ lastMessageAt, unreadCount (se direction='in')

11. EMITIR SOCKET EVENT
    └─ emitToTenant(tenantId, 'message:new', { conversationId, message })
```

### Extração de texto por tipo de mensagem

| Tipo | Onde está o texto |
|---|---|
| Texto simples | `data.Message.conversation` |
| Texto longo | `data.Message.extendedTextMessage.text` |
| Imagem com caption | `data.Message.imageMessage.caption` |
| Vídeo com caption | `data.Message.videoMessage.caption` |
| Documento com caption | `data.Message.documentWithCaptionMessage.message.documentMessage.caption` |
| Áudio (PTT) | `'🎤 Áudio'` (não tem texto) |
| Sticker | `'🏷️ Sticker'` (não tem texto) |
| Fallback | `'[mídia]'` |

---

## 6. Processamento de Mídia

Quando o Evolution Go envia uma mensagem com mídia, o campo `data.Message.base64` contém o arquivo codificado em base64 (quando `WEBHOOK_FILES=true`, que é o padrão).

### Fluxo de upload

```
Webhook recebe base64
       │
       ▼
Buffer.from(base64, 'base64')
       │
       ▼
Determinar extensão pelo mimetype
  image/jpeg → .jpg
  image/png  → .png
  image/webp → .webp
  audio/ogg  → .ogg
  audio/mp4  → .m4a
  video/mp4  → .mp4
  application/pdf → .pdf
  (outros) → extensão genérica pelo mimetype
       │
       ▼
Upload para Supabase Storage
  Bucket: 'broker'
  Path: chat-media/{tenantId}/{conversationId}/{messageId}.{ext}
  ContentType: mimetype original
       │
       ▼
Retorna URL pública
  https://{supabase-ref}.supabase.co/storage/v1/object/public/broker/chat-media/...
       │
       ▼
Salva no campo `mediaUrl` da Message
```

### Onde encontrar os dados de mídia no payload

| Tipo | Mimetype | Base64 | Info extra |
|---|---|---|---|
| Imagem | `data.Message.imageMessage.mimetype` | `data.Message.base64` | `width`, `height` |
| Vídeo | `data.Message.videoMessage.mimetype` | `data.Message.base64` | `seconds` |
| Áudio | `data.Message.audioMessage.mimetype` | `data.Message.base64` | `seconds`, `ptt` (voice note) |
| Documento | `data.Message.documentMessage.mimetype` | `data.Message.base64` | `fileName`, `title` |
| Sticker | `data.Message.stickerMessage.mimetype` | `data.Message.base64` | `isAnimated` |

### Limites

- **Tamanho máximo:** 25MB (limite do WhatsApp)
- **Se `base64` vier `null`:** o Evolution Go pode ter `WEBHOOK_FILES=false`. Nesse caso, logamos e salvamos como `[mídia não disponível]`.
- **Processamento assíncrono:** O upload para o Supabase é feito de forma síncrona dentro do webhook handler. Se precisar escalar, migrar para BullMQ job queue (Redis já está configurado).

### Storage: Supabase

| Contexto | Client | Credencial |
|---|---|---|
| Frontend (imagens de imóveis) | `@supabase/supabase-js` com Anon Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Backend (mídia do WhatsApp) | `@supabase/supabase-js` com Service Role Key | `SUPABASE_SERVICE_ROLE_KEY` |

> **⚠️ A Service Role Key bypassa RLS.** Nunca expor no frontend. Usar apenas no backend para upload de mídia do webhook.

---

## 7. Envio de Mensagens

Quando o usuário envia uma mensagem pelo chat do BrokerCloud:

```
Frontend                    API                          Evolution Go       WhatsApp
   │                         │                               │                │
   │  Optimistic update      │                               │                │
   │  (msg aparece na tela   │                               │                │
   │   com status 'sending') │                               │                │
   │                         │                               │                │
   │  POST /conversations    │                               │                │
   │  /:id/messages          │                               │                │
   │  { content, type }      │                               │                │
   │────────────────────────►│                               │                │
   │                         │  POST /send/text              │                │
   │                         │  { number, text }             │                │
   │                         │──────────────────────────────►│                │
   │                         │◄── { data.Info.ID } ──────────│───────────────►│
   │                         │                               │                │
   │                         │  Salva Message no DB          │                │
   │                         │  (evolutionMessageId =        │                │
   │                         │   data.Info.ID)               │                │
   │                         │                               │                │
   │                         │  socket.emit('message:sent')  │                │
   │◄── message confirmada ──│                               │                │
   │  (atualiza status       │                               │                │
   │   'sending' → 'sent')   │                               │                │
```

### Endpoints Evolution Go para envio

| Tipo | Endpoint | Body |
|---|---|---|
| Texto | `POST /send/text` | `{ number: "5511999999999", text: "Olá!" }` |
| Mídia | `POST /send/media` | `{ number, url, type: "image", caption?, filename? }` |

> **Headers:** `apikey: {tenant.whatsappInstanceToken}`, `instanceId: {tenant.whatsappInstanceId}`

> **O campo `number` é só o telefone**, sem `@s.whatsapp.net`. Ex: `"5511999999999"`, não `"5511999999999@s.whatsapp.net"`.

---

## 8. Captura de Mensagens Enviadas Fora do App

O Evolution Go emite o evento `SendMessage` quando o WhatsApp conectado envia uma mensagem por **qualquer canal** — seja pelo celular, WhatsApp Web, ou pelo nosso app.

### Fluxo

```
Corretor abre WhatsApp no celular
       │
       ▼
Envia mensagem ou foto para cliente
       │
       ▼
WhatsApp notifica Evolution Go
       │
       ▼
Evolution Go → POST /webhooks/evolution
  event: "SendMessage"
  data.Info.IsFromMe: true
       │
       ▼
BrokerCloud API recebe
       │
       ├─ Verifica dedup: evolutionMessageId já existe?
       │   └─ SIM → ignora (já foi salva quando enviamos pelo app)
       │   └─ NÃO → nova mensagem enviada fora do app
       │
       ▼
Salva com direction: 'out'
       │
       ▼
Emite socket event → aparece no chat do BrokerCloud
```

### Deduplicação

Quando enviamos pelo BrokerCloud (`POST /conversations/:id/messages`), salvamos o `evolutionMessageId` retornado pelo Evolution Go. Quando o `SendMessage` chega pelo webhook com o mesmo ID, verificamos se já existe → se existe, skip.

---

## 9. Real-time com Socket.IO

### Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                    Fastify HTTP Server                    │
│                                                          │
│  ┌────────────────┐    ┌─────────────────────────────┐  │
│  │ REST Routes    │    │   Socket.IO Server           │  │
│  │ /conversations │    │                              │  │
│  │ /webhooks      │    │  Room: tenant:{tenantId}     │  │
│  │ /whatsapp      │    │    ├── broker1 (socket)      │  │
│  │                │    │    ├── broker2 (socket)      │  │
│  │    emitToTenant()──►│    └── admin (socket)        │  │
│  └────────────────┘    │                              │  │
│                        └─────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Autenticação do Socket

```javascript
// Cliente conecta com:
const socket = io(API_URL, {
  auth: { token: accessToken }  // JWT do BrokerCloud
})

// Servidor valida:
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  const decoded = jwt.verify(token)  // Extrai tenantId, userId, role
  socket.join(`tenant:${decoded.tenantId}`)
  next()
})
```

### Fluxo de eventos

```
Webhook recebe mensagem
       │
       ▼
Processa + salva no DB
       │
       ▼
emitToTenant(tenantId, 'message:new', {
  conversationId: '...',
  message: {
    id, content, direction, type,
    mediaUrl, status, sentAt, ...
  }
})
       │
       ▼
Todos os sockets na room 'tenant:{tenantId}' recebem
       │
       ▼
Frontend: queryClient.setQueryData(
  ['messages', conversationId],
  (old) => [...old, message]
)
       │
       ▼
Mensagem aparece instantaneamente na tela
```

---

## 10. Frontend — Chat UI

### Optimistic Updates (envio de mensagem)

```typescript
// useSendMessage hook
const sendMessage = useMutation({
  mutationFn: async ({ conversationId, content }) => {
    return api.post(`/conversations/${conversationId}/messages`, { content })
  },

  onMutate: async ({ conversationId, content }) => {
    // 1. Cancela refetches pendentes
    await queryClient.cancelQueries(['messages', conversationId])

    // 2. Salva estado anterior (pra rollback)
    const previous = queryClient.getQueryData(['messages', conversationId])

    // 3. Insere mensagem otimista na cache
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content,
      direction: 'out',
      type: 'text',
      status: 'sending',  // ← status visual "enviando"
      sentAt: new Date().toISOString(),
    }

    queryClient.setQueryData(['messages', conversationId], (old) => ({
      ...old,
      data: [...(old?.data ?? []), tempMessage]
    }))

    return { previous, tempId: tempMessage.id }
  },

  onSuccess: (serverMessage, vars, context) => {
    // Troca a mensagem temp pela real (com ID do servidor)
    queryClient.setQueryData(['messages', vars.conversationId], (old) => ({
      ...old,
      data: old.data.map(m =>
        m.id === context.tempId ? serverMessage : m
      )
    }))
  },

  onError: (err, vars, context) => {
    // Rollback: restaura estado anterior
    queryClient.setQueryData(['messages', vars.conversationId], context.previous)
    // Mostrar toast de erro
  }
})
```

### Renderização de mídia nas bolhas

```
┌─────────────────────────────────┐
│  type === 'image'               │
│  ┌───────────────────────────┐  │
│  │    <img src={mediaUrl}>   │  │
│  │    (clique → lightbox)    │  │
│  └───────────────────────────┘  │
│  Caption text here...           │
│                        14:32 ✓✓ │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  type === 'audio'               │
│  ┌───────────────────────────┐  │
│  │ ▶ ━━━━━━━━━━━━━━━ 0:15  │  │
│  │   (player inline)         │  │
│  └───────────────────────────┘  │
│                        14:33 ✓✓ │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  type === 'video'               │
│  ┌───────────────────────────┐  │
│  │   <video controls>        │  │
│  │   poster={thumbnail}      │  │
│  └───────────────────────────┘  │
│  Caption text here...           │
│                        14:34 ✓✓ │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  type === 'document'            │
│  ┌───────────────────────────┐  │
│  │ 📄 contrato.pdf           │  │
│  │    125 KB  ⬇ Download     │  │
│  └───────────────────────────┘  │
│                        14:35 ✓✓ │
└─────────────────────────────────┘
```

### Status visual das mensagens

| Status | Ícone | Cor |
|---|---|---|
| `sending` | `⏳` (spinner) | Cinza |
| `sent` | `✓` (um check) | Cinza |
| `delivered` | `✓✓` (dois checks) | Cinza |
| `read` | `✓✓` (dois checks) | Azul/Primary |
| `failed` | `⚠️` (erro) | Vermelho |

---

## 11. Eventos Socket.IO — Referência

### Server → Client

| Evento | Payload | Quando |
|---|---|---|
| `message:new` | `{ conversationId: string, message: Message }` | Mensagem recebida ou enviada fora do app |
| `message:sent` | `{ conversationId: string, message: Message, tempId?: string }` | Confirmação de envio pelo app |
| `message:status` | `{ evolutionMessageId: string, status: 'delivered' \| 'read' }` | Status atualizado (checks) |
| `conversation:updated` | `{ id: string, unreadCount: number, lastMessageAt: string }` | Conversa atualizada |
| `connection:status` | `{ state: 'connected' \| 'disconnected' }` | WhatsApp conectou/desconectou |

### Client → Server

| Evento | Payload | Quando |
|---|---|---|
| `conversation:read` | `{ conversationId: string }` | Usuário abriu uma conversa (mark as read) |

---

## 12. Evolution Go API — Referência Rápida

Base URL: `EVOLUTION_API_URL` (ex: `https://zap.selectahome.com.br`)

### Autenticação

Toda request usa os headers:
```
apikey: {GLOBAL_API_KEY}  (ou tenant.whatsappInstanceToken)
instanceId: {tenant.whatsappInstanceId}  (UUID)
Content-Type: application/json
```

### Endpoints que usamos

| Método | Endpoint | Uso |
|---|---|---|
| `POST` | `/instance/create` | Criar instância para novo tenant |
| `POST` | `/instance/connect` | Conectar + configurar webhook + QR |
| `GET` | `/instance/status` | Verificar se está conectado |
| `GET` | `/instance/qr` | Pegar QR code atual |
| `DELETE` | `/instance/logout` | Desconectar |
| `POST` | `/send/text` | Enviar mensagem de texto |
| `POST` | `/send/media` | Enviar mídia (imagem, doc, etc.) |

### Webhook Events que escutamos

| Subscription | Eventos |
|---|---|
| `MESSAGE` | `Message` |
| `SEND_MESSAGE` | `SendMessage` |
| `READ_RECEIPT` | `Receipt` (Read, ReadSelf, Delivered) |
| `CONNECTION` | `Connected`, `LoggedOut` |

---

## 13. Variáveis de Ambiente

### API (`api/.env`)

```bash
# ─── Servidor ──────────────────────────────────────────
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
API_PUBLIC_URL=http://localhost:3001     # URL pública (pra webhook callback)
FRONTEND_URL=http://localhost:3000

# ─── Banco ─────────────────────────────────────────────
DATABASE_URL=postgresql://brokercloud:pass@localhost:5432/brokercloud

# ─── JWT ───────────────────────────────────────────────
JWT_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=7d

# ─── Redis ─────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── Supabase (Backend — Service Role para upload) ────
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # ⚠️ NUNCA expor no frontend

# ─── Evolution Go (WhatsApp) ──────────────────────────
EVOLUTION_API_URL=https://zap.selectahome.com.br
EVOLUTION_API_KEY=b5ccf4229f...        # Global API Key
```

### Frontend (`web/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001

# Supabase (Frontend — Anon Key para upload de imóveis)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 14. Regras & Convenções

### ✅ FAÇA

- **Sempre usar `evolutionMessageId` para deduplicação.** Nunca salvar a mesma mensagem duas vezes.
- **Sempre responder 200 ao webhook**, mesmo se der erro no processamento. Se retornar 4xx/5xx, o Evolution Go faz retry (5x a cada 30s).
- **Sempre emitir via Socket.IO após salvar no DB.** A ordem é: DB primeiro, socket depois.
- **Usar Supabase Storage para toda mídia do chat.** Path: `chat-media/{tenantId}/{conversationId}/{messageId}.{ext}`.
- **Extrair o `PushName` do contato** e usar para criar/atualizar o nome do Lead se não tiver.

### ❌ NÃO FAÇA

- **NÃO fazer polling** de mensagens no frontend. O real-time vem pelo Socket.IO.
- **NÃO guardar mídia no filesystem local.** Sempre Supabase Storage.
- **NÃO confiar no `payload.instance`** (slug) para identificar o tenant. Usar `payload.instanceId` (UUID).
- **NÃO usar a Anon Key do Supabase no backend.** Ela tem RLS e não permite upload server-side sem auth do usuário.
- **NÃO processar mensagens de grupos** (a menos que seja um requisito futuro). Filtrar por `data.Info.IsGroup === false`.
- **NÃO fazer `invalidateQueries` no frontend após Socket.IO.** O socket já injeta os dados na cache.

### Convenções de nomes

| Conceito | Nomenclatura |
|---|---|
| Número do WhatsApp | `whatsappJid` (ex: `"5511999999999@s.whatsapp.net"`) |
| Só o número | `phone` (ex: `"5511999999999"`) |
| ID da instância | `whatsappInstanceId` (UUID do Evolution Go) |
| ID da mensagem no Evolution | `evolutionMessageId` |
| Direção da mensagem | `direction: 'in' \| 'out'` |

---

## 15. Troubleshooting

### "Mensagens não chegam no BrokerCloud"

1. Verificar se o webhook está configurado: o `POST /instance/connect` foi feito com `webhookUrl`?
2. Verificar se a URL do webhook é acessível pelo Evolution Go (não pode ser `localhost` se estão em máquinas diferentes)
3. Verificar logs do webhook: `app.log.debug` no handler
4. Verificar se o `instanceId` do payload bate com o `whatsappInstanceId` do tenant

### "Imagens não aparecem no chat"

1. Verificar se `WEBHOOK_FILES=true` no Evolution Go (é o padrão)
2. Verificar se `data.Message.base64` está presente no payload
3. Verificar se o upload para Supabase Storage está funcionando (service role key correta?)
4. Verificar se o bucket `broker` tem a pasta `chat-media` com permissão pública

### "Socket.IO não conecta"

1. Verificar se o CORS do Socket.IO inclui a `FRONTEND_URL`
2. Verificar se o JWT do auth está sendo passado no `handshake.auth.token`
3. Verificar se o token não expirou (15 min padrão)
4. No Nginx, verificar se o `proxy_set_header Upgrade` e `Connection` estão configurados para WebSocket

### "Mensagem duplicada no chat"

1. Verificar a deduplicação por `evolutionMessageId`
2. Pode ser que o `SendMessage` chegou para uma mensagem já salva via `POST /conversations/:id/messages`
3. Verificar se o `evolutionMessageId` está sendo salvo corretamente no envio

### "QR Code não aparece"

1. A instância pode não ter sido criada ainda. Chamar `/instance/create` primeiro.
2. O QR code expira rápido (~45s). O frontend precisa fazer polling em `/whatsapp/qr`.
3. Se já está conectado, não retorna QR code — verificar com `/instance/status` primeiro.

---

> **Última atualização:** Junho 2026  
> **Mantido por:** Equipe BrokerCloud
