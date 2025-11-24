// services/authService.ts
import api from './api'

export interface AuthUser {
  id: string
  email: string
  name: string
  role?: string
  status?: string
}

// ✅ Usa username y password (como espera el backend)
export interface LoginCredentials {
  username: string   // ✅ Correcto
  password: string   // ✅ Correcto
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials)
      
      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al iniciar sesión'
      )
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken: (): string | null => {
    return localStorage.getItem('token')
  },

  getCurrentUser: (): AuthUser | null => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token')
  }
}
