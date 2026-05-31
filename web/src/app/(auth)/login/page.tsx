import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | BrokerCloud CRM',
  description: 'Acesse sua conta BrokerCloud CRM',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container-lowest">
        {/* Atmospheric background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span
                className="material-symbols-outlined text-on-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                domain
              </span>
            </div>
            <span className="font-manrope font-bold text-xl text-primary">BrokerCloud</span>
          </div>

          {/* Hero copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] text-primary font-bold uppercase tracking-widest">
                WhatsApp + CRM Integrado
              </span>
            </div>

            <h1 className="font-manrope font-bold text-display-sm text-on-surface leading-tight">
              A plataforma dos
              <br />
              <span className="gradient-text">corretores de elite.</span>
            </h1>

            <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Gestão de leads, pipeline de vendas, chat WhatsApp e automações — tudo em um só lugar para fechar mais negócios.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['AB', 'RC', 'MS'].map((initials) => (
                  <div
                    key={initials}
                    className="w-9 h-9 rounded-full bg-primary/10 border-2 border-surface-container-lowest flex items-center justify-center text-primary text-xs font-bold font-manrope"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">
                +500 corretores ativos
              </span>
            </div>
          </div>

          <p className="text-[11px] text-on-surface-variant">
            © 2026 BrokerCloud. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 md:px-16 bg-surface relative">
        {/* Atmospheric glow */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <span
              className="material-symbols-outlined text-on-primary-container text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
          </div>
          <span className="font-manrope font-bold text-primary text-lg">BrokerCloud</span>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
