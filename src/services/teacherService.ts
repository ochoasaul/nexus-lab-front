// import api from './api'
import { teacherMockService } from '@/mocks/teacherMock'

export interface CreateTeacherDto {
  persona_id?: string | number
  estado?: string
}

export interface UpdateTeacherDto {
  persona_id?: string | number
  estado?: string
}

export interface TeacherItem {
  id: string | number
  estado: string | null
  created_at: string | null
  updated_at: string | null
  persona_id: string | number | null
  persona?: {
    id: string | number
    nombre: string
    apellido: string
    carnet?: string | null
  } | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const teacherService = {
  create: async (data: CreateTeacherDto): Promise<TeacherItem> => {
    try {
      // const { data: response } = await api.post<TeacherItem>('/docente', data)
      // return response
      return await teacherMockService.create(data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al registrar docente'
      )
    }
  },

  update: async (id: string | number, data: UpdateTeacherDto): Promise<TeacherItem> => {
    try {
      // const { data: response } = await api.patch<TeacherItem>(`/docente/${id}`, data)
      // return response
      return await teacherMockService.update(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al actualizar docente'
      )
    }
  },

  getAll: async (): Promise<TeacherItem[]> => {
    try {
      // const { data } = await api.get<TeacherItem[]>('/docente')
      // return data
      return await teacherMockService.getAll()
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al obtener docentes'
      )
    }
  },

  getById: async (id: string | number): Promise<TeacherItem> => {
    try {
      // const { data } = await api.get<TeacherItem>(`/docente/${id}`)
      // return data
      return await teacherMockService.getById(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al obtener docente'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/docente/${id}`)
      await teacherMockService.remove(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al eliminar docente'
      )
    }
  },
}

