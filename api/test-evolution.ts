import { prisma } from './src/db/client'
import { createInstance } from './src/services/evolution'

async function run() {
  const tenant = await prisma.tenant.findFirst()
  console.log('Tenant:', tenant.slug)
  const uniqueInstanceName = `${tenant.slug}-${Math.random().toString(36).substring(2, 8)}`;
  const res = await createInstance(tenant.id, uniqueInstanceName)
  console.log('Res:', res)
  const tenantAfter = await prisma.tenant.findFirst()
  console.log('TenantAfter ID:', tenantAfter.whatsappInstanceId)
}

run().catch(console.error)
