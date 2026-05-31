'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useLeads, useUpdateLead } from '@/lib/hooks'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Lead } from '@/types'

const COLUMNS = [
  { id: 'novo', label: 'Novo', color: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-500' },
  { id: 'em_atendimento', label: 'Em Atendimento', color: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  { id: 'qualificado', label: 'Qualificado', color: 'border-orange-500', bg: 'bg-orange-500/10', text: 'text-orange-500' },
  { id: 'proposta', label: 'Proposta', color: 'border-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
  { id: 'fechado', label: 'Fechado', color: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-500' },
  { id: 'perdido', label: 'Perdido', color: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-500' },
]

export default function PipelinePage() {
  const { data, isLoading } = useLeads({ limit: 500 }) // Fetch all leads for pipeline
  const updateLead = useUpdateLead()

  const [columns, setColumns] = useState<Record<string, Lead[]>>({})

  useEffect(() => {
    if (!data?.data) return
    const newCols: Record<string, Lead[]> = {}
    COLUMNS.forEach(c => (newCols[c.id] = []))
    data.data.forEach((lead: Lead) => {
      if (newCols[lead.status]) {
        newCols[lead.status].push(lead)
      } else {
        // Fallback for weird status
        if (!newCols['novo']) newCols['novo'] = []
        newCols['novo'].push(lead)
      }
    })
    setColumns(newCols)
  }, [data])

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = columns[source.droppableId]
    const destCol = columns[destination.droppableId]
    const lead = sourceCol[source.index]

    // Optimistic UI update
    const newColumns = { ...columns }
    newColumns[source.droppableId] = Array.from(sourceCol)
    newColumns[source.droppableId].splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      newColumns[source.droppableId].splice(destination.index, 0, lead)
    } else {
      const newDestCol = Array.from(destCol)
      newDestCol.splice(destination.index, 0, { ...lead, status: destination.droppableId as any })
      newColumns[destination.droppableId] = newDestCol
    }

    setColumns(newColumns)

    // Backend update
    if (source.droppableId !== destination.droppableId) {
      updateLead.mutate({ id: draggableId, status: destination.droppableId as any })
    }
  }

  return (
    <div className="flex-1 h-[calc(100vh-130px)] flex flex-col min-w-0">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-manrope font-bold text-headline-lg text-on-surface">Pipeline de Vendas</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Arraste e solte os leads para atualizar o status.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 h-full items-start">
              {COLUMNS.map((col) => {
                const columnLeads = columns[col.id] || []
                return (
                  <div key={col.id} className="flex flex-col w-[300px] shrink-0 h-full bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden">
                    {/* Header */}
                    <div className={cn("p-3 border-b border-outline-variant flex items-center justify-between bg-surface-container", col.bg)}>
                      <h3 className={cn("font-bold text-sm tracking-wide uppercase", col.text)}>
                        {col.label}
                      </h3>
                      <span className="text-[10px] font-bold bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full">
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Droppable Area */}
                    <Droppable droppableId={col.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3 transition-colors",
                            snapshot.isDraggingOver ? "bg-surface-container-highest/50" : ""
                          )}
                        >
                          {columnLeads.map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "bg-surface-container rounded-lg p-4 border shadow-sm transition-all group",
                                    snapshot.isDragging ? "border-primary shadow-md rotate-2 scale-105 z-50" : "border-outline-variant hover:border-primary/50 hover:shadow-md"
                                  )}
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <Avatar name={lead.name} size="sm" />
                                    <ScoreBadge score={lead.score} />
                                  </div>
                                  <h4 className="font-semibold text-on-surface text-sm truncate">{lead.name}</h4>
                                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{lead.email || lead.phone}</p>
                                  
                                  <div className="mt-3 pt-3 border-t border-outline-variant/50 flex flex-col gap-1.5">
                                    {lead.interestType && (
                                      <p className="text-[10px] text-on-surface flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[14px]">home</span>
                                        {lead.interestType} {lead.budget ? `— ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.budget)}` : ''}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">
                                        {lead.source?.replace('_', ' ') || 'S/ Origem'}
                                      </span>
                                      <a 
                                        href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="w-6 h-6 rounded-full bg-surface-container-highest hover:bg-[#25D366]/20 hover:text-[#25D366] text-on-surface-variant flex items-center justify-center transition-colors"
                                      >
                                        <span className="material-symbols-outlined text-[14px]">chat</span>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )
              })}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-primary/20 text-primary border-primary/30' : score >= 40 ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-error/20 text-error border-error/30'
  return (
    <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border", color)}>
      <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        local_fire_department
      </span>
      {score}
    </span>
  )
}
