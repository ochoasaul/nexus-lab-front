// services/authService.ts
import api from './api'

export interface Person {
  id: string | number
  first_name: string
  last_name?: string
  identity_card?: string
  email?: string
  gender?: string
  birth_date?: string
}

export interface Module {
  id: string | number
  name: string
}

export interface Role {
  id: string | number
  name: string
  modules?: Module[]
}

export interface Laboratory {
  id: string | number
  name: string
  description?: string
  location?: string
  state?: boolean
}

export interface AuthUser {
  id: string | number
  username: string
  person_id: string | number | null
  role_id: string | number | null
  laboratory_id: string | number | null
  person: Person[]
  role: Role[]
  laboratory: Laboratory[]
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
}

export interface ProfileResponse {
  id: string | number
  username: string
  person_id: string | number | null
  role_id: string | number | null
  laboratory_id: string | number | null
  person: Person[]
  role: Role[]
  laboratory: Laboratory[]
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ access_token: string; user: AuthUser }> => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', credentials)

      if (data.access_token) {
        // Limpiar cualquier token viejo que pueda existir
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')

        // Guardar solo el token (no guardar datos del usuario por seguridad)
        localStorage.setItem('token', data.access_token)

        // Obtener el perfil del usuario después del login
        const profile = await authService.getProfile()
        if (profile) {
          return { access_token: data.access_token, user: profile }
        }
      }

      throw new Error('Could not get user profile')
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error logging in'
      )
    }
  },

  getProfile: async (): Promise<AuthUser | null> => {
    try {
      const { data } = await api.get<ProfileResponse>('/auth/profile')
      return data as AuthUser
    } catch (error: any) {
      console.error('Error getting profile:', error)
      return null
    }
  },

  logout: async () => {
    // Limpiar solo el token (no guardamos datos del usuario)
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  },

  getToken: (): string | null => {
    return localStorage.getItem('token')
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    // Obtener el perfil desde el backend si hay un token válido
    const token = localStorage.getItem('token')
    if (!token) {
      return null
    }
    return await authService.getProfile()
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token')
  }
}
