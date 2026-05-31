import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import multipart from '@fastify/multipart'

import { prisma } from './db/client'
import { authRoutes } from './routes/auth'
import { leadRoutes } from './routes/leads'
import { propertyRoutes } from './routes/properties'
import { taskRoutes } from './routes/tasks'
import { conversationRoutes } from './routes/conversations'
import { webhookRoutes } from './routes/webhooks'
import { tenantRoutes } from './routes/tenants'
import { uploadRoutes } from './routes/upload'
import { authenticate } from './middleware/authenticate'

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
})

async function bootstrap() {
  // ── Plugins ────────────────────────────────────────────────────────────────
  await app.register(helmet, { contentSecurityPolicy: false })

  await app.register(cors, {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
  })

  await app.register(multipart, {
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  })

  await app.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' },
  })

  // ── Decorators ─────────────────────────────────────────────────────────────
  app.decorate('authenticate', authenticate)

  // ── Health check ───────────────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))

  // ── Routes ─────────────────────────────────────────────────────────────────
  await app.register(authRoutes, { prefix: '/auth' })
  await app.register(tenantRoutes, { prefix: '/tenants' })
  await app.register(leadRoutes, { prefix: '/leads' })
  await app.register(propertyRoutes, { prefix: '/properties' })
  await app.register(taskRoutes, { prefix: '/tasks' })
  await app.register(conversationRoutes, { prefix: '/conversations' })
  await app.register(webhookRoutes, { prefix: '/webhooks' })
  await app.register(uploadRoutes, { prefix: '/upload' })

  // ── Graceful shutdown ──────────────────────────────────────────────────────
  const signals = ['SIGINT', 'SIGTERM']
  signals.forEach((signal) => {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, shutting down gracefully...`)
      await app.close()
      await prisma.$disconnect()
      process.exit(0)
    })
  })

  // ── Start ──────────────────────────────────────────────────────────────────
  const port = Number(process.env.PORT ?? 3001)
  const host = process.env.HOST ?? '0.0.0.0'

  try {
    await app.listen({ port, host })
    app.log.info(`🚀 BrokerCloud API running on http://${host}:${port}`)
  } catch (err) {
    app.log.error(err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

bootstrap()
