import type { SoporteMateriaItem, SoporteTecnicoItem } from '@/services/soporteService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para soporte_materia
let mockSoporteMateria: SoporteMateriaItem[] = [
  {
    id: 1,
    fecha_hora: '2025-01-15T10:30:00Z',
    solucion: 'Se actualizó el software de la computadora',
    problema: 'La computadora no inicia correctamente',
    tipo: 'materia',
    created_at: '2025-01-15T10:30:00Z',
    laboratorio: {
      id: 1,
      nombre: 'Laboratorio de Informática',
    },
    usuario: {
      id: 1,
      name: 'Juan Pérez',
    },
  },
  {
    id: 2,
    fecha_hora: '2025-01-16T14:20:00Z',
    solucion: null,
    problema: 'Proyector no funciona',
    tipo: 'materia',
    created_at: '2025-01-16T14:20:00Z',
    laboratorio: {
      id: 1,
      nombre: 'Laboratorio de Informática',
    },
    usuario: {
      id: 2,
      name: 'María García',
    },
  },
  {
    id: 3,
    fecha_hora: '2025-01-17T09:15:00Z',
    solucion: 'Se reemplazó el cable de red',
    problema: 'Sin conexión a internet',
    tipo: 'materia',
    created_at: '2025-01-17T09:15:00Z',
    laboratorio: {
      id: 2,
      nombre: 'Laboratorio de Química',
    },
    usuario: {
      id: 1,
      name: 'Juan Pérez',
    },
  },
]

// Datos mock iniciales para soporte_tecnico
let mockSoporteTecnico: SoporteTecnicoItem[] = [
  {
    id: 1,
    fecha_hora: '2025-01-14T08:00:00Z',
    solucion: 'Se configuró el acceso a la base de datos',
    problema: 'No puedo acceder a la base de datos del sistema',
    tipo: 'tecnico',
    created_at: '2025-01-14T08:00:00Z',
    laboratorio: {
      id: 1,
      nombre: 'Laboratorio de Informática',
    },
    usuario: {
      id: 1,
      name: 'Juan Pérez',
    },
    persona: {
      id: 1,
      nombre: 'Carlos',
      apellido: 'Rodríguez',
    },
  },
  {
    id: 2,
    fecha_hora: '2025-01-15T11:45:00Z',
    solucion: null,
    problema: 'Necesito ayuda con la instalación de software especializado',
    tipo: 'tecnico',
    created_at: '2025-01-15T11:45:00Z',
    laboratorio: {
      id: 2,
      nombre: 'Laboratorio de Química',
    },
    usuario: {
      id: 2,
      name: 'María García',
    },
    persona: {
      id: 2,
      nombre: 'Ana',
      apellido: 'Martínez',
    },
  },
]

let nextMateriaId = 4
let nextTecnicoId = 3

export const soporteMockService = {
  // Soporte Materia
  getAllMateria: async (): Promise<SoporteMateriaItem[]> => {
    await delay(500)
    return [...mockSoporteMateria]
  },

  createMateria: async (data: any): Promise<SoporteMateriaItem> => {
    await delay(800)
    const newItem: SoporteMateriaItem = {
      id: nextMateriaId++,
      fecha_hora: data.fecha_hora || new Date().toISOString(),
      solucion: data.solucion || null,
      problema: data.problema,
      tipo: 'materia',
      created_at: new Date().toISOString(),
      laboratorio: {
        id: 1,
        nombre: 'Laboratorio de Informática',
      },
      usuario: {
        id: 1,
        name: 'Usuario Actual',
      },
    }
    mockSoporteMateria.push(newItem)
    return newItem
  },

  updateMateria: async (id: string | number, data: any): Promise<SoporteMateriaItem> => {
    await delay(600)
    const index = mockSoporteMateria.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Soporte de materia no encontrado')
    }
    const updated: SoporteMateriaItem = {
      ...mockSoporteMateria[index],
      ...data,
      id: mockSoporteMateria[index].id,
      tipo: 'materia',
    }
    mockSoporteMateria[index] = updated
    return updated
  },

  removeMateria: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockSoporteMateria.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Soporte de materia no encontrado')
    }
    mockSoporteMateria.splice(index, 1)
  },

  // Soporte Técnico
  getAllTecnico: async (): Promise<SoporteTecnicoItem[]> => {
    await delay(500)
    return [...mockSoporteTecnico]
  },

  createTecnico: async (data: any): Promise<SoporteTecnicoItem> => {
    await delay(800)
    // Buscar la persona en el mock de personas si existe
    const personaId = data.persona_solicitante_id ? Number(data.persona_solicitante_id) : null
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
        }
      } else {
        // Si no se encuentra, usar valores por defecto
        personaInfo = {
          id: personaId,
          nombre: 'Persona',
          apellido: 'Solicitante',
        }
      }
    }
    
    const newItem: SoporteTecnicoItem = {
      id: nextTecnicoId++,
      fecha_hora: data.fecha_hora || new Date().toISOString(),
      solucion: data.solucion || null,
      problema: data.problema,
      tipo: 'tecnico',
      created_at: new Date().toISOString(),
      laboratorio: {
        id: 1,
        nombre: 'Laboratorio de Informática',
      },
      usuario: {
        id: 1,
        name: 'Usuario Actual',
      },
      persona: personaInfo,
    }
    mockSoporteTecnico.push(newItem)
    return newItem
  },

  updateTecnico: async (id: string | number, data: any): Promise<SoporteTecnicoItem> => {
    await delay(600)
    const index = mockSoporteTecnico.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Soporte técnico no encontrado')
    }
    const updated: SoporteTecnicoItem = {
      ...mockSoporteTecnico[index],
      ...data,
      id: mockSoporteTecnico[index].id,
      tipo: 'tecnico',
    }
    mockSoporteTecnico[index] = updated
    return updated
  },

  removeTecnico: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockSoporteTecnico.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Soporte técnico no encontrado')
    }
    mockSoporteTecnico.splice(index, 1)
  },
}

