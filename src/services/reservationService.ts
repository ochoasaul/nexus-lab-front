import api from './api'

export interface CreateReservationDto {
  dates: string // JSON string
  start_date: string
  end_date: string
  requirements?: string
  observation?: string
  student_count?: string
  state?: string
  subject: string
  requester_person_id: string
  classroom_id?: string
  responsible_user_id?: string
  day_type: string
  schedule: string
}

export interface ReservationItem {
  id: string | number
  dates: any
  start_time?: string
  end_time?: string
  requirements?: string
  observation?: string
  student_count?: number
  state?: string
  subject?: string
  day_type?: string
  schedule?: string
  requester_person_id?: string | number
  classroom_id?: string | number
  responsible_user_id?: string | number
  created_at?: string
  updated_at?: string
  person?: {
    first_name: string
    last_name: string
  }
  classroom?: {
    name: string
  }
}

export const reservationService = {
  create: async (data: CreateReservationDto): Promise<ReservationItem> => {
    try {
      const { data: response } = await api.post<ReservationItem>('/reservation-management', data)
      return response
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error registering reservation'
      )
    }
  },

  getAll: async (): Promise<ReservationItem[]> => {
    try {
      const { data } = await api.get<ReservationItem[]>('/reservation-management')
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error getting reservations'
      )
    }
  },

  getAvailableClassrooms: async (data: Partial<CreateReservationDto>): Promise<{ id: string | number; name: string }[]> => {
    try {
      const { data: response } = await api.post<{ id: string | number; name: string }[]>('/reservation-management/available-classrooms', data)
      return response
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error getting available classrooms'
      )
    }
  },

  extend: async (id: string | number, dates: string[]): Promise<ReservationItem> => {
    try {
      const { data } = await api.post<ReservationItem>(`/reservation-management/${id}/extend`, { dates })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error extending reservation'
      )
    }
  },
}


