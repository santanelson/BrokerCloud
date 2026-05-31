// ─── Tenant ──────────────────────────────────────────────────────────────────
export interface Tenant {
  id: string
  name: string
  plan: 'starter' | 'pro' | 'enterprise'
  whatsappInstanceUrl?: string
  evolutionApiKey?: string
  createdAt: string
}

// ─── User / Corretor ──────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'manager' | 'broker'

export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
  phone?: string
  createdAt: string
}

// ─── Lead ─────────────────────────────────────────────────────────────────────
export type LeadStatus =
  | 'novo'
  | 'em_atendimento'
  | 'qualificado'
  | 'proposta'
  | 'fechado'
  | 'perdido'

export type LeadSource =
  | 'facebook_ads'
  | 'google_ads'
  | 'instagram'
  | 'whatsapp'
  | 'indicacao'
  | 'portal_imoveis'
  | 'site'
  | 'direto'
  | 'outro'

export type PropertyType =
  | 'apartamento'
  | 'casa'
  | 'terreno'
  | 'comercial'
  | 'rural'
  | 'outro'

export interface Lead {
  id: string
  tenantId: string
  assignedBrokerId?: string
  broker?: User
  name: string
  email?: string
  phone: string
  status: LeadStatus
  source: LeadSource
  score: number // 0-100
  budget?: number
  interestType?: PropertyType
  interestLocation?: string
  notes?: string
  tags?: string[]
  lastContactAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Property / Imóvel ────────────────────────────────────────────────────────
export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido' | 'alugado' | 'inativo'

export interface Property {
  id: string
  tenantId: string
  brokerId?: string
  broker?: User
  title: string
  description?: string
  type: PropertyType
  status: PropertyStatus
  price: number
  area?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpots?: number
  address: string
  neighborhood?: string
  city: string
  state: string
  zipCode?: string
  lat?: number
  lng?: number
  images?: string[]
  features?: string[]
  createdAt: string
  updatedAt: string
}

// ─── Task / Tarefa ────────────────────────────────────────────────────────────
export type TaskType = 'visita' | 'ligacao' | 'email' | 'proposta' | 'reuniao' | 'outro'
export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente'

export interface Task {
  id: string
  tenantId: string
  leadId?: string
  lead?: Lead
  propertyId?: string
  brokerId: string
  broker?: User
  title: string
  description?: string
  type: TaskType
  priority: TaskPriority
  dueAt: string
  done: boolean
  doneAt?: string
  createdAt: string
}

// ─── WhatsApp / Chat ──────────────────────────────────────────────────────────
export type MessageDirection = 'in' | 'out'
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'

export interface Message {
  id: string
  conversationId: string
  direction: MessageDirection
  type: MessageType
  content: string
  mediaUrl?: string
  fileName?: string
  status: MessageStatus
  sentAt: string
}

export interface Conversation {
  id: string
  tenantId: string
  leadId?: string
  lead?: Lead
  whatsappJid: string
  lastMessage?: Message
  lastMessageAt?: string
  unreadCount: number
  isArchived: boolean
  assignedBrokerId?: string
  broker?: User
  createdAt: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardMetrics {
  totalLeads: number
  leadsChange: number
  activeLeads: number
  hotLeads: number
  conversionRate: number
  conversionChange: number
  totalSales: number
  salesChange: number
  averageTicket: number
  ticketChange: number
  estimatedCommissions: number
  commissionsChange: number
  responseRate: number
  costPerLead: number
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
}
