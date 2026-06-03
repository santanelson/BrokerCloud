import { prisma } from '../db/client'

export interface InstanceStatus {
  instance: {
    instanceName: string
    state: 'connecting' | 'connected' | 'disconnected' | 'close' | 'refused'
  }
}

export interface InstanceConnect {
  instance: {
    instanceName: string
    state: string
  }
  base64?: string
}

const EVOLUTION_URL = process.env.EVOLUTION_API_URL
const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY
const API_PUBLIC_URL = process.env.API_PUBLIC_URL

export async function fetchWithEvolution(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${EVOLUTION_URL}${endpoint}`
  const headers = {
    'apikey': GLOBAL_API_KEY as string,
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Evolution API Error [${response.status}] at ${url}:`, errorText)
    throw new Error(`Evolution API Error: ${response.statusText}`)
  }

  return response.json()
}

export async function getInstanceConnectionState(tenantId: string, instanceName: string): Promise<InstanceStatus> {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  
  if (!tenant?.whatsappInstanceId || !tenant?.whatsappInstanceToken) {
    return { instance: { instanceName, state: 'disconnected' } }
  }

  try {
    const data = await fetchWithEvolution(`/instance/status`, {
      method: 'GET',
      headers: {
        'instanceId': tenant.whatsappInstanceId,
        'apikey': tenant.whatsappInstanceToken
      }
    })

    if (data.data && data.data.LoggedIn) {
      return { instance: { instanceName, state: 'connected' } }
    } else {
      return { instance: { instanceName, state: 'disconnected' } }
    }
  } catch (err) {
    return { instance: { instanceName, state: 'disconnected' } }
  }
}

export async function createInstance(tenantId: string, instanceName: string) {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
  const response = await fetchWithEvolution('/instance/create', {
    method: 'POST',
    body: JSON.stringify({
      name: instanceName,
      token,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS'
    })
  })

  if (response.data && response.data.id) {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        whatsappInstanceId: response.data.id,
        whatsappInstanceToken: response.data.token || token
      }
    })
  }

  return response
}

export async function connectInstance(tenantId: string, instanceName: string): Promise<InstanceConnect> {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  
  if (!tenant?.whatsappInstanceId || !tenant?.whatsappInstanceToken) {
    throw new Error("Instance not found in database")
  }

  const webhookUrl = `${API_PUBLIC_URL}/webhooks/evolution`

  // Connect and set webhook
  await fetchWithEvolution(`/instance/connect`, {
    method: 'POST',
    headers: {
      'instanceId': tenant.whatsappInstanceId,
      'apikey': tenant.whatsappInstanceToken
    },
    body: JSON.stringify({
      immediate: true,
      subscribe: ['ALL'],
      webhookUrl
    })
  }).catch((e) => {
    console.error('Error connecting instance:', e)
  })

  // Try to get QR Code
  try {
    const qrResponse = await fetchWithEvolution(`/instance/qr`, {
      method: 'GET',
      headers: {
        'instanceId': tenant.whatsappInstanceId,
        'apikey': tenant.whatsappInstanceToken
      }
    })

    if (qrResponse.data && qrResponse.data.Qrcode) {
      return {
        instance: { instanceName, state: 'connecting' },
        base64: qrResponse.data.Qrcode
      }
    }
  } catch(e) {
    console.error("Error fetching QR code", e)
  }

  return {
    instance: { instanceName, state: 'disconnected' }
  }
}

export async function logoutInstance(tenantId: string, instanceName: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  
  if (!tenant?.whatsappInstanceId || !tenant?.whatsappInstanceToken) {
    return
  }

  return fetchWithEvolution(`/instance/logout`, {
    method: 'DELETE',
    headers: {
      'instanceId': tenant.whatsappInstanceId,
      'apikey': tenant.whatsappInstanceToken
    }
  })
}

export async function sendTextMessage(tenantId: string, jid: string, text: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant?.whatsappInstanceId || !tenant?.whatsappInstanceToken) {
    throw new Error('WhatsApp not connected')
  }

  const number = jid.replace('@s.whatsapp.net', '')

  const res = await fetchWithEvolution('/send/text', {
    method: 'POST',
    headers: {
      'instanceId': tenant.whatsappInstanceId,
      'apikey': tenant.whatsappInstanceToken
    },
    body: JSON.stringify({
      number,
      text
    })
  })

  return res.key?.id || res.data?.key?.id || res.id || res.data?.Info?.ID // Returns the evolutionMessageId
}

export async function sendMediaMessage(tenantId: string, jid: string, url: string, type: string, caption?: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant?.whatsappInstanceId || !tenant?.whatsappInstanceToken) {
    throw new Error('WhatsApp not connected')
  }

  const number = jid.replace('@s.whatsapp.net', '')

  const res = await fetchWithEvolution('/send/media', {
    method: 'POST',
    headers: {
      'instanceId': tenant.whatsappInstanceId,
      'apikey': tenant.whatsappInstanceToken
    },
    body: JSON.stringify({
      number,
      url,
      type,
      caption
    })
  })

  return res.key?.id || res.data?.key?.id || res.id || res.data?.Info?.ID // Returns the evolutionMessageId
}
