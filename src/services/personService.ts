import api from './api'
// import { personaMockService } from '@/mocks/personaMock'

export interface Person {
  id: string | number
  first_name: string
  last_name: string
  identity_card?: string | null
}

export enum PersonType {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  NONE = 'None',
}

export interface CreatePersonDto {
  first_name: string
  last_name: string
  email?: string
  identity_card?: string
  gender: string
  birth_date: string
  type: PersonType
  registration?: string
}

// Using mock data - switch to api when backend is ready
export const personService = {
  search: async (query: string, page: number = 1, pageSize: number = 20): Promise<Person[]> => {
    if (!query.trim()) return []
    try {
      const { data } = await api.get<Person[]>('/person/search', {
        params: { q: query, page, pageSize },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.message || 'Error searching persons'
      )
    }
  },

  create: async (data: CreatePersonDto): Promise<Person> => {
    try {
      const { data: response } = await api.post<Person>('/person', data)
      return response
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error creating person'
      )
    }
  },
}



