import api from './api'

export interface Aula {
  id: string | number
  nombre: string
  bloque?: string | null
  estado?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export const aulaService = {
  getAll: async (): Promise<Aula[]> => {
    try {
      const { data } = await api.get<Aula[]>('/aula')
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener las aulas'
      )
    }
  },
}

