// import api from './api'
import { classroomDetailMockService } from '@/mocks/classroomDetailMock'

export interface CreateClassroomDetailDto {
  classroom_id?: string | number
  student_capacity: number
  computer_count?: number
  projector_installed: boolean
  air_conditioning: boolean
}

export interface UpdateClassroomDetailDto {
  classroom_id?: string | number
  student_capacity?: number
  computer_count?: number
  projector_installed?: boolean
  air_conditioning?: boolean
}

export interface ClassroomDetailItem {
  id: string | number
  classroom_id: string | number | null
  student_capacity: number
  computer_count: number | null
  projector_installed: boolean
  air_conditioning: boolean
  classroom?: {
    id: string | number
    name: string
  } | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const classroomDetailService = {
  create: async (data: CreateClassroomDetailDto): Promise<ClassroomDetailItem> => {
    try {
      // const { data: response } = await api.post<ClassroomDetailItem>('/classroom-detail', data)
      // return response
      return await classroomDetailMockService.create(data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error registering classroom detail'
      )
    }
  },

  update: async (id: string | number, data: UpdateClassroomDetailDto): Promise<ClassroomDetailItem> => {
    try {
      // const { data: response } = await api.patch<ClassroomDetailItem>(`/classroom-detail/${id}`, data)
      // return response
      return await classroomDetailMockService.update(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error updating classroom detail'
      )
    }
  },

  getAll: async (): Promise<ClassroomDetailItem[]> => {
    try {
      // const { data } = await api.get<ClassroomDetailItem[]>('/classroom-detail')
      // return data
      return await classroomDetailMockService.getAll()
    } catch (error: any) {
      throw new Error(
        error.message || 'Error getting classroom details'
      )
    }
  },

  getById: async (id: string | number): Promise<ClassroomDetailItem> => {
    try {
      // const { data } = await api.get<ClassroomDetailItem>(`/classroom-detail/${id}`)
      // return data
      return await classroomDetailMockService.getById(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error getting classroom detail'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/classroom-detail/${id}`)
      await classroomDetailMockService.remove(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error deleting classroom detail'
      )
    }
  },
}

