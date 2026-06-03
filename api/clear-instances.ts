import { prisma } from './src/db/client'

async function run() {
  await prisma.tenant.updateMany({
    data: {
      whatsappInstanceId: null,
      whatsappInstanceToken: null
    }
  })
  console.log('Instances cleared')
}

run().catch(console.error)
