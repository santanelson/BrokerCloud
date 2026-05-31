import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'
import { createTaskSchema, updateTaskSchema, paginationSchema } from '../schemas'
import { getUser } from '../middleware/authenticate'
import { z } from 'zod'

const taskFiltersSchema = paginationSchema.extend({
  done: z.coerce.boolean().optional(),
  type: z.enum(['visita', 'ligacao', 'email', 'proposta', 'reuniao', 'outro']).optional(),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']).optional(),
  brokerId: z.string().optional(),
  leadId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export async function taskRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  // ── GET /tasks ─────────────────────────────────────────────────────────────
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const query = taskFiltersSchema.safeParse(request.query)
    if (!query.success) return reply.code(400).send({ error: 'VALIDATION_ERROR' })

    const { page, limit, done, type, priority, brokerId, leadId, from, to } = query.data
    const skip = (page - 1) * limit

    const where: any = { tenantId: user.tenantId }
    if (user.role === 'broker') where.brokerId = user.sub
    else if (brokerId) where.brokerId = brokerId

    if (done !== undefined) where.done = done
    if (type) where.type = type
    if (priority) where.priority = priority
    if (leadId) where.leadId = leadId
    if (from || to) where.dueAt = { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where, skip, take: limit,
        orderBy: [{ done: 'asc' }, { dueAt: 'asc' }],
        include: {
          lead: { select: { id: true, name: true, phone: true } },
          broker: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      prisma.task.count({ where }),
    ])

    return reply.send({ data: tasks, total, page, limit, totalPages: Math.ceil(total / limit) })
  })

  // ── POST /tasks ────────────────────────────────────────────────────────────
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const body = createTaskSchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const task = await prisma.task.create({
      data: {
        ...body.data,
        tenantId: user.tenantId,
        brokerId: body.data.brokerId ?? user.sub,
        dueAt: new Date(body.data.dueAt),
      },
    })
    return reply.code(201).send(task)
  })

  // ── PATCH /tasks/:id ───────────────────────────────────────────────────────
  app.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)
    const body = updateTaskSchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const task = await prisma.task.findFirst({ where: { id: request.params.id, tenantId: user.tenantId } })
    if (!task) return reply.code(404).send({ error: 'NOT_FOUND' })
    if (user.role === 'broker' && task.brokerId !== user.sub) return reply.code(403).send({ error: 'FORBIDDEN' })

    const data: any = { ...body.data }
    if (body.data.dueAt) data.dueAt = new Date(body.data.dueAt)
    if (body.data.done === true && !task.done) data.doneAt = new Date()
    if (body.data.done === false) data.doneAt = null

    const updated = await prisma.task.update({ where: { id: request.params.id }, data })
    return reply.send(updated)
  })

  // ── DELETE /tasks/:id ──────────────────────────────────────────────────────
  app.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)
    const task = await prisma.task.findFirst({ where: { id: request.params.id, tenantId: user.tenantId } })
    if (!task) return reply.code(404).send({ error: 'NOT_FOUND' })
    if (user.role === 'broker' && task.brokerId !== user.sub) return reply.code(403).send({ error: 'FORBIDDEN' })

    await prisma.task.delete({ where: { id: request.params.id } })
    return reply.code(204).send()
  })
}
