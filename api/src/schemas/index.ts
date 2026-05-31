import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export const registerSchema = z.object({
  tenantName: z.string().min(2, 'Nome da imobiliária obrigatório'),
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
})

// ─── Lead ─────────────────────────────────────────────────────────────────────
export const createLeadSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone inválido'),
  status: z
    .enum(['novo', 'em_atendimento', 'qualificado', 'proposta', 'fechado', 'perdido'])
    .default('novo'),
  source: z
    .enum(['facebook_ads', 'google_ads', 'instagram', 'whatsapp', 'indicacao', 'portal_imoveis', 'site', 'direto', 'outro'])
    .default('outro'),
  budget: z.number().positive().optional(),
  interestType: z
    .enum(['apartamento', 'casa', 'terreno', 'comercial', 'rural', 'outro'])
    .optional(),
  interestLocation: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  assignedBrokerId: z.string().cuid().optional(),
})

export const updateLeadSchema = createLeadSchema.partial().extend({
  score: z.number().min(0).max(100).optional(),
})

export const leadFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(1000).default(20),
  search: z.string().optional(),
  status: z.enum(['novo', 'em_atendimento', 'qualificado', 'proposta', 'fechado', 'perdido']).optional(),
  source: z.string().optional(),
  brokerId: z.string().optional(),
  orderBy: z.enum(['createdAt', 'updatedAt', 'score', 'lastContactAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// ─── Property ─────────────────────────────────────────────────────────────────
export const createPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['apartamento', 'casa', 'terreno', 'comercial', 'rural', 'outro']),
  status: z.enum(['disponivel', 'reservado', 'vendido', 'alugado', 'inativo']).default('disponivel'),
  price: z.number().positive(),
  area: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  parkingSpots: z.number().int().min(0).optional(),
  address: z.string().min(1),
  neighborhood: z.string().optional(),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  images: z.array(z.string().url()).default([]),
  features: z.array(z.string()).default([]),
  brokerId: z.string().cuid().optional(),
})

export const updatePropertySchema = createPropertySchema.partial()

// ─── Task ─────────────────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['visita', 'ligacao', 'email', 'proposta', 'reuniao', 'outro']).default('outro'),
  priority: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
  dueAt: z.string().datetime(),
  leadId: z.string().cuid().optional(),
  brokerId: z.string().cuid().optional(),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  done: z.boolean().optional(),
})

// ─── Pagination ───────────────────────────────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

// ─── Types ────────────────────────────────────────────────────────────────────
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type LeadFilters = z.infer<typeof leadFiltersSchema>
export type CreatePropertyInput = z.infer<typeof createPropertySchema>
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
