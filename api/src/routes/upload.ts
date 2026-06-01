import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getUser } from '../middleware/authenticate'
import { uploadFileToR2 } from '../lib/storage'

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    
    // O @fastify/multipart expõe `request.file()` para lidar com stream
    const data = await request.file()
    
    if (!data) {
      return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })
    }

    // Gerar um nome único baseado no tenant, timestamp e nome original
    const ext = data.filename.split('.').pop() || 'bin'
    const uniqueName = `${user.tenantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    try {
      const buffer = await data.toBuffer()
      const publicUrl = await uploadFileToR2(buffer, uniqueName, data.mimetype)

      return reply.code(201).send({ url: publicUrl })
    } catch (error) {
      app.log.error(error)
      return reply.code(500).send({ error: 'Erro ao fazer upload da imagem.' })
    }
  })
}
