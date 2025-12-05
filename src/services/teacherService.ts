import api from './api'
// import { teacherMockService } from '@/mocks/teacherMock'

export interface CreateTeacherDto {
  person_id?: string | number
  state?: string
}

export interface UpdateTeacherDto {
  person_id?: string | number
  state?: string
}

export interface TeacherItem {
  id: string | number
  state: string | null
  created_at: string | null
  updated_at: string | null
  person_id: string | number | null
  person?: {
    id: string | number
    first_name: string
    last_name: string
    identity_card?: string | null
  } | null
}

export type Teacher = TeacherItem


// Using mock data - switch to api when backend is ready
export const teacherService = {
  create: async (data: CreateTeacherDto): Promise<TeacherItem> => {
    try {
      const { data: response } = await api.post<TeacherItem>('/teacher', data)
      return response
    } catch (error: any) {
      throw new Error(
        error.message || 'Error registering teacher'
      )
    }
  },

  update: async (id: string | number, data: UpdateTeacherDto): Promise<TeacherItem> => {
    try {
      const { data: response } = await api.patch<TeacherItem>(`/teacher/${id}`, data)
      return response
    } catch (error: any) {
      throw new Error(
        error.message || 'Error updating teacher'
      )
    }
  },

  getAll: async (): Promise<TeacherItem[]> => {
    try {
      const { data } = await api.get<TeacherItem[]>('/teacher')
      return data
    } catch (error: any) {
      throw new Error(
        error.message || 'Error getting teachers'
      )
    }
  },

  getById: async (id: string | number): Promise<TeacherItem> => {
    try {
      const { data } = await api.get<TeacherItem>(`/teacher/${id}`)
      return data
    } catch (error: any) {
      throw new Error(
        error.message || 'Error getting teacher'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/teacher/${id}`)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error deleting teacher'
      )
    }
  },

  search: async (query: string, page: number = 1, pageSize: number = 20): Promise<TeacherItem[]> => {
    if (!query.trim()) return []
    try {
      const { data } = await api.get<TeacherItem[]>('/teacher/search', {
        params: { q: query, page, pageSize },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.message || 'Error searching teachers'
      )
    }
  },
}

