// import api from './api'
import { soporteMockService } from '@/mocks/soporteMock'

export interface CreateSoporteMateriaDto {
  fecha_hora?: string
  solucion?: string
  problema: string
  tipo: string
}

export interface CreateSoporteTecnicoDto {
  fecha_hora?: string
  solucion?: string
  problema: string
  tipo: string
  persona_solicitante_id?: string
}

export interface SoporteMateriaItem {
  id: string | number
  fecha_hora: string | null
  solucion: string | null
  problema: string | null
  tipo: string
  created_at: string
  laboratorio?: {
    id: string | number
    nombre: string
  } | null
  usuario?: {
    id: string | number
    name: string
  } | null
}

export interface SoporteTecnicoItem {
  id: string | number
  fecha_hora: string | null
  solucion: string | null
  problema: string | null
  tipo: string
  created_at: string
  laboratorio?: {
    id: string | number
    nombre: string
  } | null
  usuario?: {
    id: string | number
    name: string
  } | null
  persona?: {
    id: string | number
    nombre: string
    apellido: string
  } | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const soporteService = {
  createMateria: async (data: CreateSoporteMateriaDto) => {
    try {
      // const { data: response } = await api.post<SoporteMateriaItem>('/soporte/materia', data)
      // return response
      return await soporteMockService.createMateria(data)
    } catch (error: any) {
      throw new Error(
        error.message || 
        'Error al registrar soporte de materia'
      )
    }
  },

  createTecnico: async (data: CreateSoporteTecnicoDto) => {
    try {
      // const { data: response } = await api.post<SoporteTecnicoItem>('/soporte/tecnico', data)
      // return response
      return await soporteMockService.createTecnico(data)
    } catch (error: any) {
      throw new Error(
        error.message || 
        'Error al registrar soporte técnico'
      )
    }
  },

  getAllMateria: async (): Promise<SoporteMateriaItem[]> => {
    try {
      // const { data } = await api.get<SoporteMateriaItem[]>('/soporte/materia')
      // return data
      return await soporteMockService.getAllMateria()
    } catch (error: any) {
      throw new Error(
        error.message ||
          'Error al obtener soportes de materia'
      )
    }
  },

  getAllTecnico: async (): Promise<SoporteTecnicoItem[]> => {
    try {
      // const { data } = await api.get<SoporteTecnicoItem[]>('/soporte/tecnico')
      // return data
      return await soporteMockService.getAllTecnico()
    } catch (error: any) {
      throw new Error(
        error.message ||
          'Error al obtener soportes técnicos'
      )
    }
  },

  updateMateria: async (id: string | number, data: CreateSoporteMateriaDto): Promise<SoporteMateriaItem> => {
    try {
      // const { data: response } = await api.patch<SoporteMateriaItem>(`/soporte/materia/${id}`, data)
      // return response
      return await soporteMockService.updateMateria(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al actualizar soporte de materia'
      )
    }
  },

  updateTecnico: async (id: string | number, data: CreateSoporteTecnicoDto): Promise<SoporteTecnicoItem> => {
    try {
      // const { data: response } = await api.patch<SoporteTecnicoItem>(`/soporte/tecnico/${id}`, data)
      // return response
      return await soporteMockService.updateTecnico(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al actualizar soporte técnico'
      )
    }
  },

  removeMateria: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/soporte/materia/${id}`)
      await soporteMockService.removeMateria(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al eliminar soporte de materia'
      )
    }
  },

  removeTecnico: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/soporte/tecnico/${id}`)
      await soporteMockService.removeTecnico(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al eliminar soporte técnico'
      )
    }
  },
}

