import api from './api'

export interface Laboratory {
  id: string | number
  name: string
  description?: string | null
  location?: string | null
  state?: boolean
  created_at?: string | null
  updated_at?: string | null
}

const prefixURL = '/laboratory'

export const laboratoryService = {
  getAll: async (): Promise<Laboratory[]> => {
    try {
      const { data } = await api.get<Laboratory[]>(`${prefixURL}`)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error getting laboratories'
      )
    }
  },

  getById: async (id: string | number): Promise<Laboratory> => {
    try {
      const { data } = await api.get<Laboratory>(`${prefixURL}/${id}`)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error getting laboratory'
      )
    }
  },
}

