import { FastifyReply, FastifyRequest } from 'fastify'

export interface JwtPayload {
  sub: string       // userId
  tenantId: string
  role: string
  email: string
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const payload = await request.jwtVerify<JwtPayload>()
    // Inject user context into request for use in route handlers
    ;(request as any).user = payload
  } catch (err) {
    reply.code(401).send({
      error: 'UNAUTHORIZED',
      message: 'Token inválido ou expirado.',
    })
  }
}

// Helper to get typed user from request
export function getUser(request: FastifyRequest): JwtPayload {
  return (request as any).user as JwtPayload
}
