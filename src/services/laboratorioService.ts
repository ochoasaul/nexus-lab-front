import api from './api'

export interface Laboratorio {
  id: string | number
  nombre: string
  descripcion?: string | null
  ubicacion?: string | null
  estado?: boolean
  created_at?: string | null
  updated_at?: string | null
}

export const laboratorioService = {
  getAll: async (): Promise<Laboratorio[]> => {
    try {
      const { data } = await api.get<Laboratorio[]>('/laboratorio')
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener los laboratorios'
      )
    }
  },

  getById: async (id: string | number): Promise<Laboratorio> => {
    try {
      const { data } = await api.get<Laboratorio>(`/laboratorio/${id}`)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al obtener el laboratorio'
      )
    }
  },
}

