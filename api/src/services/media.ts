import { uploadFileToSupabaseStorage } from '../lib/storage'
import { randomUUID } from 'crypto'

export interface MediaResult {
  mediaUrl: string
  mediaMimetype: string
  mediaSize: number
  content: string // caption or placeholder
}

export async function processWebhookMedia(
  data: any,
  tenantId: string,
  conversationId: string,
  messageId: string
): Promise<MediaResult | null> {
  const type = data.Info?.MediaType
  if (!type) return null

  // If there's no base64 and it's not a text message, we can't upload
  if (!data.Message?.base64) {
    return {
      mediaUrl: '',
      mediaMimetype: '',
      mediaSize: 0,
      content: '[Mídia indisponível - base64 não enviado pelo webhook]',
    }
  }

  const base64 = data.Message.base64
  const buffer = Buffer.from(base64, 'base64')
  
  let mimetype = ''
  let content = '[mídia]'
  let ext = 'bin'

  // Extract mimetype and content (caption) based on the specific media type object
  if (data.Message.imageMessage) {
    mimetype = data.Message.imageMessage.mimetype || 'image/jpeg'
    content = data.Message.imageMessage.caption || '📸 Imagem'
  } else if (data.Message.videoMessage) {
    mimetype = data.Message.videoMessage.mimetype || 'video/mp4'
    content = data.Message.videoMessage.caption || '🎥 Vídeo'
  } else if (data.Message.audioMessage) {
    mimetype = data.Message.audioMessage.mimetype || 'audio/ogg'
    content = data.Message.audioMessage.ptt ? '🎤 Áudio' : '🎵 Áudio'
  } else if (data.Message.documentMessage || data.Message.documentWithCaptionMessage) {
    const docMsg = data.Message.documentMessage || data.Message.documentWithCaptionMessage?.message?.documentMessage
    if (docMsg) {
      mimetype = docMsg.mimetype || 'application/octet-stream'
      content = docMsg.caption || docMsg.fileName || '📄 Documento'
    }
  } else if (data.Message.stickerMessage) {
    mimetype = data.Message.stickerMessage.mimetype || 'image/webp'
    content = '🏷️ Sticker'
  }

  if (mimetype.includes('jpeg') || mimetype.includes('jpg')) ext = 'jpg'
  else if (mimetype.includes('png')) ext = 'png'
  else if (mimetype.includes('webp')) ext = 'webp'
  else if (mimetype.includes('ogg')) ext = 'ogg'
  else if (mimetype.includes('mp4')) ext = 'mp4'
  else if (mimetype.includes('pdf')) ext = 'pdf'

  const fileName = `chat-media/${tenantId}/${conversationId}/${messageId || randomUUID()}.${ext}`

  try {
    const mediaUrl = await uploadFileToSupabaseStorage(buffer, fileName, mimetype)
    return {
      mediaUrl,
      mediaMimetype: mimetype,
      mediaSize: buffer.length,
      content,
    }
  } catch (error) {
    console.error('Failed to upload webhook media:', error)
    return null
  }
}
