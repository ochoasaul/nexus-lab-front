// import api from './api'
import { personaMockService } from '@/mocks/personaMock'

export interface Persona {
  id: string | number
  nombre: string
  apellido: string
  carnet?: string | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const personaService = {
  search: async (query: string): Promise<Persona[]> => {
    if (!query.trim()) return []
    try {
      // const { data } = await api.get<Persona[]>('/persona/search', {
      //   params: { q: query },
      // })
      // return data
      return await personaMockService.search(query)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al buscar personas'
      )
    }
  },
}



