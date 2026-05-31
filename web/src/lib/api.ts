const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

class ApiClient {
  private accessToken: string | null = null

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null
    if (!refreshToken) return null

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (!res.ok) {
        localStorage.removeItem('refreshToken')
        this.accessToken = null
        return null
      }

      const data = await res.json()
      this.accessToken = data.accessToken
      localStorage.setItem('refreshToken', data.refreshToken)
      return data.accessToken
    } catch {
      return null
    }
  }

  async fetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth, headers: customHeaders, ...fetchOptions } = options

    const headers: Record<string, string> = {
      ...((customHeaders as Record<string, string>) || {}),
    }

    // Only set Content-Type if we actually have a body to send and it's not FormData
    if (fetchOptions.body && !headers['Content-Type']) {
      if (fetchOptions.body instanceof FormData) {
        // Leave it empty; browser will set multipart/form-data with boundary
      } else {
        headers['Content-Type'] = 'application/json'
      }
    }

    if (!skipAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    let res = await fetch(`${API_BASE}${endpoint}`, { ...fetchOptions, headers })

    // If 401, try to refresh token and retry once
    if (res.status === 401 && !skipAuth) {
      const newToken = await this.refreshAccessToken()
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        res = await fetch(`${API_BASE}${endpoint}`, { ...fetchOptions, headers })
      } else {
        // Redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        throw new ApiError('Sessão expirada. Faça login novamente.', 'UNAUTHORIZED', 401)
      }
    }

    if (res.status === 204) return undefined as T

    const data = await res.json()

    if (!res.ok) {
      throw new ApiError(
        data.message || data.error || 'Erro desconhecido',
        data.error || 'UNKNOWN_ERROR',
        res.status
      )
    }

    return data as T
  }

  // Convenience methods
  get<T = any>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T = any>(endpoint: string, body?: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined })
  }

  patch<T = any>(endpoint: string, body?: any, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'PATCH', body: body ? JSON.stringify(body) : undefined })
  }

  delete<T = any>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export class ApiError extends Error {
  code: string
  statusCode: number

  constructor(message: string, code: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
  }
}

export const api = new ApiClient()
