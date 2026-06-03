import { prisma } from './src/db/client'
import { fetchWithEvolution } from './src/services/evolution'

async function run() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: { contains: 'brockershelf' } } })
  // we need to get the actual instanceName. It might be different from tenant slug.
  // We can fetch /instance/fetchInstances to find it if we know the ID, or just use /instance/connectionState/INSTANCE_NAME
  const data = await fetchWithEvolution(`/instance/connectionState/${tenant!.whatsappInstanceId}`, {
    method: 'GET',
    headers: {
      'instanceId': tenant!.whatsappInstanceId,
      'apikey': tenant!.whatsappInstanceToken
    }
  })
  console.log(data)
}
run().catch(console.error)
