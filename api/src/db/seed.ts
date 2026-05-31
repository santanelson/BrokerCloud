import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding BrokerCloud database...')

  // ── Tenant ─────────────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-imobiliaria' },
    update: {},
    create: {
      name: 'Demo Imobiliária',
      slug: 'demo-imobiliaria',
      plan: 'pro',
    },
  })

  // ── Admin ──────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@demo.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Alexandre (Admin)',
      email: 'admin@demo.com',
      passwordHash: adminHash,
      role: 'admin',
    },
  })

  // ── Corretor ───────────────────────────────────────────────────────────────
  const brokerHash = await bcrypt.hash('broker123', 12)
  const broker = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'corretor@demo.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'João Corretor',
      email: 'corretor@demo.com',
      passwordHash: brokerHash,
      role: 'broker',
      phone: '(11) 99999-1234',
    },
  })

  // ── Leads ──────────────────────────────────────────────────────────────────
  const leadsData = [
    { name: 'Beatriz Silveira', email: 'b.silveira@email.com', phone: '11999990001', status: 'qualificado' as const, source: 'instagram' as const, score: 88, interestType: 'apartamento' as const, interestLocation: 'Lapa, SP', budget: 650000 },
    { name: 'Ricardo Mendonça', email: 'ricardo.m@webmail.com', phone: '11999990002', status: 'em_atendimento' as const, source: 'indicacao' as const, score: 64, interestType: 'casa' as const, interestLocation: 'Alphaville', budget: 1200000 },
    { name: 'Ana Clara Costa', email: 'ana.clara@empresa.com', phone: '11999990003', status: 'novo' as const, source: 'facebook_ads' as const, score: 42, interestType: 'apartamento' as const, interestLocation: 'Moema, SP', budget: 400000 },
    { name: 'Marcos Valério', email: 'm.valerio@invest.com', phone: '11999990004', status: 'perdido' as const, source: 'google_ads' as const, score: 15, interestType: 'comercial' as const, interestLocation: 'Centro, SP', budget: 800000 },
    { name: 'Fernanda Alves', email: 'f.alves@hotmail.com', phone: '11999990005', status: 'proposta' as const, source: 'portal_imoveis' as const, score: 76, interestType: 'apartamento' as const, interestLocation: 'Pinheiros, SP', budget: 550000 },
    { name: 'Carlos Eduardo', email: 'c.edu@email.com', phone: '11999990006', status: 'qualificado' as const, source: 'indicacao' as const, score: 91, interestType: 'apartamento' as const, interestLocation: 'Jardins, SP', budget: 1500000 },
  ]

  for (const leadData of leadsData) {
    await prisma.lead.upsert({
      where: { id: `seed-lead-${leadData.phone}` },
      update: {},
      create: {
        id: `seed-lead-${leadData.phone}`,
        tenantId: tenant.id,
        assignedBrokerId: broker.id,
        ...leadData,
      },
    })
  }

  // ── Properties ─────────────────────────────────────────────────────────────
  const propertiesData = [
    { title: 'Apartamento Luxo Centro', type: 'apartamento' as const, price: 850000, area: 120, bedrooms: 3, bathrooms: 2, parkingSpots: 2, address: 'Rua Augusta, 1200', neighborhood: 'Consolação', city: 'São Paulo', state: 'SP' },
    { title: 'Casa Unifamiliar Alphaville', type: 'casa' as const, price: 1800000, area: 350, bedrooms: 4, bathrooms: 4, parkingSpots: 4, address: 'Av. Yojiro Takaoka, 100', neighborhood: 'Alphaville', city: 'Santana de Parnaíba', state: 'SP' },
    { title: 'Studio Executivo Pinheiros', type: 'apartamento' as const, price: 380000, area: 42, bedrooms: 1, bathrooms: 1, parkingSpots: 1, address: 'Rua dos Pinheiros, 800', neighborhood: 'Pinheiros', city: 'São Paulo', state: 'SP' },
  ]

  for (const propData of propertiesData) {
    await prisma.property.create({
      data: { tenantId: tenant.id, brokerId: broker.id, ...propData, status: 'disponivel', images: [], features: [] },
    }).catch(() => {}) // Ignore duplicates in re-seed
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────
  await prisma.task.create({
    data: {
      tenantId: tenant.id,
      brokerId: broker.id,
      title: 'Visita Família Oliveira',
      type: 'visita',
      priority: 'alta',
      dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  }).catch(() => {})

  await prisma.task.create({
    data: {
      tenantId: tenant.id,
      brokerId: broker.id,
      title: 'Revisão de Contrato',
      type: 'proposta',
      priority: 'urgente',
      dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  }).catch(() => {})

  console.log(`✅ Seed completo!`)
  console.log(`   Tenant: ${tenant.name} (slug: ${tenant.slug})`)
  console.log(`   Admin:     admin@demo.com / admin123`)
  console.log(`   Corretor:  corretor@demo.com / broker123`)
  console.log(`   ${leadsData.length} leads criados`)
  console.log(`   ${propertiesData.length} imóveis criados`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
