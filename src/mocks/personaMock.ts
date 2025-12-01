import type { Persona } from '@/services/personaService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para personas
let mockPersonas: Persona[] = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    carnet: '1234567',
  },
  {
    id: 2,
    nombre: 'Ana',
    apellido: 'Martínez',
    carnet: '2345678',
  },
  {
    id: 3,
    nombre: 'Juan',
    apellido: 'Pérez',
    carnet: '3456789',
  },
  {
    id: 4,
    nombre: 'María',
    apellido: 'García',
    carnet: '4567890',
  },
  {
    id: 5,
    nombre: 'Pedro',
    apellido: 'López',
    carnet: '5678901',
  },
  {
    id: 6,
    nombre: 'Laura',
    apellido: 'Sánchez',
    carnet: '6789012',
  },
  {
    id: 7,
    nombre: 'Roberto',
    apellido: 'Fernández',
    carnet: null,
  },
  {
    id: 8,
    nombre: 'Carmen',
    apellido: 'Torres',
    carnet: '7890123',
  },
]

export const personaMockService = {
  getAll: (): Persona[] => {
    return [...mockPersonas]
  },

  search: async (query: string): Promise<Persona[]> => {
    await delay(300)
    if (!query || !query.trim()) {
      return []
    }
    
    const searchTerm = query.toLowerCase().trim()
    return mockPersonas.filter(
      persona =>
        persona.nombre.toLowerCase().includes(searchTerm) ||
        persona.apellido.toLowerCase().includes(searchTerm) ||
        (persona.carnet && persona.carnet.toLowerCase().includes(searchTerm))
    )
  },
}

