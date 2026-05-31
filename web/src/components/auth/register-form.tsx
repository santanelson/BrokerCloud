'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { ApiError } from '@/lib/api'

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [tenantName, setTenantName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const register = useAuthStore((s) => s.register)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register({ tenantName, name, email, password })
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (field: string) =>
    cn(
      'w-full h-11 bg-surface-container-low border rounded-lg px-4',
      'text-on-surface text-body-sm placeholder:text-on-surface-variant',
      'focus:outline-none transition-all duration-200',
      focused === field
        ? 'border-primary ring-1 ring-primary'
        : 'border-outline-variant hover:border-outline'
    )

  const labelClass = (field: string) =>
    cn(
      'block text-label-md font-semibold uppercase tracking-wider transition-colors',
      focused === field ? 'text-primary' : 'text-on-surface-variant'
    )

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      <div>
        <h2 className="font-manrope font-bold text-headline-lg text-on-surface">
          Crie sua conta
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          Configure sua imobiliária em poucos segundos.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="tenantName" className={labelClass('tenantName')}>Nome da Imobiliária</label>
          <input id="tenantName" type="text" placeholder="Ex: Imobiliária Premium" value={tenantName} onChange={(e) => setTenantName(e.target.value)} onFocus={() => setFocused('tenantName')} onBlur={() => setFocused(null)} required className={inputClass('tenantName')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className={labelClass('name')}>Seu Nome</label>
          <input id="name" type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} required className={inputClass('name')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className={labelClass('email')}>E-mail</label>
          <input id="email" type="email" autoComplete="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required className={inputClass('email')} />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className={labelClass('password')}>Senha</label>
          <input id="password" type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} required minLength={8} className={inputClass('password')} />
        </div>

        <Button type="submit" size="lg" loading={loading} className="w-full font-manrope font-bold mt-2"
          rightIcon={!loading ? <span className="material-symbols-outlined text-xl">arrow_forward</span> : undefined}
        >
          {loading ? 'Criando...' : 'Criar Conta Gratuita'}
        </Button>
      </form>

      <p className="text-center text-body-sm text-on-surface-variant">
        Já tem conta?{' '}
        <a href="/login" className="text-primary font-semibold hover:underline">
          Fazer login
        </a>
      </p>
    </div>
  )
}
