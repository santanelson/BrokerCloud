import { prisma } from './src/db/client'
import { getInstanceConnectionState, fetchWithEvolution } from './src/services/evolution'

async function run() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: { contains: 'brockershelf' } } })
  console.log('Tenant:', tenant.slug)
  
  const status = await getInstanceConnectionState(tenant.id, tenant.slug)
  console.log('Status helper:', status)

  const data = await fetchWithEvolution(`/instance/status`, {
    method: 'GET',
    headers: {
      'instanceId': tenant.whatsappInstanceId,
      'apikey': tenant.whatsappInstanceToken
    }
  })

  console.log('Raw status API from evolution:', data)
}

run().catch(console.error)
