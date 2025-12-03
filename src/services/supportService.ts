import api from './api'

export interface CreateSupportDto {
  date_time?: string
  solution?: string
  problem: string
  requester_person_id: string
}

export const supportService = {
  create: async (data: CreateSupportDto) => {
    const payload = {
      ...data,
      date_time: data.date_time ? new Date(data.date_time).toISOString() : undefined,
    }
    const response = await api.post('/support-management', payload)
    return response.data
  },

  getAll: async () => {
    const response = await api.get('/support-management/course-date')
    return response.data
  },
}
