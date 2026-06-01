import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { getUser } from '../middleware/authenticate'
import { uploadFileToR2, generatePresignedUploadUrl } from '../lib/storage'

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.authenticate)

  // ─── Direct-to-Cloud Upload Flow ──────────────────────────────────────────────
  
  // 1. Gera URL assinada (Presign)
  app.post('/presign', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const { filename, contentType, size } = request.body as {
      filename: string
      contentType: string
      size: number
    }

    if (!filename || !contentType) {
      return reply.code(400).send({ error: 'Parâmetros filename e contentType são obrigatórios.' })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(contentType)) {
      return reply.code(400).send({ error: 'Tipo de arquivo não suportado. Use JPG, PNG ou WEBP.' })
    }

    const ext = filename.split('.').pop() || 'bin'
    const key = `${user.tenantId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    try {
      const { uploadUrl, publicUrl } = await generatePresignedUploadUrl(key, contentType)
      app.log.info({ key, user: user.id }, 'Gerada presigned URL para upload')
      return reply.code(200).send({ uploadUrl, publicUrl, key })
    } catch (error: any) {
      app.log.error({ err: error }, 'Erro ao gerar URL presigned para o R2')
      return reply.code(500).send({ error: 'Erro de conexão com o Cloudflare R2', details: error.message })
    }
  })

  // 2. Confirmação pós-upload
  app.post('/confirm', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    const { key, url, size, contentType } = request.body as {
      key: string
      url: string
      size: number
      contentType: string
    }

    app.log.info({ key, url, user: user.id, size }, 'Upload confirmado pelo frontend via R2')
    // No futuro, podemos salvar os metadados no Postgres aqui
    return reply.code(200).send({ success: true, url })
  })

  // ─── Rota Legada (Backend Proxy / Multipart Fallback) ───────────────────────
  app.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const user = getUser(request)
    
    try {
      const data = await request.file()
      if (!data) {
        return reply.code(400).send({ error: 'Nenhum arquivo enviado.' })
      }

      const ext = data.filename.split('.').pop() || 'bin'
      const uniqueName = `${user.tenantId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`

      const buffer = await data.toBuffer()
      const publicUrl = await uploadFileToR2(buffer, uniqueName, data.mimetype)

      return reply.code(201).send({ url: publicUrl })
    } catch (error: any) {
      app.log.error({ err: error }, 'Erro fatal na rota legado de upload')
      return reply.code(500).send({ 
        error: 'Erro de comunicação com o Cloudflare R2 na rota proxy.', 
        details: error.message || String(error)
      })
    }
  })
}
