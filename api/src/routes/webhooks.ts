import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'

// Webhook do Evolution Go — recebe mensagens WhatsApp em tempo real
export async function webhookRoutes(app: FastifyInstance) {
  // ── POST /webhooks/evolution ───────────────────────────────────────────────
  // O Evolution Go chama este endpoint quando chega uma mensagem nova
  app.post('/evolution', {
    config: { rateLimit: { max: 1000 } }, // Higher limit for webhooks
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.body as any

    // Validate basic structure
    if (!payload?.event || !payload?.instance) {
      return reply.code(400).send({ error: 'INVALID_PAYLOAD' })
    }

    app.log.debug({ event: payload.event }, 'Evolution webhook received')

    try {
      switch (payload.event) {
        case 'messages.upsert': {
          await handleIncomingMessage(payload)
          break
        }
        case 'messages.update': {
          await handleMessageUpdate(payload)
          break
        }
        case 'connection.update': {
          app.log.info({ instance: payload.instance, state: payload.data?.state }, 'WhatsApp connection update')
          break
        }
        default:
          app.log.debug({ event: payload.event }, 'Unhandled Evolution event')
      }
    } catch (err) {
      app.log.error(err, 'Error processing Evolution webhook')
      // Return 200 anyway to prevent Evolution Go from retrying
    }

    return reply.code(200).send({ received: true })
  })
}

async function handleIncomingMessage(payload: any) {
  const messages = payload.data?.messages ?? []
  if (!messages.length) return

  for (const msg of messages) {
    // Skip messages sent by us
    if (msg.key?.fromMe) continue

    const jid = msg.key?.remoteJid
    if (!jid) continue

    // Find which tenant this instance belongs to
    // (instanceId = tenant slug, configured when setting up Evolution Go per tenant)
    const tenant = await prisma.tenant.findFirst({
      where: { slug: payload.instance, active: true },
    })
    if (!tenant) return

    // Find or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { tenantId_whatsappJid: { tenantId: tenant.id, whatsappJid: jid } },
    })

    if (!conversation) {
      // Try to match existing lead by phone number
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

    // Extract message content
    const type = msg.message?.imageMessage ? 'image'
      : msg.message?.audioMessage ? 'audio'
      : msg.message?.videoMessage ? 'video'
      : msg.message?.documentMessage ? 'document'
      : 'text'

    const content = msg.message?.conversation
      ?? msg.message?.extendedTextMessage?.text
      ?? msg.message?.imageMessage?.caption
      ?? msg.message?.videoMessage?.caption
      ?? '[mídia]'

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        direction: 'in',
        type,
        content,
        status: 'delivered',
        sentAt: new Date(msg.messageTimestamp * 1000),
      },
    })

    // Update unread count and last message time
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        unreadCount: { increment: 1 },
        lastMessageAt: new Date(msg.messageTimestamp * 1000),
      },
    })

    // TODO: Emit Socket.io event to connected broker
    // io.to(`tenant:${tenant.id}`).emit('new_message', { conversationId: conversation.id, message })
  }
}

async function handleMessageUpdate(payload: any) {
  const updates = payload.data?.messages ?? []
  for (const update of updates) {
    if (!update.key?.id) continue
    const statusMap: Record<string, string> = {
      DELIVERY_ACK: 'delivered',
      READ: 'read',
      PLAYED: 'read',
    }
    const status = statusMap[update.update?.status]
    if (!status) continue

    // We store by content, so we just log for now
    // In production: store Evolution message ID and update by it
    prisma.message.updateMany({
      where: { conversationId: { not: undefined } }, // placeholder
      data: { status: status as any },
    }).catch(() => {})
  }
}
