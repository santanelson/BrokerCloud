import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'
import { createLeadSchema, updateLeadSchema, leadFiltersSchema } from '../schemas'
import { getUser } from '../middleware/authenticate'

export async function leadRoutes(app: FastifyInstance) {
  // All lead routes require authentication
  app.addHook('preHandler', app.authenticate)

  // ── GET /leads ─────────────────────────────────────────────────────────────
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const query = leadFiltersSchema.safeParse(request.query)
    if (!query.success) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: query.error.issues })
    }

    const { page, limit, search, status, source, brokerId, orderBy, order } = query.data
    const skip = (page - 1) * limit

    const where: any = { tenantId: user.tenantId }

    // Brokers only see their own leads
    if (user.role === 'broker') where.assignedBrokerId = user.sub

    if (status) where.status = status
    if (source) where.source = source
    if (brokerId && user.role !== 'broker') where.assignedBrokerId = brokerId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: order },
        include: {
          broker: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.lead.count({ where }),
    ])

    return reply.send({
      data: leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  })

  // ── GET /leads/metrics — KPIs ──────────────────────────────────────────────
  app.get('/metrics', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const where: any = { tenantId: user.tenantId }
    if (user.role === 'broker') where.assignedBrokerId = user.sub

    const [total, byStatus, hotLeads, recent] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.groupBy({ by: ['status'], where, _count: true }),
      prisma.lead.count({ where: { ...where, score: { gte: 70 } } }),
      prisma.lead.count({
        where: { ...where, createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
    ])

    const chartData = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endD = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
      
      const [leadsGenerated, salesMade] = await Promise.all([
        prisma.lead.count({ where: { ...where, createdAt: { gte: d, lte: endD } } }),
        prisma.lead.count({ where: { ...where, status: 'fechado', updatedAt: { gte: d, lte: endD } } })
      ])
      
      chartData.push({
        month: d.toLocaleString('pt-BR', { month: 'short' }).replace('.', ''),
        leads: leadsGenerated,
        sales: salesMade
      })
    }

    return reply.send({ total, byStatus, hotLeads, recent, chartData })
  })

  // ── GET /leads/:id ─────────────────────────────────────────────────────────
  app.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)
    const lead = await prisma.lead.findFirst({
      where: { id: request.params.id, tenantId: user.tenantId },
      include: {
        broker: { select: { id: true, name: true, email: true, avatarUrl: true } },
        tasks: { orderBy: { dueAt: 'asc' }, take: 10 },
        conversations: {
          include: { messages: { orderBy: { sentAt: 'desc' }, take: 1 } },
          orderBy: { lastMessageAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!lead) return reply.code(404).send({ error: 'NOT_FOUND', message: 'Lead não encontrado.' })
    if (user.role === 'broker' && lead.assignedBrokerId !== user.sub) {
      return reply.code(403).send({ error: 'FORBIDDEN' })
    }

    return reply.send(lead)
  })

  // ── POST /leads ────────────────────────────────────────────────────────────
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const body = createLeadSchema.safeParse(request.body)
    if (!body.success) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })
    }

    const lead = await prisma.lead.create({
      data: {
        ...body.data,
        tenantId: user.tenantId,
        assignedBrokerId: body.data.assignedBrokerId ?? (user.role === 'broker' ? user.sub : undefined),
        email: body.data.email || null,
      },
    })

    return reply.code(201).send(lead)
  })

  // ── PATCH /leads/:id ───────────────────────────────────────────────────────
  app.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)
    const body = updateLeadSchema.safeParse(request.body)
    if (!body.success) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })
    }

    const lead = await prisma.lead.findFirst({
      where: { id: request.params.id, tenantId: user.tenantId },
    })
    if (!lead) return reply.code(404).send({ error: 'NOT_FOUND' })
    if (user.role === 'broker' && lead.assignedBrokerId !== user.sub) {
      return reply.code(403).send({ error: 'FORBIDDEN' })
    }

    const updated = await prisma.lead.update({
      where: { id: request.params.id },
      data: { ...body.data, updatedAt: new Date() },
    })

    return reply.send(updated)
  })

  // ── DELETE /leads/:id ──────────────────────────────────────────────────────
  app.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)

    const lead = await prisma.lead.findFirst({
      where: { id: request.params.id, tenantId: user.tenantId },
    })
    if (!lead) return reply.code(404).send({ error: 'NOT_FOUND' })
    if (user.role === 'broker' && lead.assignedBrokerId !== user.sub) {
      return reply.code(403).send({ error: 'FORBIDDEN' })
    }

    await prisma.lead.delete({ where: { id: request.params.id } })
    return reply.code(204).send()
  })
}
