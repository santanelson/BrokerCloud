'use client'

import { useTasks } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { Task } from '@/types'

const typeIcons: Record<string, string> = {
  visita: 'location_on', ligacao: 'call', email: 'mail',
  proposta: 'description', reuniao: 'groups', outro: 'task_alt',
}
const priorityColors: Record<string, string> = {
  baixa: 'text-on-surface-variant',
  media: 'text-secondary',
  alta: 'text-tertiary',
  urgente: 'text-error',
}

export function UpcomingTasks() {
  const { data, isLoading } = useTasks({ done: 'false', limit: 5 })
  const tasks = data?.data ?? []

  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-manrope font-bold text-on-surface text-sm">Próximas Tarefas</h3>
        <a href="/tarefas" className="text-primary text-[10px] font-bold hover:underline">Ver todas</a>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant text-center py-4">Nenhuma tarefa pendente 🎉</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task: Task) => {
            const overdue = new Date(task.dueAt) < new Date()
            return (
              <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container-highest transition-colors group">
                <div className={cn('p-1.5 rounded-lg bg-surface-container-highest', overdue ? 'text-error' : 'text-primary')}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {typeIcons[task.type] || 'task_alt'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-on-surface truncate">{task.title}</p>
                  <p className={cn('text-[10px] font-semibold', overdue ? 'text-error' : 'text-on-surface-variant')}>
                    {new Date(task.dueAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className={cn('text-[9px] font-bold uppercase', priorityColors[task.priority] || '')}>{task.priority}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
