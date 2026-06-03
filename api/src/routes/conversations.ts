import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'
import { getUser } from '../middleware/authenticate'
import { paginationSchema } from '../schemas'
import { z } from 'zod'
import { sendTextMessage, sendMediaMessage } from '../services/evolution'
import { emitToTenant } from '../lib/socket'
const sendMessageSchema = z.object({
  content: z.string().min(1),
  type: z.enum(['text', 'image', 'audio', 'video', 'document']).default('text'),
  mediaUrl: z.string().url().optional(),
  fileName: z.string().optional(),
})

export async function conversationRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  // ── GET /conversations ─────────────────────────────────────────────────────
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const query = paginationSchema.extend({
      archived: z.coerce.boolean().default(false),
      unreadOnly: z.coerce.boolean().default(false),
    }).safeParse(request.query)

    if (!query.success) return reply.code(400).send({ error: 'VALIDATION_ERROR' })

    const { page, limit, archived, unreadOnly } = query.data
    const skip = (page - 1) * limit

    const where: any = { tenantId: user.tenantId, isArchived: archived }
    if (user.role === 'broker') where.assignedBrokerId = user.sub
    if (unreadOnly) where.unreadCount = { gt: 0 }

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where, skip, take: limit,
        orderBy: { lastMessageAt: 'desc' },
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          broker: { select: { id: true, name: true, avatarUrl: true } },
          messages: { orderBy: { sentAt: 'desc' }, take: 1 },
        },
      }),
      prisma.conversation.count({ where }),
    ])

    return reply.send({ data: conversations, total, page, limit, totalPages: Math.ceil(total / limit) })
  })

  // ── GET /conversations/:id/messages ───────────────────────────────────────
  app.get('/:id/messages', async (
    request: FastifyRequest<{ Params: { id: string }; Querystring: { cursor?: string; limit?: string } }>,
    reply: FastifyReply
  ) => {
    const user = getUser(request)
    const conv = await prisma.conversation.findFirst({
      where: { id: request.params.id, tenantId: user.tenantId },
    })
    if (!conv) return reply.code(404).send({ error: 'NOT_FOUND' })

    const limit = Math.min(Number(request.query.limit ?? 50), 100)
    const cursor = request.query.cursor

    const messages = await prisma.message.findMany({
      where: { conversationId: request.params.id },
      orderBy: { sentAt: 'desc' },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    // Mark as read
    if (conv.unreadCount > 0) {
      await prisma.conversation.update({
        where: { id: request.params.id },
        data: { unreadCount: 0 },
      })
    }

    return reply.send({
      data: messages.reverse(),
      nextCursor: messages.length === limit ? messages[0]?.id : null,
    })
  })

  // ── POST /conversations/:id/messages — Enviar mensagem ────────────────────
  app.post('/:id/messages', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const user = getUser(request)
    const body = sendMessageSchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const conv = await prisma.conversation.findFirst({
      where: { id: request.params.id, tenantId: user.tenantId },
    })
    if (!conv) return reply.code(404).send({ error: 'NOT_FOUND' })

    let evolutionMessageId: string | undefined

    try {
      if (body.data.type === 'text') {
        evolutionMessageId = await sendTextMessage(conv.tenantId, conv.whatsappJid, body.data.content)
      } else if (body.data.mediaUrl) {
        evolutionMessageId = await sendMediaMessage(
          conv.tenantId, 
          conv.whatsappJid, 
          body.data.mediaUrl, 
          body.data.type, 
          body.data.content !== '[mídia]' ? body.data.content : undefined
        )
      }
    } catch (e: any) {
      app.log.error(e, 'Error sending WhatsApp message')
      return reply.code(500).send({ error: 'WHATSAPP_ERROR', message: e.message })
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conv.id,
        evolutionMessageId,
        direction: 'out',
        type: body.data.type,
        content: body.data.content,
        mediaUrl: body.data.mediaUrl,
        fileName: body.data.fileName,
        status: 'sent',
      },
    })

    await prisma.conversation.update({
      where: { id: conv.id },
      data: { lastMessageAt: new Date() },
    })

    emitToTenant(conv.tenantId, 'message:sent', { conversationId: conv.id, message })

    return reply.code(201).send(message)
  })

  // ── PATCH /conversations/:id/assign ───────────────────────────────────────
  app.patch('/:id/assign', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const user = getUser(request)
    if (user.role === 'broker') return reply.code(403).send({ error: 'FORBIDDEN' })

    const body = z.object({ brokerId: z.string().cuid().nullable() }).safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR' })

    const conv = await prisma.conversation.findFirst({ where: { id: request.params.id, tenantId: user.tenantId } })
    if (!conv) return reply.code(404).send({ error: 'NOT_FOUND' })

    const updated = await prisma.conversation.update({
      where: { id: request.params.id },
      data: { assignedBrokerId: body.data.brokerId },
    })
    return reply.send(updated)
  })

  // ── PATCH /conversations/:id/archive ──────────────────────────────────────
  app.patch('/:id/archive', async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const user = getUser(request)
    const body = z.object({ archived: z.boolean() }).safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR' })

    const conv = await prisma.conversation.findFirst({ where: { id: request.params.id, tenantId: user.tenantId } })
    if (!conv) return reply.code(404).send({ error: 'NOT_FOUND' })

    const updated = await prisma.conversation.update({
      where: { id: request.params.id },
      data: { isArchived: body.data.archived },
    })
    return reply.send(updated)
  })
}
