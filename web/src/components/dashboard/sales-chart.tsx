'use client'

import { useState } from 'react'
import { useLeadMetrics } from '@/lib/hooks'

type Period = '7D' | '30D' | '1Y'

export function SalesChart() {
  const [period, setPeriod] = useState<Period>('1Y')
  const { data: metrics, isLoading } = useLeadMetrics()

  const chartData = metrics?.chartData || []

  const months = chartData.map((d: any) => d.month)
  const salesData = chartData.map((d: any) => d.sales)
  const leadsData = chartData.map((d: any) => d.leads)

  const maxVal = Math.max(...salesData, ...leadsData, 10) // Ensure at least scale 10

  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant h-full flex flex-col">
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h3 className="font-manrope font-bold text-on-surface">Desempenho de Vendas</h3>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mt-0.5">
            Vendas (Barras) vs Leads Gerados (Linha)
          </p>
        </div>
        <div className="flex gap-1">
          {(['1Y'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all ${
                period === p
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-body-sm text-on-surface-variant">Nenhum dado disponível.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-end">
          {/* Chart */}
          <div className="relative flex items-end gap-1.5 h-48 w-full">
            {/* Lead line overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <polyline
                points={leadsData.map((v: number, i: number) => `${(i / (leadsData.length - 1)) * 100},${100 - (v / maxVal) * 100}`).join(' ')}
                fill="none"
                stroke="#adc6ff"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeOpacity="0.8"
              />
            </svg>
            
            {/* HTML Data points to avoid SVG stretching */}
            {leadsData.map((v: number, i: number) => {
              const leftPct = (i / (leadsData.length - 1)) * 100
              const bottomPct = (v / maxVal) * 100
              return (
                <div
                  key={i}
                  className="absolute z-20 w-1.5 h-1.5 rounded-full bg-[#adc6ff] -ml-[3px] -mb-[3px]"
                  style={{ left: `${leftPct}%`, bottom: `${bottomPct}%` }}
                />
              )
            })}

            {/* Grid */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-outline w-full" />
              ))}
            </div>

            {/* Bars */}
            {salesData.map((v: number, i: number) => {
              const heightPct = (v / maxVal) * 100
              const isCurrentMonth = i === 11 // Last element is current month

              return (
                <div
                  key={i}
                  className="flex-1 flex items-end relative group/bar cursor-pointer"
                  style={{ height: '100%' }}
                >
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isCurrentMonth
                        ? 'bg-primary/80 shadow-glow'
                        : 'bg-surface-container-highest group-hover/bar:bg-primary/60'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  >
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] px-2 py-1 rounded whitespace-nowrap z-20 border border-outline-variant transition-opacity">
                      {v} vendas
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* X Axis */}
          <div className="flex justify-between mt-2 px-0.5">
            {months.map((m: string, i: number) => (
              <span
                key={m + i}
                className={`text-[9px] font-bold uppercase ${
                  i === 11 ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <span className="text-[10px] text-on-surface-variant font-semibold uppercase">Vendas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-secondary rounded-full" />
          <span className="text-[10px] text-on-surface-variant font-semibold uppercase">Leads</span>
        </div>
      </div>
    </div>
  )
}
