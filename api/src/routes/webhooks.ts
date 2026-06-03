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
  const info = payload.data?.Info
  const msgData = payload.data?.Message
  if (!info || !msgData) return

  // Skip group messages for now
  if (info.IsGroup) return

  const jid = info.Chat
  if (!jid) return

  // Dedup: check if we already saved this message (e.g. from SendMessage event)
  const evolutionMessageId = info.ID
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
  // 'Message' can be fromMe if we sent it via WhatsApp Web.
  // 'SendMessage' is always an outbound message sent outside the app.
  const isOutbound = payload.event === 'SendMessage' || info.IsFromMe
  const direction = isOutbound ? 'out' : 'in'

  // Process Media
  let mediaUrl = null
  let mediaMimetype = null
  let mediaSize = null
  
  // Extract content
  let type = 'text'
  let content = msgData.conversation || msgData.extendedTextMessage?.text

  const mediaResult = await processWebhookMedia(payload.data, tenant.id, conversation.id, evolutionMessageId)
  if (mediaResult) {
    mediaUrl = mediaResult.mediaUrl
    mediaMimetype = mediaResult.mediaMimetype
    mediaSize = mediaResult.mediaSize
    content = mediaResult.content
    
    if (mediaMimetype.includes('image')) type = 'image'
    else if (mediaMimetype.includes('video')) type = 'video'
    else if (mediaMimetype.includes('audio')) type = 'audio'
    else if (mediaMimetype.includes('application') || mediaMimetype.includes('text')) type = 'document'
    else type = 'document'
  }

  // Fallback content if empty
  if (!content) {
    content = '[mensagem vazia ou tipo não suportado]'
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
      sentAt: info.Timestamp ? new Date(info.Timestamp) : new Date(),
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
