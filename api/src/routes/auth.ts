import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/client'
import { loginSchema, registerSchema, refreshSchema } from '../schemas'
import crypto from 'crypto'

export async function authRoutes(app: FastifyInstance) {
  // ── POST /auth/register — Cria tenant + admin ─────────────────────────────
  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.safeParse(request.body)
    if (!body.success) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })
    }

    const { tenantName, name, email, password } = body.data

    // Check if email already exists
    const existing = await prisma.user.findFirst({ where: { email } })
    if (existing) {
      return reply.code(409).send({ error: 'CONFLICT', message: 'Email já cadastrado.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const slug = tenantName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6)

    const { tenant, user } = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: tenantName, slug },
      })
      const user = await tx.user.create({
        data: { tenantId: tenant.id, name, email, passwordHash, role: 'admin' },
      })
      return { tenant, user }
    })

    const accessToken = app.jwt.sign(
      { sub: user.id, tenantId: tenant.id, role: user.role, email: user.email },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' }
    )
    const refreshToken = crypto.randomBytes(64).toString('hex')
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: refreshTokenHash, expiresAt },
    })

    return reply.code(201).send({
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
    })
  })

  // ── POST /auth/login ──────────────────────────────────────────────────────
  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.safeParse(request.body)
    if (!body.success) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR', issues: body.error.issues })
    }

    const { email, password } = body.data

    const user = await prisma.user.findFirst({
      where: { email, active: true },
      include: { tenant: { select: { id: true, name: true, slug: true, plan: true } } },
    })

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return reply.code(401).send({ error: 'INVALID_CREDENTIALS', message: 'Email ou senha incorretos.' })
    }

    // Update last login
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const accessToken = app.jwt.sign(
      { sub: user.id, tenantId: user.tenantId, role: user.role, email: user.email },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' }
    )
    const refreshToken = crypto.randomBytes(64).toString('hex')
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: refreshTokenHash, expiresAt },
    })

    return reply.send({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        tenant: user.tenant,
      },
    })
  })

  // ── POST /auth/refresh ────────────────────────────────────────────────────
  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = refreshSchema.safeParse(request.body)
    if (!body.success) {
      return reply.code(400).send({ error: 'VALIDATION_ERROR' })
    }

    const tokenHash = crypto
      .createHash('sha256')
      .update(body.data.refreshToken)
      .digest('hex')

    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: { tenant: true } } },
    })

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      return reply.code(401).send({ error: 'INVALID_REFRESH_TOKEN' })
    }

    // Rotate refresh token
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } })

    const newRefreshToken = crypto.randomBytes(64).toString('hex')
    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
    await prisma.refreshToken.create({
      data: {
        userId: stored.userId,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const accessToken = app.jwt.sign(
      { sub: stored.user.id, tenantId: stored.user.tenantId, role: stored.user.role, email: stored.user.email },
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' }
    )

    return reply.send({ accessToken, refreshToken: newRefreshToken })
  })

  // ── POST /auth/logout ─────────────────────────────────────────────────────
  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = refreshSchema.safeParse(request.body)
    if (body.success) {
      const tokenHash = crypto.createHash('sha256').update(body.data.refreshToken).digest('hex')
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      })
    }
    return reply.code(204).send()
  })

  // ── GET /auth/me ──────────────────────────────────────────────────────────
  app.get('/me', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { sub } = (request as any).user
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: {
        id: true, name: true, email: true, role: true,
        avatarUrl: true, phone: true,
        tenant: { select: { id: true, name: true, slug: true, plan: true } },
      },
    })
    if (!user) return reply.code(404).send({ error: 'NOT_FOUND' })
    return reply.send(user)
  })
}
