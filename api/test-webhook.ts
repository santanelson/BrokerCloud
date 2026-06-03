import { fetchWithEvolution } from './src/services/evolution'
import { prisma } from './src/db/client'
import * as dotenv from 'dotenv'
dotenv.config()

async function run() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: { contains: 'brockershelf' } } })
  console.log('Using API_PUBLIC_URL:', process.env.API_PUBLIC_URL)
  
  const webhookUrl = `${process.env.API_PUBLIC_URL}/webhooks/evolution`
  console.log('Webhook URL to set:', webhookUrl)

  const data = await fetchWithEvolution(`/webhook/set/${tenant!.whatsappInstanceId}`, {
    method: 'POST',
    headers: {
      'apikey': tenant!.whatsappInstanceToken
    },
    body: JSON.stringify({
      webhook: {
        url: webhookUrl,
        byEvents: false,
        base64: false,
        events: ['MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'MESSAGES_DELETE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
      }
    })
  }).catch(async (e) => {
      // try without instance id in url
      return fetchWithEvolution(`/webhook/set`, {
        method: 'POST',
        headers: {
          'instanceId': tenant!.whatsappInstanceId,
          'apikey': tenant!.whatsappInstanceToken
        },
        body: JSON.stringify({
          webhook: {
            url: webhookUrl,
            byEvents: false,
            base64: false,
            events: ['MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'MESSAGES_DELETE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
          }
        })
      })
  })
  console.log(JSON.stringify(data, null, 2))
}
run().catch(console.error)
