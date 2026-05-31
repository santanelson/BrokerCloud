import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../db/client'
import { getUser } from '../middleware/authenticate'
import { z } from 'zod'

export async function tenantRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  // ── GET /tenants/me — Tenant info do usuário logado ────────────────────────
  app.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } })
    if (!tenant) return reply.code(404).send({ error: 'NOT_FOUND' })
    return reply.send(tenant)
  })

  // ── GET /tenants/me/users — Listar usuários do tenant ─────────────────────
  app.get('/me/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    if (user.role === 'broker') return reply.code(403).send({ error: 'FORBIDDEN' })

    const users = await prisma.user.findMany({
      where: { tenantId: user.tenantId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, phone: true, active: true, lastLoginAt: true, createdAt: true },
      orderBy: { name: 'asc' },
    })
    return reply.send(users)
  })

  // ── POST /tenants/me/users — Convidar usuário ─────────────────────────────
  app.post('/me/users', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    if (user.role !== 'admin') return reply.code(403).send({ error: 'FORBIDDEN' })

    const body = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      role: z.enum(['admin', 'manager', 'broker']).default('broker'),
      password: z.string().min(8),
    }).safeParse(request.body)

    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const existing = await prisma.user.findFirst({ where: { tenantId: user.tenantId, email: body.data.email } })
    if (existing) return reply.code(409).send({ error: 'CONFLICT', message: 'Email já cadastrado neste tenant.' })

    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(body.data.password, 12)

    const newUser = await prisma.user.create({
      data: { tenantId: user.tenantId, ...body.data, passwordHash },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true },
    })
    return reply.code(201).send(newUser)
  })

  // ── PATCH /tenants/me — Atualizar configurações do tenant ─────────────────
  app.patch('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    if (user.role !== 'admin') return reply.code(403).send({ error: 'FORBIDDEN' })

    const body = z.object({
      name: z.string().min(2).optional(),
      whatsappInstanceUrl: z.string().url().optional().or(z.literal('')),
      evolutionApiKey: z.string().optional(),
    }).safeParse(request.body)

    if (!body.success) return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })

    const updated = await prisma.tenant.update({
      where: { id: user.tenantId },
      data: body.data,
    })
    return reply.send(updated)
  })
}
