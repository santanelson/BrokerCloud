import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'
import { processWebhookMedia } from '../services/media'
import { emitToTenant } from '../lib/socket'

// Evolution Go Webhook — Receives WhatsApp events in real-time
export async function webhookRoutes(app: FastifyInstance) {
  app.post('/evolution', {
    config: { rateLimit: { max: 1000 } },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.body as any

    const instanceId = payload?.instance || payload?.instanceId || payload?.data?.instance
    if (!payload?.event || !instanceId) {
      return reply.code(400).send({ error: 'INVALID_PAYLOAD' })
    }

    app.log.debug({ event: payload.event, instanceId }, 'Evolution webhook received')

    // DEBUG: Dump payload to a file to inspect its structure
    try {
      require('fs').appendFileSync('webhook_debug.log', JSON.stringify(payload, null, 2) + '\n\n');
    } catch (e) {}

    try {
      const tenant = await prisma.tenant.findFirst({
        where: { whatsappInstanceId: instanceId, active: true },
      })

      if (!tenant) {
        app.log.warn({ instanceId }, 'Webhook received for unknown or inactive tenant')
        return reply.code(200).send({ received: true })
      }

      switch (payload.event) {
        case 'Message':
        case 'SendMessage':
        case 'messages.upsert':
          await handleMessageEvent(payload, tenant, app)
          break
        case 'Receipt':
          await handleReceiptEvent(payload, tenant, app)
          break
        case 'Connected':
          app.log.info({ tenantId: tenant.id }, 'WhatsApp Connected')
          // TODO: emit socket connection status
          break
        case 'LoggedOut':
          app.log.info({ tenantId: tenant.id }, 'WhatsApp Logged Out')
          // TODO: emit socket connection status
          break
        default:
          app.log.debug({ event: payload.event }, 'Unhandled Evolution event')
      }
    } catch (err) {
      app.log.error(err, 'Error processing Evolution webhook')
      // Always return 200 so Evolution Go doesn't retry infinitely
    }

    return reply.code(200).send({ received: true })
  })
}

function extractMessageData(body: any) {
  const key = body.data?.key || body.data?.message?.key
  const info = body.data?.Info
  const msgData = body.data?.message || body.data?.Message

  let remoteJid = null
  let evolutionMessageId = null
  let isFromMe = false
  let pushName = body.data?.pushName || info?.PushName || ''

  if (key) {
    remoteJid = key.remoteJid
    evolutionMessageId = key.id
    isFromMe = key.fromMe
  } else if (info) {
    remoteJid = info.Chat || info.RemoteJid
    evolutionMessageId = info.ID
    isFromMe = info.IsFromMe || body.event === 'SendMessage' || body.event === 'send.message'
  }

  let content = msgData?.conversation || msgData?.extendedTextMessage?.text || msgData?.imageMessage?.caption || msgData?.videoMessage?.caption || ''
  
  let mediaType = null
  if (msgData?.imageMessage) mediaType = 'image'
  else if (msgData?.videoMessage) mediaType = 'video'
  else if (msgData?.audioMessage) mediaType = 'audio'
  else if (msgData?.documentMessage) mediaType = 'document'
  else if (msgData?.stickerMessage) mediaType = 'sticker'

  return { remoteJid, evolutionMessageId, isFromMe, pushName, content, mediaType, msgData }
}

