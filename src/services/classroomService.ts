import api from './api'

export interface Classroom {
  id: string | number
  name: string
  block?: string | null
  state?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface CreateClassroomDto {
  name: string
  block?: string
  state?: string
}

export interface UpdateClassroomDto extends Partial<CreateClassroomDto> { }

export const classroomService = {
  getAll: async (): Promise<Classroom[]> => {
    try {
      const { data } = await api.get<Classroom[]>('/classroom')
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error getting classrooms'
      )
    }
  },

  getAllWithDetails: async (): Promise<Classroom[]> => {
    try {
      const { data } = await api.get<Classroom[]>('/classroom/with-details')
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error getting classrooms with details'
      )
    }
  },

  create: async (data: CreateClassroomDto): Promise<Classroom> => {
    try {
      const { data: responseData } = await api.post<Classroom>('/classroom', data)
      return responseData
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error creating classroom'
      )
    }
  },

  update: async (id: number, data: UpdateClassroomDto): Promise<Classroom> => {
    try {
      const { data: responseData } = await api.patch<Classroom>(`/classroom/${id}`, data)
      return responseData
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error updating classroom'
      )
    }
  },
}

