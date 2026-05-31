import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getUser } from '../middleware/authenticate'
import { getPresignedUrlToR2 } from '../lib/storage'

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const { filename, contentType } = request.body as { filename: string; contentType: string }

    if (!filename || !contentType) {
      return reply.code(400).send({ error: 'Filename e contentType são obrigatórios.' })
    }

    // Gerar um nome único
    const ext = filename.split('.').pop()
    const uniqueName = `${user.tenantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

    try {
      const { uploadUrl, publicUrl } = await getPresignedUrlToR2(uniqueName, contentType)

      return reply.code(201).send({ uploadUrl, publicUrl })
    } catch (error) {
      app.log.error(error)
      return reply.code(500).send({ error: 'Erro ao gerar URL de upload.' })
    }
  })
}
