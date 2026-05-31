import type { Metadata } from 'next'
import { LeadsPageClient } from '@/components/leads/leads-page-client'

export const metadata: Metadata = {
  title: 'Leads',
  description: 'Gerencie seu pipeline de leads e acompanhe o desempenho em tempo real.',
}

export default function LeadsPage() {
  return <LeadsPageClient />
}
