import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import imageCompression from 'browser-image-compression'
import { supabase } from './supabase'
import type {
  Lead, Property, Task, Conversation, Message,
  PaginatedResponse,
} from '@/types'

// ─── Leads ────────────────────────────────────────────────────────────────────

export function useLeads(filters: Record<string, any> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '' && v !== 'todos') params.set(k, String(v))
  })
  const query = params.toString()
  return useQuery<PaginatedResponse<Lead>>({
    queryKey: ['leads', filters],
    queryFn: () => api.get(`/leads${query ? `?${query}` : ''}`),
  })
}

export function useLead(id: string | null) {
  return useQuery<Lead>({
    queryKey: ['lead', id],
    queryFn: () => api.get(`/leads/${id}`),
    enabled: !!id,
  })
}

export function useLeadMetrics() {
  return useQuery({
    queryKey: ['lead-metrics'],
    queryFn: () => api.get('/leads/metrics'),
  })
}

export function useCreateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Lead>) => api.post('/leads', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['lead-metrics'] })
    },
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Lead> & { id: string }) =>
      api.patch(`/leads/${id}`, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['lead', vars.id] })
      qc.invalidateQueries({ queryKey: ['lead-metrics'] })
    },
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['lead-metrics'] })
    },
    onError: (err: any) => alert(`Erro ao excluir lead: ${err.message}`),
  })
}

// ─── Properties ───────────────────────────────────────────────────────────────

export function useProperties(filters: Record<string, any> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  const query = params.toString()
  return useQuery<PaginatedResponse<Property>>({
    queryKey: ['properties', filters],
    queryFn: () => api.get(`/properties${query ? `?${query}` : ''}`),
  })
}

export function useCreateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Property>) => api.post('/properties', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  })
}

export function useUpdateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Property> & { id: string }) =>
      api.patch(`/properties/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  })
}

export function useDeleteProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/properties/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
    onError: (err: any) => alert(`Erro ao excluir imóvel: ${err.message}`),
  })
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      // 1. Otimizar e comprimir a imagem para WebP no Frontend
      const options = {
        maxSizeMB: 1, // Tamanho máximo de 1MB
        maxWidthOrHeight: 1920, // Resolução máxima Full HD
        useWebWorker: true,
        fileType: 'image/webp' as string, // Forçar conversão para WebP
      }

      const compressedFile = await imageCompression(file, options)
      
      // Criar um nome único para o arquivo
      const tenantRes = await api.get('/tenants/me')
      const tenantId = tenantRes.id || 'default'
      const fileName = `${tenantId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`

      // 2. Fazer o upload diretamente do navegador para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('broker') // O nome do seu bucket no Supabase
        .upload(fileName, compressedFile, {
          contentType: 'image/webp',
          upsert: false,
        })

      if (error) {
        throw new Error(`Falha no upload para o Supabase: ${error.message}`)
      }

      // 3. Pegar a URL pública do arquivo recém-enviado
      const { data: publicUrlData } = supabase.storage
        .from('broker')
        .getPublicUrl(data.path)

      return { url: publicUrlData.publicUrl }
    },
  })
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function useTasks(filters: Record<string, any> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  const query = params.toString()
  return useQuery<PaginatedResponse<Task>>({
    queryKey: ['tasks', filters],
    queryFn: () => api.get(`/tasks${query ? `?${query}` : ''}`),
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Task>) => api.post('/tasks', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Task> & { id: string }) =>
      api.patch(`/tasks/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    onError: (err: any) => alert(`Erro ao excluir: ${err.message}`),
  })
}

// ─── Conversations ────────────────────────────────────────────────────────────

export function useConversations(filters: Record<string, any> = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v))
  })
  const query = params.toString()
  return useQuery<PaginatedResponse<Conversation>>({
    queryKey: ['conversations', filters],
    queryFn: () => api.get(`/conversations${query ? `?${query}` : ''}`),
  })
}

export function useMessages(conversationId: string | null) {
  return useQuery<{ data: Message[]; nextCursor: string | null }>({
    queryKey: ['messages', conversationId],
    queryFn: () => api.get(`/conversations/${conversationId}/messages`),
    enabled: !!conversationId,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ conversationId, ...data }: { conversationId: string; content: string; type?: string; mediaUrl?: string; fileName?: string }) =>
      api.post(`/conversations/${conversationId}/messages`, data),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ['messages', vars.conversationId] })
      
      const previous = qc.getQueryData(['messages', vars.conversationId])
      
      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversationId: vars.conversationId,
        content: vars.content,
        type: vars.type || 'text',
        direction: 'out',
        status: 'sending',
        mediaUrl: vars.mediaUrl || null,
        fileName: vars.fileName || null,
        sentAt: new Date().toISOString(),
      }

      qc.setQueryData(['messages', vars.conversationId], (old: any) => {
        if (!old) return { data: [tempMessage], nextCursor: null }
        return {
          ...old,
          data: [...old.data, tempMessage]
        }
      })

      return { previous, tempId: tempMessage.id }
    },
    onSuccess: (serverMessage, vars, context) => {
      qc.setQueryData(['messages', vars.conversationId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((m: any) => m.id === context.tempId ? serverMessage : m)
        }
      })
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (err, vars, context) => {
      if (context?.previous) {
        qc.setQueryData(['messages', vars.conversationId], context.previous)
      }
      alert('Erro ao enviar mensagem.')
    }
  })
}

// ─── Tenant ───────────────────────────────────────────────────────────────────

export function useTenant() {
  return useQuery({
    queryKey: ['tenant'],
    queryFn: () => api.get('/tenants/me'),
  })
}

export function useTenantUsers() {
  return useQuery({
    queryKey: ['tenant-users'],
    queryFn: () => api.get('/tenants/me/users'),
  })
}

export function useUpdateTenant() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => api.patch('/tenants/me', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenant'] }),
  })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role?: string }) =>
      api.post('/tenants/me/users', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tenant-users'] }),
  })
}
