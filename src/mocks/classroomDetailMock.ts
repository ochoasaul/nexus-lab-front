import type { ClassroomDetailItem } from '@/services/classroomDetailService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para detalle_aula
let mockClassroomDetails: ClassroomDetailItem[] = [
  {
    id: 1,
    aula_id: 1,
    capacidad_alumnos: 30,
    num_computadoras: 25,
    proyector_instalado: true,
    aire_acondicionado: true,
    aula: {
      id: 1,
      nombre: 'Aula 101',
    },
  },
  {
    id: 2,
    aula_id: 2,
    capacidad_alumnos: 40,
    num_computadoras: 35,
    proyector_instalado: true,
    aire_acondicionado: false,
    aula: {
      id: 2,
      nombre: 'Aula 102',
    },
  },
  {
    id: 3,
    aula_id: 3,
    capacidad_alumnos: 25,
    num_computadoras: 20,
    proyector_instalado: false,
    aire_acondicionado: true,
    aula: {
      id: 3,
      nombre: 'Aula 201',
    },
  },
  {
    id: 4,
    aula_id: 4,
    capacidad_alumnos: 50,
    num_computadoras: 45,
    proyector_instalado: true,
    aire_acondicionado: true,
    aula: {
      id: 4,
      nombre: 'Aula 301',
    },
  },
]

let nextId = 5

export const classroomDetailMockService = {
  getAll: async (): Promise<ClassroomDetailItem[]> => {
    await delay(500)
    return [...mockClassroomDetails]
  },

  getById: async (id: string | number): Promise<ClassroomDetailItem> => {
    await delay(300)
    const item = mockClassroomDetails.find(c => String(c.id) === String(id))
    if (!item) {
      throw new Error('Detalle de aula no encontrado')
    }
    return item
  },

  create: async (data: any): Promise<ClassroomDetailItem> => {
    await delay(800)
    const newItem: ClassroomDetailItem = {
      id: nextId++,
      aula_id: data.aula_id || null,
      capacidad_alumnos: data.capacidad_alumnos,
      num_computadoras: data.num_computadoras || null,
      proyector_instalado: data.proyector_instalado ?? false,
      aire_acondicionado: data.aire_acondicionado ?? false,
      aula: data.aula_id
        ? {
            id: Number(data.aula_id),
            nombre: `Aula ${data.aula_id}`,
          }
        : null,
    }
    mockClassroomDetails.push(newItem)
    return newItem
  },

  update: async (id: string | number, data: any): Promise<ClassroomDetailItem> => {
    await delay(600)
    const index = mockClassroomDetails.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Detalle de aula no encontrado')
    }
    const updated: ClassroomDetailItem = {
      ...mockClassroomDetails[index],
      ...data,
      id: mockClassroomDetails[index].id,
    }
    mockClassroomDetails[index] = updated
    return updated
  },

  remove: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockClassroomDetails.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Detalle de aula no encontrado')
    }
    mockClassroomDetails.splice(index, 1)
  },
}

