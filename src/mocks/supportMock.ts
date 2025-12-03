import type { SupportSubjectItem, SupportTechnicalItem } from '@/services/supportService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para soporte_materia
let mockSupportSubject: SupportSubjectItem[] = [
  {
    id: 1,
    date_time: '2025-01-15T10:30:00Z',
    solution: 'Se actualizó el software de la computadora',
    problem: 'La computadora no inicia correctamente',
    created_at: '2025-01-15T10:30:00Z',
    laboratory: {
      id: 1,
      name: 'Laboratorio de Informática',
    },
    user: {
      id: 1,
      username: 'Juan Pérez',
    },
  },
  {
    id: 2,
    date_time: '2025-01-16T14:20:00Z',
    solution: null,
    problem: 'Proyector no funciona',
    created_at: '2025-01-16T14:20:00Z',
    laboratory: {
      id: 1,
      name: 'Laboratorio de Informática',
    },
    user: {
      id: 2,
      username: 'María García',
    },
  },
  {
    id: 3,
    date_time: '2025-01-17T09:15:00Z',
    solution: 'Se reemplazó el cable de red',
    problem: 'Sin conexión a internet',
    created_at: '2025-01-17T09:15:00Z',
    laboratory: {
      id: 2,
      name: 'Laboratorio de Química',
    },
    user: {
      id: 1,
      username: 'Juan Pérez',
    },
  },
]

// Datos mock iniciales para soporte_tecnico
let mockSupportTechnical: SupportTechnicalItem[] = [
  {
    id: 1,
    date_time: '2025-01-14T08:00:00Z',
    solution: 'Se configuró el acceso a la base de datos',
    problem: 'No puedo acceder a la base de datos del sistema',
    created_at: '2025-01-14T08:00:00Z',
    laboratory: {
      id: 1,
      name: 'Laboratorio de Informática',
    },
    user: {
      id: 1,
      username: 'Juan Pérez',
    },
    person: {
      id: 1,
      first_name: 'Carlos',
      last_name: 'Rodríguez',
    },
  },
  {
    id: 2,
    date_time: '2025-01-15T11:45:00Z',
    solution: null,
    problem: 'Necesito ayuda con la instalación de software especializado',
    created_at: '2025-01-15T11:45:00Z',
    laboratory: {
      id: 2,
      name: 'Laboratorio de Química',
    },
    user: {
      id: 2,
      username: 'María García',
    },
    person: {
      id: 2,
      first_name: 'Ana',
      last_name: 'Martínez',
    },
  },
]

let nextSubjectId = 4
let nextTechnicalId = 3

export const supportMockService = {
  // Support Subject
  getAllSubject: async (): Promise<SupportSubjectItem[]> => {
    await delay(500)
    return [...mockSupportSubject]
  },

  createSubject: async (data: any): Promise<SupportSubjectItem> => {
    await delay(800)
    const newItem: SupportSubjectItem = {
      id: nextSubjectId++,
      date_time: data.date_time || new Date().toISOString(),
      solution: data.solution || null,
      problem: data.problem,
      created_at: new Date().toISOString(),
      laboratory: {
        id: 1,
        name: 'Laboratorio de Informática',
      },
      user: {
        id: 1,
        username: 'Usuario Actual',
      },
    }
    mockSupportSubject.push(newItem)
    return newItem
  },

  updateSubject: async (id: string | number, data: any): Promise<SupportSubjectItem> => {
    await delay(600)
    const index = mockSupportSubject.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Subject support not found')
    }
    const updated: SupportSubjectItem = {
      ...mockSupportSubject[index],
      ...data,
      id: mockSupportSubject[index].id,
    }
    mockSupportSubject[index] = updated
    return updated
  },

  removeSubject: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockSupportSubject.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Subject support not found')
    }
    mockSupportSubject.splice(index, 1)
  },

  // Support Technical
  getAllTechnical: async (): Promise<SupportTechnicalItem[]> => {
    await delay(500)
    return [...mockSupportTechnical]
  },

  createTechnical: async (data: any): Promise<SupportTechnicalItem> => {
    await delay(800)
    // Find person in mock if exists
    const personId = data.requester_person_id ? Number(data.requester_person_id) : null
    let personInfo = null

    if (personId) {
      // Get person info from mock
      const { personaMockService } = await import('./personaMock')
      const persons = personaMockService.getAll()
      const foundPerson = persons.find(p => p.id === personId)
      if (foundPerson) {
        personInfo = {
          id: foundPerson.id,
          first_name: foundPerson.first_name,
          last_name: foundPerson.last_name,
        }
      } else {
        // If not found, use default values
        personInfo = {
          id: personId,
          first_name: 'Person',
          last_name: 'Requester',
        }
      }
    }

    const newItem: SupportTechnicalItem = {
      id: nextTechnicalId++,
      date_time: data.date_time || new Date().toISOString(),
      solution: data.solution || null,
      problem: data.problem,
      created_at: new Date().toISOString(),
      laboratory: {
        id: 1,
        name: 'Laboratorio de Informática',
      },
      user: {
        id: 1,
        username: 'Usuario Actual',
      },
      person: personInfo,
    }
    mockSupportTechnical.push(newItem)
    return newItem
  },

  updateTechnical: async (id: string | number, data: any): Promise<SupportTechnicalItem> => {
    await delay(600)
    const index = mockSupportTechnical.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Technical support not found')
    }
    const updated: SupportTechnicalItem = {
      ...mockSupportTechnical[index],
      ...data,
      id: mockSupportTechnical[index].id,
    }
    mockSupportTechnical[index] = updated
    return updated
  },

  removeTechnical: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockSupportTechnical.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Technical support not found')
    }
    mockSupportTechnical.splice(index, 1)
  },
}

