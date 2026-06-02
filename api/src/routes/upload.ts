import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.code(400).send({ 
      error: 'Upload via API desativado.', 
      message: 'O upload agora é feito de forma otimizada (WebP) diretamente pelo Frontend usando o Supabase Storage.' 
    })
  })
}
