import type { Metadata } from 'next'
import { Providers } from '@/components/providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'BrokerCloud CRM',
    template: '%s | BrokerCloud CRM',
  },
  description:
    'CRM completo para corretores de imóveis. Gestão de leads, imóveis, tarefas e WhatsApp integrado.',
  keywords: ['CRM', 'corretores', 'imóveis', 'WhatsApp', 'leads', 'vendas'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased font-inter">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
