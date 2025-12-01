// import api from './api'
import { eventMockService } from '@/mocks/eventMock'

export interface CreateEventDto {
  nombre: string
  aula_ids: (string | number)[]
  fecha_evento: string
  hora_inicio: string
  hora_fin: string
}

export interface UpdateEventDto {
  nombre?: string
  aula_ids?: (string | number)[]
  fecha_evento?: string
  hora_inicio?: string
  hora_fin?: string
}

export interface EventItem {
  id: string | number
  nombre: string
  fecha_evento: string
  hora_inicio: string
  hora_fin: string
  aulas?: {
    id: string | number
    nombre: string
  }[]
  created_at?: string | null
  updated_at?: string | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const eventService = {
  create: async (data: CreateEventDto): Promise<EventItem> => {
    try {
      // const { data: response } = await api.post<EventItem>('/evento', data)
      // return response
      return await eventMockService.create(data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al registrar evento'
      )
    }
  },

  update: async (id: string | number, data: UpdateEventDto): Promise<EventItem> => {
    try {
      // const { data: response } = await api.patch<EventItem>(`/evento/${id}`, data)
      // return response
      return await eventMockService.update(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al actualizar evento'
      )
    }
  },

  getAll: async (): Promise<EventItem[]> => {
    try {
      // const { data } = await api.get<EventItem[]>('/evento')
      // return data
      return await eventMockService.getAll()
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al obtener eventos'
      )
    }
  },

  getById: async (id: string | number): Promise<EventItem> => {
    try {
      // const { data } = await api.get<EventItem>(`/evento/${id}`)
      // return data
      return await eventMockService.getById(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al obtener evento'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/evento/${id}`)
      await eventMockService.remove(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error al eliminar evento'
      )
    }
  },
}

