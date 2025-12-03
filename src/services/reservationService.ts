// import api from './api'
import { reservationMockService } from '@/mocks/reservationMock'

export interface CreateReservationDto {
  subject: string
  classroom_ids: (string | number)[]
  dates: string
  start_time: string
  end_time: string
}

export interface UpdateReservationDto {
  subject?: string
  classroom_ids?: (string | number)[]
  dates?: string
  start_time?: string
  end_time?: string
}

export interface ReservationItem {
  id: string | number
  subject: string
  dates: string
  start_time: string
  end_time: string
  classrooms?: {
    id: string | number
    name: string
  }[]
  created_at?: string | null
  updated_at?: string | null
}

// Usando datos mock - cambiar a api cuando el backend esté listo
export const reservationService = {
  create: async (data: CreateReservationDto): Promise<ReservationItem> => {
    try {
      // const { data: response } = await api.post<ReservationItem>('/reservation', data)
      // return response
      return await reservationMockService.create(data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error registering reservation'
      )
    }
  },

  update: async (id: string | number, data: UpdateReservationDto): Promise<ReservationItem> => {
    try {
      // const { data: response } = await api.patch<ReservationItem>(`/reservation/${id}`, data)
      // return response
      return await reservationMockService.update(id, data)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error updating reservation'
      )
    }
  },

  getAll: async (): Promise<ReservationItem[]> => {
    try {
      // const { data } = await api.get<ReservationItem[]>('/reservation')
      // return data
      return await reservationMockService.getAll()
    } catch (error: any) {
      throw new Error(
        error.message || 'Error getting reservations'
      )
    }
  },

  getById: async (id: string | number): Promise<ReservationItem> => {
    try {
      // const { data } = await api.get<ReservationItem>(`/reservation/${id}`)
      // return data
      return await reservationMockService.getById(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error getting reservation'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      // await api.delete(`/reservation/${id}`)
      await reservationMockService.remove(id)
    } catch (error: any) {
      throw new Error(
        error.message || 'Error deleting reservation'
      )
    }
  },
}