async function handleMessageEvent(payload: any, tenant: any, app: FastifyInstance) {
  // Logger temporário estruturado (pode ser removido após validação em produção)
  app.log.info({ event: payload.event, rawBody: payload }, '[webhook] payload recebido')

  const { remoteJid, evolutionMessageId, isFromMe, pushName, content, mediaType, msgData } = extractMessageData(payload)

  if (!remoteJid || !evolutionMessageId) return
  if (remoteJid.endsWith('@g.us')) return

  // Dedup: check se já salvamos essa mensagem
  const existing = await prisma.message.findFirst({
    where: { evolutionMessageId }
  })
  if (existing) return

  const timestamp = payload.data?.messageTimestamp 
    ? new Date(payload.data.messageTimestamp * 1000) 
    : (payload.data?.Info?.Timestamp ? new Date(payload.data.Info.Timestamp * 1000) : new Date())

  let conversation = await prisma.conversation.findUnique({
    where: { tenantId_whatsappJid: { tenantId: tenant.id, whatsappJid: remoteJid } },
  })

  if (!conversation) {
    const phone = remoteJid.replace('@s.whatsapp.net', '').replace(/\D/g, '')
    const lead = await prisma.lead.findFirst({
      where: { tenantId: tenant.id, phone: { contains: phone.slice(-9) } },
    })

    conversation = await prisma.conversation.create({
      data: {
        tenantId: tenant.id,
        whatsappJid: remoteJid,
        leadId: lead?.id ?? null,
      },
    })
  }

  // Determine direction
  const direction = isFromMe ? 'out' : 'in'

  // Process Media
  let mediaUrl = null
  let mediaMimetype = null
  let mediaSize = null
  
  let finalType = mediaType || 'text'
  let finalContent = content

  const mediaResult = await processWebhookMedia(payload.data, tenant.id, conversation.id, evolutionMessageId)
  if (mediaResult) {
    mediaUrl = mediaResult.mediaUrl
    mediaMimetype = mediaResult.mediaMimetype
    mediaSize = mediaResult.mediaSize
    finalContent = finalContent || mediaResult.content // Preserve caption se existir
    
    if (mediaMimetype?.includes('image')) finalType = 'image'
    else if (mediaMimetype?.includes('video')) finalType = 'video'
    else if (mediaMimetype?.includes('audio')) finalType = 'audio'
    else if (mediaMimetype?.includes('application') || mediaMimetype?.includes('text')) finalType = 'document'
    else finalType = 'document'
  }

  // Fallback content se vazio
  if (!finalContent) {
    if (mediaType === 'audio') {
      finalContent = '🎵 Áudio'
      finalType = 'audio'
    } else if (mediaType === 'image') {
      finalContent = '📷 Imagem'
      finalType = 'image'
    } else if (mediaType === 'video') {
      finalContent = '🎥 Vídeo'
      finalType = 'video'
    } else if (mediaType === 'document') {
      finalContent = '📄 Documento'
      finalType = 'document'
    } else if (mediaType === 'sticker') {
      finalContent = '👾 Figurinha'
      finalType = 'sticker'
    } else {
      finalContent = '[mensagem vazia ou tipo não suportado]'
    }
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      evolutionMessageId,
      direction,
      type: finalType as any,
      content: finalContent,
      mediaUrl,
      mediaMimetype,
      mediaSize,
      status: direction === 'out' ? 'sent' : 'delivered',
      sentAt: timestamp,
    },
  })

  // Update conversation
  const updateData: any = {
    lastMessageAt: message.sentAt,
  }
  if (direction === 'in') {
    updateData.unreadCount = { increment: 1 }
  }

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: updateData,
  })

  emitToTenant(tenant.id, 'message:new', { conversationId: conversation.id, message })
}

async function handleReceiptEvent(payload: any, tenant: any, app: FastifyInstance) {
  const state = payload.state // Read, ReadSelf, Delivered
  const messageIds = payload.data?.MessageIDs || []
  if (!messageIds.length || !state) return

  const statusMap: Record<string, string> = {
    Delivered: 'delivered',
    Read: 'read',
    ReadSelf: 'read',
  }

  const newStatus = statusMap[state]
  if (!newStatus) return

  await prisma.message.updateMany({
    where: {
      evolutionMessageId: { in: messageIds },
      conversation: { tenantId: tenant.id }
    },
    data: { status: newStatus as any },
  })

  emitToTenant(tenant.id, 'message:status', { messageIds, status: newStatus })
}
