import type { ClassroomDetailItem } from '@/services/classroomDetailService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para detalle_aula
let mockClassroomDetails: ClassroomDetailItem[] = [
  {
    id: 1,
    classroom_id: 1,
    student_capacity: 30,
    computer_count: 25,
    projector_installed: true,
    air_conditioning: true,
    classroom: {
      id: 1,
      name: 'Aula 101',
    },
  },
  {
    id: 2,
    classroom_id: 2,
    student_capacity: 40,
    computer_count: 35,
    projector_installed: true,
    air_conditioning: false,
    classroom: {
      id: 2,
      name: 'Aula 102',
    },
  },
  {
    id: 3,
    classroom_id: 3,
    student_capacity: 25,
    computer_count: 20,
    projector_installed: false,
    air_conditioning: true,
    classroom: {
      id: 3,
      name: 'Aula 201',
    },
  },
  {
    id: 4,
    classroom_id: 4,
    student_capacity: 50,
    computer_count: 45,
    projector_installed: true,
    air_conditioning: true,
    classroom: {
      id: 4,
      name: 'Aula 301',
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
      classroom_id: data.classroom_id || null,
      student_capacity: data.student_capacity,
      computer_count: data.computer_count || null,
      projector_installed: data.projector_installed ?? false,
      air_conditioning: data.air_conditioning ?? false,
      classroom: data.classroom_id
        ? {
          id: Number(data.classroom_id),
          name: `Aula ${data.classroom_id}`,
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

