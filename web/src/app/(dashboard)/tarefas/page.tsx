'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/lib/hooks'
import type { Task } from '@/types'

const typeLabels: Record<string, string> = {
  visita: 'Visita', ligacao: 'Ligação', email: 'Email',
  proposta: 'Proposta', reuniao: 'Reunião', outro: 'Outro',
}
const typeIcons: Record<string, string> = {
  visita: 'location_on', ligacao: 'call', email: 'mail',
  proposta: 'description', reuniao: 'groups', outro: 'task_alt',
}
const priorityColors: Record<string, string> = {
  baixa: 'bg-on-surface/10 text-on-surface-variant',
  media: 'bg-secondary/10 text-secondary',
  alta: 'bg-tertiary/10 text-tertiary',
  urgente: 'bg-error/10 text-error',
}

export default function TarefasPage() {
  const [filterDone, setFilterDone] = useState<string>('')
  const [filterType, setFilterType] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)

  const filters: Record<string, any> = { page, limit: 20 }
  if (filterDone !== '') filters.done = filterDone
  if (filterType) filters.type = filterType
  if (filterPriority) filters.priority = filterPriority

  const { data, isLoading } = useTasks(filters)
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const tasks = data?.data ?? []
  const total = data?.total ?? 0

  const toggleDone = (task: Task) => {
    updateTask.mutate({ id: task.id, done: !task.done } as any)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-manrope font-bold text-headline-lg text-on-surface">Tarefas</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">Organize suas atividades e acompanhe prazos.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
          <span className="material-symbols-outlined text-lg">add_task</span>
          Nova Tarefa
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          {[
            { label: 'Todas', value: '' },
            { label: 'Pendentes', value: 'false' },
            { label: 'Concluídas', value: 'true' },
          ].map((f) => (
            <button key={f.value} onClick={() => { setFilterDone(f.value); setPage(1) }}
              className={cn('px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all',
                filterDone === f.value ? 'bg-primary text-on-primary' : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:border-primary'
              )}>
              {f.label}
            </button>
          ))}
        </div>
        <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
          className="h-9 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all appearance-none">
          <option value="">Todos os tipos</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setPage(1) }}
          className="h-9 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all appearance-none">
          <option value="">Todas as prioridades</option>
          <option value="baixa">Baixa</option><option value="media">Média</option>
          <option value="alta">Alta</option><option value="urgente">Urgente</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-40">task_alt</span>
            <p className="text-body-md font-semibold">Nenhuma tarefa encontrada</p>
            <p className="text-body-sm mt-1">Crie uma tarefa para organizar seus atendimentos.</p>
          </div>
        ) : (
          tasks.map((task: Task) => {
            const overdue = !task.done && new Date(task.dueAt) < new Date()
            return (
              <div key={task.id} className={cn(
                'bg-surface-container rounded-xl border p-4 flex items-center gap-4 transition-all group hover:border-primary/30',
                task.done ? 'border-outline-variant/50 opacity-60' : overdue ? 'border-error/30' : 'border-outline-variant'
              )}>
                {/* Checkbox */}
                <button onClick={() => toggleDone(task)} className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                  task.done ? 'bg-primary border-primary' : 'border-outline hover:border-primary'
                )}>
                  {task.done && <span className="material-symbols-outlined text-on-primary text-sm">check</span>}
                </button>

                {/* Icon */}
                <div className={cn('p-2 rounded-lg shrink-0', task.done ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-primary/10 text-primary')}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{typeIcons[task.type] || 'task_alt'}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn('text-body-sm font-semibold', task.done ? 'text-on-surface-variant line-through' : 'text-on-surface')}>{task.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {task.lead && <span className="text-[11px] text-on-surface-variant">📋 {task.lead.name}</span>}
                    {task.broker && <span className="text-[11px] text-on-surface-variant">👤 {task.broker.name}</span>}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', priorityColors[task.priority] || '')}>
                    {task.priority}
                  </span>
                  <span className={cn('text-[11px] font-semibold', overdue ? 'text-error' : 'text-on-surface-variant')}>
                    <span className="material-symbols-outlined text-sm align-text-bottom mr-0.5">{overdue ? 'warning' : 'schedule'}</span>
                    {new Date(task.dueAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button onClick={() => { if (confirm('Excluir tarefa?')) deleteTask.mutate(task.id) }}
                    className="p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-all opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-all"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
          <span className="flex items-center px-4 text-body-sm text-on-surface-variant">{page} / {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-all"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
        </div>
      )}

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const createTask = useCreateTask()
  const [form, setForm] = useState({ title: '', description: '', type: 'outro', priority: 'media', dueAt: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createTask.mutateAsync({
      ...form,
      dueAt: new Date(form.dueAt).toISOString(),
    } as any)
    onClose()
  }

  const inputClass = 'w-full h-10 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-on-surface text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
  const labelClass = 'block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container rounded-2xl border border-outline-variant w-full max-w-md p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-manrope font-bold text-lg text-on-surface">Nova Tarefa</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className={labelClass}>Título *</label><input required placeholder="Ex: Visita cliente" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Tipo</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={cn(inputClass, 'appearance-none')}>
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Prioridade</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={cn(inputClass, 'appearance-none')}>
                <option value="baixa">Baixa</option><option value="media">Média</option>
                <option value="alta">Alta</option><option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
          <div><label className={labelClass}>Data/Hora Limite *</label><input required type="datetime-local" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} className={inputClass} /></div>
          <div><label className={labelClass}>Descrição</label><textarea placeholder="Detalhes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={cn(inputClass, 'h-20 py-2 resize-none')} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="md" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" size="md" type="submit" loading={createTask.isPending}><span className="material-symbols-outlined text-lg">add_task</span>Criar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
