'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn, getInitials } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useTenant, useTenantUsers, useUpdateTenant, useInviteUser } from '@/lib/hooks'
import { WhatsAppConnect } from '@/components/chat/WhatsAppConnect'
import { api } from '@/lib/api'
import { useEffect } from 'react'

type Tab = 'geral' | 'equipe' | 'whatsapp'

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<Tab>('geral')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-manrope font-bold text-headline-lg text-on-surface">Configurações</h2>
        <p className="text-body-sm text-on-surface-variant mt-1">Gerencie sua imobiliária e equipe.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container rounded-xl p-1 border border-outline-variant w-fit">
        {([
          { key: 'geral', label: 'Geral', icon: 'settings' },
          { key: 'equipe', label: 'Equipe', icon: 'group' },
          { key: 'whatsapp', label: 'WhatsApp', icon: 'chat_bubble' },
        ] as const).map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-semibold transition-all',
              tab === t.key ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            )}>
            <span className="material-symbols-outlined text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'geral' && <GeneralSettings />}
      {tab === 'equipe' && <TeamSettings />}
      {tab === 'whatsapp' && <WhatsAppSettings />}
    </div>
  )
}

function GeneralSettings() {
  const { data: tenant, isLoading } = useTenant()
  const updateTenant = useUpdateTenant()
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState('')

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>

  const tenantName = name || tenant?.name || ''

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-surface-container rounded-xl border border-outline-variant p-6 space-y-4">
        <h3 className="font-manrope font-bold text-on-surface">Dados da Imobiliária</h3>
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nome</label>
          <input value={tenantName} onChange={(e) => setName(e.target.value)}
            className="w-full h-10 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Plano</label>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
              {tenant?.plan || 'starter'}
            </span>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="md" loading={updateTenant.isPending}
            onClick={() => updateTenant.mutate({ name: tenantName })}>
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant p-6 space-y-4">
        <h3 className="font-manrope font-bold text-on-surface">Seu Perfil</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-xl font-manrope">
            {user ? getInitials(user.name) : '??'}
          </div>
          <div>
            <p className="text-body-md font-semibold text-on-surface">{user?.name}</p>
            <p className="text-body-sm text-on-surface-variant">{user?.email}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeamSettings() {
  const { data: users, isLoading } = useTenantUsers()
  const inviteUser = useInviteUser()
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'broker' })

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    await inviteUser.mutateAsync(form)
    setForm({ name: '', email: '', password: '', role: 'broker' })
    setShowInvite(false)
  }

  const roleLabels: Record<string, string> = { admin: 'Admin', manager: 'Gestor', broker: 'Corretor' }
  const inputClass = 'w-full h-10 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-on-surface text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
  const labelClass = 'block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-manrope font-bold text-on-surface">Equipe</h3>
        <Button variant="primary" size="md" onClick={() => setShowInvite(!showInvite)}>
          <span className="material-symbols-outlined text-lg">person_add</span>
          Convidar
        </Button>
      </div>

      {showInvite && (
        <form onSubmit={handleInvite} className="bg-surface-container rounded-xl border border-primary/20 p-5 space-y-4 animate-fade-in">
          <h4 className="text-body-sm font-semibold text-on-surface">Novo Membro</h4>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Nome *</label><input required placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Email *</label><input required type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Senha Inicial *</label><input required type="password" placeholder="Min. 8 caracteres" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Função</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={cn(inputClass, 'appearance-none')}>
                <option value="broker">Corretor</option><option value="manager">Gestor</option><option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowInvite(false)}>Cancelar</Button>
            <Button variant="primary" size="sm" type="submit" loading={inviteUser.isPending}>Convidar</Button>
          </div>
        </form>
      )}

      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : !users || users.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant text-body-sm">Nenhum membro na equipe.</div>
        ) : (
          <div className="divide-y divide-outline-variant/30">
            {users.map((u: any) => (
              <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-surface-container-highest/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-manrope">
                  {getInitials(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-on-surface">{u.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{u.email}</p>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border',
                  u.role === 'admin' ? 'bg-primary/10 text-primary border-primary/20'
                    : u.role === 'manager' ? 'bg-secondary/10 text-secondary border-secondary/20'
                    : 'bg-surface-container-highest text-on-surface-variant border-outline-variant'
                )}>
                  {roleLabels[u.role] || u.role}
                </span>
                <span className={cn('w-2 h-2 rounded-full', u.active ? 'bg-primary' : 'bg-error')} title={u.active ? 'Ativo' : 'Inativo'} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function WhatsAppSettings() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'loading'>('loading')
  const [disconnecting, setDisconnecting] = useState(false)

  const fetchStatus = async () => {
    try {
      const data = await api.get('/whatsapp/status')
      setStatus(data.state)
    } catch {
      setStatus('disconnected')
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      await api.post('/whatsapp/logout', {})
      setStatus('disconnected')
    } catch (err) {
      console.error(err)
    } finally {
      setDisconnecting(false)
    }
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-surface-container rounded-xl border border-outline-variant p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
          </div>
          <div>
            <h3 className="font-manrope font-bold text-on-surface">Integração WhatsApp</h3>
            <p className="text-[11px] text-on-surface-variant">Gerencie a conexão do número da sua imobiliária.</p>
          </div>
        </div>

        {status === 'connected' ? (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <div>
                <span className="text-body-md font-semibold text-primary block">Conectado e Operante</span>
                <span className="text-xs text-on-surface-variant">Sua imobiliária está pronta para receber e enviar mensagens.</span>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="md" className="text-error border-error/50 hover:bg-error/10 hover:border-error" loading={disconnecting} onClick={handleDisconnect}>
                Desconectar WhatsApp
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t border-outline-variant/50">
             <WhatsAppConnect onConnected={fetchStatus} />
          </div>
        )}
      </div>
    </div>
  )
}
