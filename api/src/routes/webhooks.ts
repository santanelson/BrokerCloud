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

    if (!payload?.event || !payload?.instanceId) {
      return reply.code(400).send({ error: 'INVALID_PAYLOAD' })
    }

    app.log.debug({ event: payload.event, instanceId: payload.instanceId }, 'Evolution webhook received')

    try {
      const tenant = await prisma.tenant.findFirst({
        where: { whatsappInstanceId: payload.instanceId, active: true },
      })

      if (!tenant) {
        app.log.warn({ instanceId: payload.instanceId }, 'Webhook received for unknown or inactive tenant')
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

async function handleMessageEvent(payload: any, tenant: any, app: FastifyInstance) {
  // Support both legacy (Z-API/Evo v1) and standard Baileys (Evolution API v2) structures
  const key = payload.data?.key || payload.data?.message?.key
  const info = payload.data?.Info
  const msgData = payload.data?.message || payload.data?.Message
  
  if (!msgData) return

  let jid = ''
  let evolutionMessageId = ''
  let isFromMe = false
  let isGroup = false
  let timestamp = new Date()

  if (key) {
    jid = key.remoteJid
    evolutionMessageId = key.id
    isFromMe = key.fromMe
    isGroup = jid?.includes('@g.us')
    timestamp = payload.data?.messageTimestamp ? new Date(payload.data.messageTimestamp * 1000) : new Date()
  } else if (info) {
    jid = info.Chat || info.RemoteJid
    evolutionMessageId = info.ID
    isFromMe = info.IsFromMe || payload.event === 'SendMessage' || payload.event === 'send.message'
    isGroup = info.IsGroup || jid?.includes('@g.us')
    timestamp = info.Timestamp ? new Date(info.Timestamp * 1000) : new Date()
  }

  if (!jid || isGroup) return

  // Prevent creating a conversation if jid is completely undefined or invalid
  if (typeof jid !== 'string') return


  // Dedup: check if we already saved this message (e.g. from SendMessage event)
  if (evolutionMessageId) {
    const existing = await prisma.message.findFirst({
      where: { evolutionMessageId }
    })
    if (existing) return
  }

  // Find or create conversation
  let conversation = await prisma.conversation.findUnique({
    where: { tenantId_whatsappJid: { tenantId: tenant.id, whatsappJid: jid } },
  })

  if (!conversation) {
    const phone = jid.replace('@s.whatsapp.net', '').replace(/\D/g, '')
    const lead = await prisma.lead.findFirst({
      where: { tenantId: tenant.id, phone: { contains: phone.slice(-9) } },
    })

    conversation = await prisma.conversation.create({
      data: {
        tenantId: tenant.id,
        whatsappJid: jid,
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
  
  // Extract content
  let type = 'text'
  let content = msgData.conversation || msgData.extendedTextMessage?.text || msgData.imageMessage?.caption || msgData.videoMessage?.caption || ''

  const mediaResult = await processWebhookMedia(payload.data, tenant.id, conversation.id, evolutionMessageId)
  if (mediaResult) {
    mediaUrl = mediaResult.mediaUrl
    mediaMimetype = mediaResult.mediaMimetype
    mediaSize = mediaResult.mediaSize
    content = content || mediaResult.content // Preserve caption if it exists
    
    if (mediaMimetype?.includes('image')) type = 'image'
    else if (mediaMimetype?.includes('video')) type = 'video'
    else if (mediaMimetype?.includes('audio')) type = 'audio'
    else if (mediaMimetype?.includes('application') || mediaMimetype?.includes('text')) type = 'document'
    else type = 'document'
  }

  // Fallback content if empty
  if (!content) {
    if (msgData.audioMessage) {
      content = '🎵 Áudio'
      type = 'audio'
    } else if (msgData.imageMessage) {
      content = '📷 Imagem'
      type = 'image'
    } else if (msgData.videoMessage) {
      content = '🎥 Vídeo'
      type = 'video'
    } else if (msgData.documentMessage) {
      content = '📄 Documento'
      type = 'document'
    } else if (msgData.stickerMessage) {
      content = '👾 Figurinha'
      type = 'sticker'
    } else {
      content = '[mensagem vazia ou tipo não suportado]'
    }
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      evolutionMessageId,
      direction,
      type: type as any,
      content,
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
