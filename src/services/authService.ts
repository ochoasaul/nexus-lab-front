// services/authService.ts
import api from './api'

export interface Persona {
  id: string | number
  nombre: string
  apellido?: string
  carnet?: string
  correo?: string
  genero?: string
  fecha_nacimiento?: string
}

export interface Modulo {
  id: string | number
  nombre: string
}

export interface Rol {
  id: string | number
  nombre: string
  modulos?: Modulo[]
}

export interface Laboratorio {
  id: string | number
  nombre: string
  descripcion?: string
  ubicacion?: string
  estado?: boolean
}

export interface AuthUser {
  id: string | number
  usuario: string
  persona_id: string | number | null
  rol_id: string | number | null
  laboratorio_id: string | number | null
  persona: Persona[]
  rol: Rol[]
  laboratorio: Laboratorio[]
}

export interface LoginCredentials {
  usuario: string
  clave: string
}

export interface LoginResponse {
  access_token: string
}

export interface ProfileResponse {
  id: string | number
  usuario: string
  persona_id: string | number | null
  rol_id: string | number | null
  laboratorio_id: string | number | null
  persona: Persona[]
  rol: Rol[]
  laboratorio: Laboratorio[]
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
      
      throw new Error('No se pudo obtener el perfil del usuario')
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al iniciar sesión'
      )
    }
  },

  getProfile: async (): Promise<AuthUser | null> => {
    try {
      const { data } = await api.get<ProfileResponse>('/auth/profile')
      return data as AuthUser
    } catch (error: any) {
      console.error('Error al obtener perfil:', error)
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
