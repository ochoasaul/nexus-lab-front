import api from './api'
// import { personaMockService } from '@/mocks/personaMock'

export interface Person {
  id: string | number
  first_name: string
  last_name: string
  identity_card?: string | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const personService = {
  search: async (query: string): Promise<Person[]> => {
    if (!query.trim()) return []
    try {
      const { data } = await api.get<Person[]>('/person/search', {
        params: { q: query },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.message || 'Error searching persons'
      )
    }
  },
}



