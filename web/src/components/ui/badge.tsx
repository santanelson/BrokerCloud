'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-inter font-bold uppercase tracking-widest border',
  {
    variants: {
      variant: {
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border-secondary/20',
        tertiary: 'bg-tertiary/10 text-tertiary border-tertiary/20',
        error: 'bg-error/10 text-error border-error/20',
        success: 'bg-primary/10 text-primary border-primary/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        surface: 'bg-surface-container-highest text-on-surface-variant border-outline-variant',
        outline: 'border-outline-variant text-on-surface-variant bg-transparent',
      },
      size: {
        sm: 'text-[9px] px-1.5 py-0.5',
        md: 'text-[10px] px-2.5 py-0.5',
        lg: 'text-xs px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

const leadStatusMap: Record<string, VariantProps<typeof badgeVariants>['variant']> = {
  novo: 'tertiary',
  em_atendimento: 'secondary',
  qualificado: 'primary',
  proposta: 'warning',
  fechado: 'success',
  perdido: 'error',
}

const leadStatusLabel: Record<string, string> = {
  novo: 'Novo',
  em_atendimento: 'Em Atendimento',
  qualificado: 'Qualificado',
  proposta: 'Proposta',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ children, variant, size, className, dot }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'error' && 'bg-error',
            variant === 'primary' || variant === 'success' ? 'bg-primary' : '',
            variant === 'secondary' && 'bg-secondary',
            variant === 'tertiary' && 'bg-tertiary',
          )}
        />
      )}
      {children}
    </span>
  )
}

export function LeadStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={leadStatusMap[status] ?? 'surface'}>
      {leadStatusLabel[status] ?? status}
    </Badge>
  )
}

export { badgeVariants }
