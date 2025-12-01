import type { TeacherItem } from '@/services/teacherService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para docente
let mockTeachers: TeacherItem[] = [
  {
    id: 1,
    estado: 'activo',
    persona_id: 1,
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2025-01-10T08:00:00Z',
    persona: {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      carnet: '1234567',
    },
  },
  {
    id: 2,
    estado: 'activo',
    persona_id: 2,
    created_at: '2025-01-11T09:00:00Z',
    updated_at: '2025-01-11T09:00:00Z',
    persona: {
      id: 2,
      nombre: 'María',
      apellido: 'García',
      carnet: '2345678',
    },
  },
  {
    id: 3,
    estado: 'inactivo',
    persona_id: 3,
    created_at: '2025-01-12T10:00:00Z',
    updated_at: '2025-01-12T10:00:00Z',
    persona: {
      id: 3,
      nombre: 'Carlos',
      apellido: 'López',
      carnet: '3456789',
    },
  },
  {
    id: 4,
    estado: 'activo',
    persona_id: 4,
    created_at: '2025-01-13T11:00:00Z',
    updated_at: '2025-01-13T11:00:00Z',
    persona: {
      id: 4,
      nombre: 'Ana',
      apellido: 'Martínez',
      carnet: '4567890',
    },
  },
  {
    id: 5,
    estado: 'activo',
    persona_id: 5,
    created_at: '2025-01-14T12:00:00Z',
    updated_at: '2025-01-14T12:00:00Z',
    persona: {
      id: 5,
      nombre: 'Pedro',
      apellido: 'Rodríguez',
      carnet: null,
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
    // Buscar la persona en el mock de personas si existe
    const personaId = data.persona_id ? Number(data.persona_id) : null
    let personaInfo = null
    
    if (personaId) {
      // Obtener información de la persona desde el mock
      const { personaMockService } = await import('./personaMock')
      const personas = personaMockService.getAll()
      const foundPersona = personas.find(p => p.id === personaId)
      if (foundPersona) {
        personaInfo = {
          id: foundPersona.id,
          nombre: foundPersona.nombre,
          apellido: foundPersona.apellido,
          carnet: foundPersona.carnet || null,
        }
      } else {
        // Si no se encuentra, usar valores por defecto
        personaInfo = {
          id: personaId,
          nombre: 'Persona',
          apellido: 'Registrada',
          carnet: null,
        }
      }
    }
    
    const newItem: TeacherItem = {
      id: nextId++,
      estado: data.estado || 'activo',
      persona_id: personaId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      persona: personaInfo,
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

