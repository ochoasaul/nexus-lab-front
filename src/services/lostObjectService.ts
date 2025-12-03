import api from './api'

export interface CreateLostObjectDto {
  object: string
  found_date?: string
  found_schedule?: string
  classroom_id?: string
}

export interface LostObjectResponse {
  created: any
  upload: any
}

export enum LostObjectState {
  Perdido = 'Perdido',
  Porteria = 'Porteria',
  Entregado = 'Entregado',
}

export interface LostObjectItem {
  id: string | number
  object: string
  state: LostObjectState | string
  created_at: string
  found_date?: string | null
  found_schedule?: string | null
  classroom?: {
    id: string | number
    name: string
  } | null
  multimedia?: {
    id: string | number
    path: string
    name?: string | null
  } | null
  object_delivery?: Array<{
    id: string | number
    delivery_date: string | null
    multimedia?: {
      id: string | number
      path: string
      name?: string | null
    } | null
  }> | null
}


const prefixUrl = '/lost-objects-management'

export interface DeliverLostObjectPayload {
  person_id: string
}

export const lostObjectService = {
  create: async (data: CreateLostObjectDto, imageFile: File): Promise<LostObjectResponse> => {

    const formData = new FormData()
    console.log(data)
    // Agregar la imagen (el backend espera el campo 'image')
    formData.append('image', imageFile)

    // Agregar los demás campos
    formData.append('object', data.object)
    if (data.found_date) {
      formData.append('found_date', data.found_date.toString())
    }
    if (data.found_schedule) {
      formData.append('found_schedule', data.found_schedule.toString())
    }
    if (data.classroom_id) {
      formData.append('classroom_id', String(data.classroom_id.toString()))
    }

    try {
      const { data: response } = await api.post<LostObjectResponse>(`${prefixUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error registering lost object'
      )
    }
  },

  getByLaboratoryAndMonth: async (month?: string): Promise<LostObjectItem[]> => {
    try {
      const params: Record<string, string> = {}
      if (month) {
        params.month = month
      }
      const { data } = await api.get<LostObjectItem[]>(`${prefixUrl}/laboratory/by-month`, { params })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error getting laboratory lost objects'
      )
    }
  },

  deliver: async (lostObjectId: string | number, payload: DeliverLostObjectPayload, evidence: File) => {
    const formData = new FormData()
    formData.append('person_id', payload.person_id)
    formData.append('image', evidence)

    try {
      const { data } = await api.post(`${prefixUrl}/${lostObjectId}/deliver`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error delivering lost object'
      )
    }
  },

  moveToReceptionByDateRange: async (startDate: string, endDate: string) => {
    try {
      const { data } = await api.post(`${prefixUrl}/move-to-reception`, {
        startDate,
        endDate,
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error moving objects to porteria'
      )
    }
  },

  moveAllLostToReception: async () => {
    try {
      const { data } = await api.post(`${prefixUrl}/move-all-lost-to-reception`)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        'Error moving objects to porteria'
      )
    }
  },
}

