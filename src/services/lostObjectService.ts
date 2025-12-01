import api from './api'

export interface CreateLostObjectDto {
  objeto: string
  fecha_encontrado?: string
  horario_encontrado?: string
  aula_id?: string
}

export interface LostObjectResponse {
  created: any
  upload: any
}

export interface LostObjectItem {
  id: string | number
  objeto: string
  estado: string
  created_at: string
  fecha_encontrado?: string | null
  horario_encontrado?: string | null
  aula?: {
    id: string | number
    nombre: string
  } | null
  multimedia?: {
    id: string | number
    ruta: string
    nombre?: string | null
  } | null
  entrega_objeto?: Array<{
    id: string | number
    fecha_entrega: string | null
    multimedia?: {
      id: string | number
      ruta: string
      nombre?: string | null
    } | null
  }> | null
}

export interface DeliverLostObjectPayload {
  persona_id: string
}

export const lostObjectService = {
  create: async (data: CreateLostObjectDto, imageFile: File): Promise<LostObjectResponse> => {

    const formData = new FormData()
    console.log(data)
    // Agregar la imagen (el backend espera el campo 'image')
    formData.append('image', imageFile)
    
    // Agregar los demás campos
    formData.append('objeto', data.objeto)
    if (data.fecha_encontrado) {
      formData.append('fecha_encontrado', data.fecha_encontrado.toString())
    }
    if (data.horario_encontrado) {
      formData.append('horario_encontrado', data.horario_encontrado.toString())
    }
    if (data.aula_id) {
      formData.append('aula_id', String(data.aula_id.toString()))
    }

    try {
      const { data: response } = await api.post<LostObjectResponse>('/lost-objects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        'Error al registrar el objeto perdido'
      )
    }
  },

  getByLaboratoryAndMonth: async (month?: string): Promise<LostObjectItem[]> => {
    try {
      const params: Record<string, string> = {}
      if (month) {
        params.month = month
      }
      const { data } = await api.get<LostObjectItem[]>('/lost-objects/laboratory/by-month', { params })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al obtener los objetos perdidos del laboratorio'
      )
    }
  },

  deliver: async (lostObjectId: string | number, payload: DeliverLostObjectPayload, evidence: File) => {
    const formData = new FormData()
    formData.append('persona_id', payload.persona_id)
    formData.append('image', evidence)
    
    try {
      const { data } = await api.post(`/lost-objects/${lostObjectId}/deliver`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al entregar el objeto perdido'
      )
    }
  },

  moveToPorteriaByDateRange: async (startDate: string, endDate: string) => {
    try {
      const { data } = await api.post('/lost-objects/move-to-porteria', {
        startDate,
        endDate,
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al mover objetos a portería'
      )
    }
  },

  moveAllPerdidosToPorteria: async () => {
    try {
      const { data } = await api.post('/lost-objects/move-all-perdidos-to-porteria')
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'Error al mover objetos a portería'
      )
    }
  },
}

