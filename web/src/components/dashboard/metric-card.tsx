'use client'

import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  change: number
  icon: string
  variant?: 'primary' | 'secondary' | 'default'
  changeLabel?: string
}

export function DashboardMetricCard({
  label,
  value,
  change,
  icon,
  variant = 'default',
  changeLabel = 'vs mês ant.',
}: MetricCardProps) {
  const positive = change >= 0

  return (
    <div className="bg-surface-container rounded-xl p-4 border border-outline-variant hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            'p-2 rounded-lg',
            variant === 'primary' && 'bg-primary/10 text-primary',
            variant === 'secondary' && 'bg-secondary/10 text-secondary',
            variant === 'default' && 'bg-surface-container-highest text-on-surface-variant'
          )}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>
        <span
          className={cn(
            'text-[10px] font-bold px-2 py-0.5 rounded-full border',
            positive
              ? 'text-primary bg-primary/10 border-primary/20'
              : 'text-error bg-error/10 border-error/20'
          )}
        >
          {positive ? '+' : ''}{change}%
        </span>
      </div>

      <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={cn(
          'font-manrope font-bold text-2xl',
          variant === 'primary' && 'text-primary',
          variant === 'secondary' && 'text-secondary',
          variant === 'default' && 'text-on-surface'
        )}
      >
        {value}
      </p>

      <div className="flex items-center gap-1 mt-2">
        <span
          className={cn(
            'material-symbols-outlined text-xs',
            positive ? 'text-primary' : 'text-error'
          )}
        >
          {positive ? 'trending_up' : 'trending_down'}
        </span>
        <span
          className={cn(
            'text-[10px] font-semibold',
            positive ? 'text-primary' : 'text-error'
          )}
        >
          {positive ? '+' : ''}{change}
        </span>
        <span className="text-[10px] text-on-surface-variant">{changeLabel}</span>
      </div>
    </div>
  )
}
