'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import { useProperties, useCreateProperty, useUpdateProperty, useDeleteProperty } from '@/lib/hooks'
import { ImageUpload } from '@/components/ui/image-upload'
import type { Property } from '@/types'

const typeLabels: Record<string, string> = {
  apartamento: 'Apartamento', casa: 'Casa', terreno: 'Terreno',
  comercial: 'Comercial', rural: 'Rural', outro: 'Outro',
}
const statusLabels: Record<string, string> = {
  disponivel: 'Disponível', reservado: 'Reservado', vendido: 'Vendido',
  alugado: 'Alugado', inativo: 'Inativo',
}
const statusColors: Record<string, string> = {
  disponivel: 'bg-primary/10 text-primary border-primary/20',
  reservado: 'bg-secondary/10 text-secondary border-secondary/20',
  vendido: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  alugado: 'bg-on-surface/10 text-on-surface border-outline-variant',
  inativo: 'bg-error/10 text-error border-error/20',
}

export default function ImoveisPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)

  const filters: Record<string, any> = { page, limit: 12 }
  if (search) filters.search = search
  if (typeFilter) filters.type = typeFilter
  if (statusFilter) filters.status = statusFilter

  const { data, isLoading } = useProperties(filters)
  const deleteProperty = useDeleteProperty()

  const properties = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-manrope font-bold text-headline-lg text-on-surface">Imóveis</h2>
          <p className="text-body-sm text-on-surface-variant mt-1">Gerencie sua carteira de imóveis.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowCreate(true)}>
          <span className="material-symbols-outlined text-lg">add_home</span>
          Novo Imóvel
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container rounded-xl p-4 border border-outline-variant flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-60 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar por título, endereço..." className="w-full h-9 bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }} className="h-9 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all appearance-none">
          <option value="">Todos os tipos</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="h-9 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all appearance-none">
          <option value="">Todos os status</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 opacity-40">home_work</span>
          <p className="text-body-md font-semibold">Nenhum imóvel encontrado</p>
          <p className="text-body-sm mt-1">Cadastre seu primeiro imóvel para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((prop: Property) => (
            <div key={prop.id} className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden hover:border-primary/30 transition-all group">
              {/* Image placeholder */}
              <div className="relative aspect-video bg-surface-container-low border-b border-outline-variant flex items-center justify-center overflow-hidden">
                {prop.images && prop.images.length > 0 ? (
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">home_work</span>
                )}
                <div className="absolute top-3 left-3">
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border', statusColors[prop.status] || 'bg-surface-container-highest text-on-surface-variant')}>
                    {statusLabels[prop.status] || prop.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { if (confirm('Excluir este imóvel?')) deleteProperty.mutate(prop.id) }} className="p-1.5 rounded-lg bg-surface-container/80 backdrop-blur-sm text-on-surface-variant hover:text-error transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-manrope font-bold text-on-surface truncate">{prop.title}</h3>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{prop.address} — {prop.city}/{prop.state}</p>
                </div>
                <p className="font-manrope font-bold text-lg text-primary">{formatCurrency(prop.price)}</p>
                <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                  {prop.area && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">straighten</span>{prop.area}m²</span>}
                  {prop.bedrooms != null && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bed</span>{prop.bedrooms}</span>}
                  {prop.bathrooms != null && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bathtub</span>{prop.bathrooms}</span>}
                  {prop.parkingSpots != null && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">directions_car</span>{prop.parkingSpots}</span>}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-highest text-on-surface-variant border border-outline-variant">{typeLabels[prop.type] || prop.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-all">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <span className="flex items-center px-4 text-body-sm text-on-surface-variant">{page} / {Math.ceil(total / 12)}</span>
          <button disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(page + 1)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-40 transition-all">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}

      {showCreate && <CreatePropertyModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function CreatePropertyModal({ onClose }: { onClose: () => void }) {
  const createProperty = useCreateProperty()
  const [form, setForm] = useState({
    title: '', type: 'apartamento', price: '', area: '', bedrooms: '', bathrooms: '', parkingSpots: '',
    address: '', neighborhood: '', city: '', state: 'SP', description: '', images: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProperty.mutateAsync({
      ...form,
      price: Number(form.price),
      area: form.area ? Number(form.area) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      parkingSpots: form.parkingSpots ? Number(form.parkingSpots) : undefined,
    } as any)
    onClose()
  }

  const inputClass = 'w-full h-10 bg-surface-container-low border border-outline-variant rounded-lg px-4 text-on-surface text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all'
  const selectClass = cn(inputClass, 'appearance-none')
  const labelClass = 'block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface-container rounded-2xl border border-outline-variant w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-manrope font-bold text-lg text-on-surface">Novo Imóvel</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className={labelClass}>Título *</label><input required placeholder="Ex: Apartamento Luxo Jardins" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Tipo *</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>{Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label className={labelClass}>Preço (R$) *</label><input required type="number" placeholder="850000" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div><label className={labelClass}>Área (m²)</label><input type="number" placeholder="120" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Quartos</label><input type="number" placeholder="3" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Banheiros</label><input type="number" placeholder="2" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Vagas</label><input type="number" placeholder="2" value={form.parkingSpots} onChange={(e) => setForm({ ...form, parkingSpots: e.target.value })} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Endereço *</label><input required placeholder="Rua, número" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className={labelClass}>Bairro</label><input placeholder="Jardins" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Cidade *</label><input required placeholder="São Paulo" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>UF *</label><input required placeholder="SP" maxLength={2} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} className={inputClass} /></div>
          </div>
          <div><label className={labelClass}>Descrição</label><textarea placeholder="Descreva o imóvel..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={cn(inputClass, 'h-20 py-2 resize-none')} /></div>
          
          {/* Imagens */}
          <div>
            <label className={labelClass}>Imagens do Imóvel</label>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {(form.images || []).map((url, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant group">
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <ImageUpload onUpload={(url) => setForm({ ...form, images: [...(form.images || []), url] })} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <Button variant="outline" size="md" type="button" onClick={onClose}>Cancelar</Button>
            <Button variant="primary" size="md" type="submit" loading={createProperty.isPending}><span className="material-symbols-outlined text-lg">add_home</span>Cadastrar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
