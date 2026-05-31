'use client'

import { useState } from 'react'
import { LeadStatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn, formatRelativeTime } from '@/lib/utils'
import { useLeads, useLeadMetrics, useCreateLead, useDeleteLead } from '@/lib/hooks'
import type { Lead } from '@/types'

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-primary' : score >= 40 ? 'bg-secondary' : 'bg-error'
  const textColor = score >= 70 ? 'text-primary' : score >= 40 ? 'text-secondary' : 'text-error'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-surface-container-highest rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold ${textColor}`}>{score}</span>
    </div>
  )
}

export function LeadsPageClient() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [page, setPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filters: Record<string, any> = { page, limit: 20 }
  if (search) filters.search = search
  if (statusFilter !== 'todos') filters.status = statusFilter

  const { data, isLoading } = useLeads(filters)
  const { data: metrics } = useLeadMetrics()
  const deleteLead = useDeleteLead()

  const leads = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const metricCards = [
    { label: 'Total de Leads', value: String(metrics?.total ?? '—'), change: `+${metrics?.recent ?? 0} novos`, icon: 'groups', color: 'text-primary bg-primary/10' },
    { label: 'Leads Quentes', value: String(metrics?.hotLeads ?? '—'), change: 'Score ≥ 70', icon: 'local_fire_department', color: 'text-tertiary bg-tertiary/10' },
    { label: 'Em Atendimento', value: String(metrics?.byStatus?.find((s: any) => s.status === 'em_atendimento')?._count ?? '0'), change: 'Ativos', icon: 'support_agent', color: 'text-secondary bg-secondary/10' },
    { label: 'Fechados', value: String(metrics?.byStatus?.find((s: any) => s.status === 'fechado')?._count ?? '0'), change: 'Convertidos', icon: 'handshake', color: 'text-on-surface bg-surface-container-highest' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-manrope font-bold text-headline-lg text-on-surface">
            Gerenciamento de Leads
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Gerencie seu pipeline e acompanhe o desempenho em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" size="md" onClick={() => setShowCreateModal(true)}>
            <span className="material-symbols-outlined text-lg">person_add</span>
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <div key={m.label} className="bg-surface-container rounded-xl p-5 border border-outline-variant hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn('p-2 rounded-lg', m.color)}>
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">{m.change}</span>
            </div>
            <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">{m.label}</p>
            <p className="font-manrope font-bold text-2xl text-on-surface">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-60 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full h-9 bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['todos', 'novo', 'em_atendimento', 'qualificado', 'proposta', 'fechado', 'perdido'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all',
                statusFilter === s
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary'
              )}
            >
              {s === 'todos' ? 'Todos' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-high/30">
                {['Lead', 'Status', 'Score', 'Interesse', 'Origem', 'Último Contato', 'Ações'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant text-body-sm">
                  <div className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Carregando...</div>
                </td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-on-surface-variant text-body-sm">
                  Nenhum lead encontrado.
                </td></tr>
              ) : (
                leads.map((lead: Lead) => (
                  <tr key={lead.id} className="hover:bg-surface-container-highest/50 transition-colors cursor-pointer group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={lead.name} size="sm" />
                        <div>
                          <p className="text-body-sm font-semibold text-on-surface">{lead.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{lead.email || lead.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><LeadStatusBadge status={lead.status} /></td>
                    <td className="px-5 py-4"><ScoreBar score={lead.score} /></td>
                    <td className="px-5 py-4">
                      <p className="text-body-sm text-on-surface">{lead.interestType || '—'}</p>
                      <p className="text-[11px] text-on-surface-variant">{lead.interestLocation || ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[11px] text-on-surface-variant">{lead.source?.replace('_', ' ') || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      {lead.lastContactAt ? (
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <span className="material-symbols-outlined text-lg">chat</span>
                          <span className="text-body-sm">{formatRelativeTime(lead.lastContactAt)}</span>
                        </div>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant opacity-60 italic">Aguardando...</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all" title="Abrir chat">
                          <span className="material-symbols-outlined text-lg">chat_bubble</span>
                        </button>
                        <button
                          onClick={() => { if (confirm('Excluir este lead?')) deleteLead.mutate(lead.id) }}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all"
                          title="Excluir"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-outline-variant flex items-center justify-between">
          <p className="text-body-sm text-on-surface-variant">
            Mostrando <strong className="text-on-surface">{leads.length}</strong> de{' '}
            <strong className="text-on-surface">{total}</strong> leads
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="px-3 text-body-sm text-on-surface-variant">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && <CreateLeadModal onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}

function CreateLeadModal({ onClose }: { onClose: () => void }) {
  const createLead = useCreateLead()
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'outro', status: 'novo', interestType: '', interestLocation: '', notes: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createLead.mutateAsync(form as any)
    onClose()
  }

  const inputClass = 'w-full h-10 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-on-surface text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
  const selectClass = 'w-full h-10 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none'
  const labelClass = 'block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container rounded-2xl border border-outline-variant w-full max-w-lg p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-manrope font-bold text-lg text-on-surface">Novo Lead</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Nome *</label><input required placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Telefone *</label><input required placeholder="(11) 99999-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Email</label><input type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Origem</label>
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={selectClass}>
                {['outro','facebook_ads','google_ads','instagram','whatsapp','indicacao','portal_imoveis','site','direto'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tipo de Interesse</label>
              <select value={form.interestType} onChange={(e) => setForm({ ...form, interestType: e.target.value })} className={selectClass}>
                <option value="">Selecionar...</option>
                {['apartamento','casa','terreno','comercial','rural','outro'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label className={labelClass}>Localização de Interesse</label><input placeholder="Ex: Jardins, São Paulo" value={form.interestLocation} onChange={(e) => setForm({ ...form, interestLocation: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Observações</label><textarea placeholder="Notas sobre o lead..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={cn(inputClass, 'h-20 py-2 resize-none')} /></div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" size="md" type="submit" loading={createLead.isPending}>
              <span className="material-symbols-outlined text-lg">person_add</span>
              Criar Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
