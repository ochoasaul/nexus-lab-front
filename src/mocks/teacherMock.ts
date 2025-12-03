import type { TeacherItem } from '@/services/teacherService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para docente
let mockTeachers: TeacherItem[] = [
  {
    id: 1,
    state: 'active',
    person_id: 1,
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2025-01-10T08:00:00Z',
    person: {
      id: 1,
      first_name: 'Juan',
      last_name: 'Pérez',
      identity_card: '1234567',
    },
  },
  {
    id: 2,
    state: 'active',
    person_id: 2,
    created_at: '2025-01-11T09:00:00Z',
    updated_at: '2025-01-11T09:00:00Z',
    person: {
      id: 2,
      first_name: 'María',
      last_name: 'García',
      identity_card: '2345678',
    },
  },
  {
    id: 3,
    state: 'inactive',
    person_id: 3,
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-01-12T10:00:00Z',
    person: {
      id: 3,
      first_name: 'Carlos',
      last_name: 'López',
      identity_card: '3456789',
    },
  },
  {
    id: 4,
    state: 'active',
    person_id: 4,
    created_at: '2025-01-13T11:00:00Z',
    updated_at: '2025-01-13T11:00:00Z',
    person: {
      id: 4,
      first_name: 'Ana',
      last_name: 'Martínez',
      identity_card: '4567890',
    },
  },
  {
    id: 5,
    state: 'active',
    person_id: 5,
    created_at: '2025-01-14T12:00:00Z',
    updated_at: '2025-01-14T12:00:00Z',
    person: {
      id: 5,
      first_name: 'Pedro',
      last_name: 'Rodríguez',
      identity_card: null,
    },
  },
]

let nextId = 6

export const teacherMockService = {
  getAll: async (): Promise<TeacherItem[]> => {
    await delay(500)
    return [...mockTeachers]
  },

  getById: async (id: string | number): Promise<TeacherItem> => {
    await delay(300)
    const item = mockTeachers.find(t => String(t.id) === String(id))
    if (!item) {
      throw new Error('Docente no encontrado')
    }
    return item
  },

  create: async (data: any): Promise<TeacherItem> => {
    await delay(800)
    // Find person in person mock if exists
    const personId = data.person_id ? Number(data.person_id) : null
    let personInfo = null

    if (personId) {
      // Get person info from mock
      const { personaMockService } = await import('./personaMock')
      const personas = personaMockService.getAll()
      const foundPerson = personas.find(p => p.id === personId)
      if (foundPerson) {
        personInfo = {
          id: foundPerson.id,
          first_name: foundPerson.first_name,
          last_name: foundPerson.last_name,
          identity_card: foundPerson.identity_card || null,
        }
      } else {
        // If not found, use default values
        personInfo = {
          id: personId,
          first_name: 'Person',
          last_name: 'Registered',
          identity_card: null,
        }
      }
    }

    const newItem: TeacherItem = {
      id: nextId++,
      state: data.state || 'active',
      person_id: personId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      person: personInfo,
    }
    mockTeachers.push(newItem)
    return newItem
  },

  update: async (id: string | number, data: any): Promise<TeacherItem> => {
    await delay(600)
    const index = mockTeachers.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Docente no encontrado')
    }
    const updated: TeacherItem = {
      ...mockTeachers[index],
      ...data,
      id: mockTeachers[index].id,
      updated_at: new Date().toISOString(),
    }
    mockTeachers[index] = updated
    return updated
  },

  remove: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockTeachers.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Docente no encontrado')
    }
    mockTeachers.splice(index, 1)
  },
}

