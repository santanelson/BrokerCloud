import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'
import { createPropertySchema, updatePropertySchema, paginationSchema } from '../schemas'
import { getUser } from '../middleware/authenticate'
import { z } from 'zod'

const propertyFiltersSchema = paginationSchema.extend({
  search: z.string().optional(),
  type: z.enum(['apartamento', 'casa', 'terreno', 'comercial', 'rural', 'outro']).optional(),
  status: z.enum(['disponivel', 'reservado', 'vendido', 'alugado', 'inativo']).optional(),
  brokerId: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  city: z.string().optional(),
})

export async function propertyRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  // ── GET /properties ────────────────────────────────────────────────────────
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const query = propertyFiltersSchema.safeParse(request.query)
    if (!query.success) return reply.code(400).send({ error: 'VALIDATION_ERROR' })

    const { page, limit, search, type, status, brokerId, minPrice, maxPrice, city } = query.data
    const skip = (page - 1) * limit

    const where: any = { tenantId: user.tenantId }
    if (type) where.type = type
    if (status) where.status = status
    if (brokerId) where.brokerId = brokerId
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (minPrice || maxPrice) where.price = { gte: minPrice, lte: maxPrice }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { neighborhood: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { broker: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      prisma.property.count({ where }),
    ])

    return reply.send({ data: properties, total, page, limit, totalPages: Math.ceil(total / limit) })
  })

  // ── GET /properties/:id ────────────────────────────────────────────────────
  app.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)
    const property = await prisma.property.findFirst({
      where: { id: request.params.id, tenantId: user.tenantId },
      include: { broker: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    })
    if (!property) return reply.code(404).send({ error: 'NOT_FOUND' })
    return reply.send(property)
  })

  // ── POST /properties ───────────────────────────────────────────────────────
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const body = createPropertySchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const property = await prisma.property.create({
      data: {
        ...body.data,
        tenantId: user.tenantId,
        brokerId: body.data.brokerId ?? (user.role === 'broker' ? user.sub : undefined),
      },
    })
    return reply.code(201).send(property)
  })

  // ── PATCH /properties/:id ──────────────────────────────────────────────────
  app.patch('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)
    const body = updatePropertySchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const exists = await prisma.property.findFirst({ where: { id: request.params.id, tenantId: user.tenantId } })
    if (!exists) return reply.code(404).send({ error: 'NOT_FOUND' })

    const updated = await prisma.property.update({ where: { id: request.params.id }, data: body.data })
    return reply.send(updated)
  })

  // ── DELETE /properties/:id ─────────────────────────────────────────────────
  app.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const user = getUser(request)

    const exists = await prisma.property.findFirst({ where: { id: request.params.id, tenantId: user.tenantId } })
    if (!exists) return reply.code(404).send({ error: 'NOT_FOUND' })
    if (user.role === 'broker' && exists.brokerId !== user.sub) {
      return reply.code(403).send({ error: 'FORBIDDEN' })
    }

    await prisma.property.delete({ where: { id: request.params.id } })
    return reply.code(204).send()
  })
}
