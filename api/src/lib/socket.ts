import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'

let io: Server

export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { tenantId: string; sub: string }
      socket.data.tenantId = decoded.tenantId
      socket.data.userId = decoded.sub
      socket.join(`tenant:${decoded.tenantId}`)
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} for tenant: ${socket.data.tenantId}`)

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`)
    })
  })

  return io
}

export function emitToTenant(tenantId: string, event: string, data: any) {
  if (io) {
    io.to(`tenant:${tenantId}`).emit(event, data)
  }
}
