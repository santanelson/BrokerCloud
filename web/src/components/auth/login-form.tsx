'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'
import { ApiError } from '@/lib/api'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
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

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      <div>
        <h2 className="font-manrope font-bold text-headline-lg text-on-surface">
          Bem-vindo de volta
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          Acesse sua conta para gerenciar seu pipeline.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className={cn(
              'block text-label-md font-semibold uppercase tracking-wider transition-colors',
              focused === 'email' ? 'text-primary' : 'text-on-surface-variant'
            )}
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            required
            className={cn(
              'w-full h-11 bg-surface-container-low border rounded-lg px-4',
              'text-on-surface text-body-sm placeholder:text-on-surface-variant',
              'focus:outline-none transition-all duration-200',
              focused === 'email'
                ? 'border-primary ring-1 ring-primary'
                : 'border-outline-variant hover:border-outline'
            )}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className={cn(
                'block text-label-md font-semibold uppercase tracking-wider transition-colors',
                focused === 'password' ? 'text-primary' : 'text-on-surface-variant'
              )}
            >
              Senha
            </label>
            <a href="#" className="text-label-md text-primary hover:underline">
              Esqueceu?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              required
              className={cn(
                'w-full h-11 bg-surface-container-low border rounded-lg px-4 pr-12',
                'text-on-surface text-body-sm placeholder:text-on-surface-variant',
                'focus:outline-none transition-all duration-200',
                focused === 'password'
                  ? 'border-primary ring-1 ring-primary'
                  : 'border-outline-variant hover:border-outline'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex items-center gap-2.5">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-surface"
          />
          <label htmlFor="remember" className="text-body-sm text-on-surface-variant cursor-pointer select-none">
            Manter conectado neste dispositivo
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full font-manrope font-bold"
          rightIcon={
            !loading ? (
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            ) : undefined
          }
        >
          {loading ? 'Entrando...' : 'Acessar Dashboard'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-4 text-label-md text-on-surface-variant">
            PRIMEIRO ACESSO?
          </span>
        </div>
      </div>

      <p className="text-center text-body-sm text-on-surface-variant">
        Não tem conta?{' '}
        <a href="/register" className="text-primary font-semibold hover:underline">
          Criar conta gratuita
        </a>
      </p>
    </div>
  )
}
