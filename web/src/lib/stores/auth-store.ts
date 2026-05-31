import { create } from 'zustand'
import { api } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'broker'
  avatarUrl?: string
  phone?: string
  tenant?: {
    id: string
    name: string
    slug: string
    plan: string
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<void>
  register: (data: { tenantName: string; name: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const data = await api.post('/auth/login', { email, password }, { skipAuth: true })
    api.setAccessToken(data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    set({ user: data.user, isAuthenticated: true, isLoading: false })
  },

  register: async (body) => {
    const data = await api.post('/auth/register', body, { skipAuth: true })
    api.setAccessToken(data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    set({ user: { ...data.user, tenant: data.tenant }, isAuthenticated: true, isLoading: false })
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken })
      }
    } catch {
      // Ignore logout errors
    }
    api.setAccessToken(null)
    localStorage.removeItem('refreshToken')
    set({ user: null, isAuthenticated: false, isLoading: false })
  },

  loadUser: async () => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
    if (!refreshToken) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }

    try {
      // First get a fresh access token
      const refreshRes = await api.post('/auth/refresh', { refreshToken }, { skipAuth: true })
      api.setAccessToken(refreshRes.accessToken)
      localStorage.setItem('refreshToken', refreshRes.refreshToken)

      // Then fetch user data
      const user = await api.get('/auth/me')
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      api.setAccessToken(null)
      localStorage.removeItem('refreshToken')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}))
