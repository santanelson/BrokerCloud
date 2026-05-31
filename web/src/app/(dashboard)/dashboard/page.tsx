'use client'

import { DashboardMetricCard } from '@/components/dashboard/metric-card'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { RecentLeadsTable } from '@/components/dashboard/recent-leads-table'
import { QuickMessages } from '@/components/dashboard/quick-messages'
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks'
import { useLeadMetrics } from '@/lib/hooks'

export default function DashboardPage() {
  const { data: metrics } = useLeadMetrics()

  const byStatusMap: Record<string, number> = {}
  if (metrics?.byStatus) {
    for (const s of metrics.byStatus) {
      byStatusMap[s.status] = s._count
    }
  }

  const cards = [
    {
      id: 'total',
      label: 'Total de Leads',
      value: String(metrics?.total ?? '—'),
      change: metrics?.recent ?? 0,
      icon: 'groups',
      variant: 'primary' as const,
      changeLabel: 'últimos 30d',
    },
    {
      id: 'atendimento',
      label: 'Em Atendimento',
      value: String(byStatusMap['em_atendimento'] ?? '—'),
      change: 0,
      icon: 'support_agent',
      variant: 'default' as const,
      changeLabel: 'ativos',
    },
    {
      id: 'qualificados',
      label: 'Qualificados',
      value: String(byStatusMap['qualificado'] ?? '—'),
      change: 0,
      icon: 'verified',
      variant: 'default' as const,
      changeLabel: 'prontos',
    },
    {
      id: 'hot',
      label: 'Leads Quentes',
      value: String(metrics?.hotLeads ?? '—'),
      change: 0,
      icon: 'local_fire_department',
      variant: 'secondary' as const,
      changeLabel: 'score ≥ 70',
    },
    {
      id: 'fechados',
      label: 'Fechados',
      value: String(byStatusMap['fechado'] ?? '0'),
      change: 0,
      icon: 'handshake',
      variant: 'default' as const,
      changeLabel: 'convertidos',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-manrope font-bold text-headline-lg text-on-surface">
          Painel Executivo
        </h2>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Visão geral do seu pipeline em tempo real
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((m) => (
          <DashboardMetricCard key={m.id} {...m} />
        ))}
      </div>

      {/* Chart + Side Widgets */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <SalesChart />
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <QuickMessages />
          <UpcomingTasks />
        </div>
      </div>

      {/* Recent Leads */}
      <RecentLeadsTable />
    </div>
  )
}
