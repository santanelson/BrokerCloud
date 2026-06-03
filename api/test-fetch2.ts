import { fetchWithEvolution } from './src/services/evolution'
import { prisma } from './src/db/client'

async function run() {
  const tenant = await prisma.tenant.findFirst({ where: { slug: { contains: 'brockershelf' } } })
  const data = await fetchWithEvolution(`/instance/fetchInstances`, {
    method: 'GET',
    headers: {
      'apikey': tenant!.whatsappInstanceToken
    }
  })
  console.log(JSON.stringify(data, null, 2))
}
run().catch(console.error)
