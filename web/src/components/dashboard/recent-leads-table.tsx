'use client'

import { LeadStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useLeads } from '@/lib/hooks'
import type { Lead } from '@/types'

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-primary' : score >= 40 ? 'bg-secondary' : 'bg-error'
  const textColor = score >= 70 ? 'text-primary' : score >= 40 ? 'text-secondary' : 'text-error'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${textColor}`}>{score}</span>
    </div>
  )
}

export function RecentLeadsTable() {
  const { data, isLoading } = useLeads({ page: 1, limit: 5, orderBy: 'createdAt', order: 'desc' })
  const leads = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-outline-variant">
        <div>
          <h3 className="font-manrope font-bold text-on-surface">Leads Recentes</h3>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            Últimos leads adicionados ao pipeline
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high/30">
              {['Lead', 'Status', 'Score', 'Interesse', 'Origem'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant text-body-sm">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Carregando...
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant text-body-sm">
                  Nenhum lead cadastrado ainda.
                </td>
              </tr>
            ) : (
              leads.map((lead: Lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-surface-container-highest/50 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={lead.name} size="sm" />
                      <div>
                        <p className="text-body-sm font-semibold text-on-surface">{lead.name}</p>
                        <p className="text-[11px] text-on-surface-variant">{lead.email || lead.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ScoreBar score={lead.score} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-body-sm text-on-surface">{lead.interestType || '—'}</p>
                    <p className="text-[11px] text-on-surface-variant">{lead.interestLocation || ''}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[11px] text-on-surface-variant">{lead.source?.replace('_', ' ') || '—'}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-outline-variant flex items-center justify-between">
        <span className="text-[11px] text-on-surface-variant">
          Exibindo <strong className="text-on-surface">{leads.length}</strong> de{' '}
          <strong className="text-on-surface">{total}</strong> leads
        </span>
        <a href="/leads" className="text-primary text-[10px] font-bold hover:underline">
          Ver todos os leads →
        </a>
      </div>
    </div>
  )
}
