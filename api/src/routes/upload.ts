import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getUser } from '../middleware/authenticate'
import { generatePresignedUploadUrl } from '../lib/storage'

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  // POST /upload — retorna { uploadUrl, publicUrl }
  // O frontend faz PUT direto na uploadUrl com o arquivo
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const { filename, contentType } = request.body as {
      filename: string
      contentType: string
    }

    if (!filename || !contentType) {
      return reply.code(400).send({ error: 'filename e contentType são obrigatórios.' })
    }

    // Gerar nome único: tenantId/timestamp-random.ext
    const ext = filename.split('.').pop() || 'bin'
    const key = `${user.tenantId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    try {
      const { uploadUrl, publicUrl } = await generatePresignedUploadUrl(key, contentType)
      return reply.code(200).send({ uploadUrl, publicUrl })
    } catch (error) {
      app.log.error(error)
      return reply.code(500).send({ error: 'Erro ao gerar URL de upload.' })
    }
  })
}
