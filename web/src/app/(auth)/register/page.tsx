import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Criar Conta | BrokerCloud CRM',
  description: 'Crie sua conta BrokerCloud CRM e comece a gerenciar seus leads e imóveis.',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
            </div>
            <span className="font-manrope font-bold text-xl text-primary">BrokerCloud</span>
          </div>

          <div className="space-y-6">
            <h1 className="font-manrope font-bold text-display-sm text-on-surface leading-tight">
              Comece a vender
              <br />
              <span className="gradient-text">como um profissional.</span>
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
              Crie sua imobiliária no BrokerCloud em segundos. Gerencie leads, imóveis e WhatsApp — tudo integrado.
            </p>
          </div>

          <p className="text-[11px] text-on-surface-variant">
            © 2026 BrokerCloud. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 md:px-16 bg-surface relative">
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="lg:hidden flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
          </div>
          <span className="font-manrope font-bold text-primary text-lg">BrokerCloud</span>
        </div>

        <RegisterForm />
      </div>
    </div>
  )
}
