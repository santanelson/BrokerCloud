import { fetchWithEvolution } from './src/services/evolution'
import { prisma } from './src/db/client'

async function run() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: { contains: 'brockershelf' } } })
  const data = await fetchWithEvolution(`/instance/status`, {
    method: 'GET',
    headers: {
      'instanceId': tenant!.whatsappInstanceId,
      'apikey': tenant!.whatsappInstanceToken
    }
  })
  console.log('Status endpoint returns:', data)
}
run().catch(console.error)
