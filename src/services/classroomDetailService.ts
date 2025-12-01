// import api from './api'
import { classroomDetailMockService } from '@/mocks/classroomDetailMock'

export interface CreateClassroomDetailDto {
  aula_id?: string | number
  capacidad_alumnos: number
  num_computadoras?: number
  proyector_instalado: boolean
  aire_acondicionado: boolean
}

export interface UpdateClassroomDetailDto {
  aula_id?: string | number
  capacidad_alumnos?: number
  num_computadoras?: number
  proyector_instalado?: boolean
  aire_acondicionado?: boolean
}

export interface ClassroomDetailItem {
  id: string | number
  aula_id: string | number | null
  capacidad_alumnos: number
  num_computadoras: number | null
  proyector_instalado: boolean
  aire_acondicionado: boolean
  aula?: {
    id: string | number
    nombre: string
  } | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const classroomDetailService = {
  create: async (data: CreateClassroomDetailDto): Promise<ClassroomDetailItem> => {
    try {
      // const { data: response } = await api.post<ClassroomDetailItem>('/detalle-aula', data)
      // return response
      return await classroomDetailMockService.create(data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al registrar detalle de aula'
      )
    }
  },

  update: async (id: string | number, data: UpdateClassroomDetailDto): Promise<ClassroomDetailItem> => {
    try {
      // const { data: response } = await api.patch<ClassroomDetailItem>(`/detalle-aula/${id}`, data)
      // return response
      return await classroomDetailMockService.update(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al actualizar detalle de aula'
      )
    }
  },

  getAll: async (): Promise<ClassroomDetailItem[]> => {
    try {
      // const { data } = await api.get<ClassroomDetailItem[]>('/detalle-aula')
      // return data
      return await classroomDetailMockService.getAll()
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al obtener detalles de aulas'
      )
    }
  },

  getById: async (id: string | number): Promise<ClassroomDetailItem> => {
    try {
      // const { data } = await api.get<ClassroomDetailItem>(`/detalle-aula/${id}`)
      // return data
      return await classroomDetailMockService.getById(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al obtener detalle de aula'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/detalle-aula/${id}`)
      await classroomDetailMockService.remove(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al eliminar detalle de aula'
      )
    }
  },
}

