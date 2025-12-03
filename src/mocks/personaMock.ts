import type { Person } from '@/services/personService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para personas
let mockPersonas: Person[] = [
  {
    id: 1,
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    identity_card: '1234567',
  },
  {
    id: 2,
    first_name: 'Ana',
    last_name: 'Martínez',
    identity_card: '2345678',
  },
  {
    id: 3,
    first_name: 'Juan',
    last_name: 'Pérez',
    identity_card: '3456789',
  },
  {
    id: 4,
    first_name: 'María',
    last_name: 'García',
    identity_card: '4567890',
  },
  {
    id: 5,
    first_name: 'Pedro',
    last_name: 'López',
    identity_card: '5678901',
  },
  {
    id: 6,
    first_name: 'Laura',
    last_name: 'Sánchez',
    identity_card: '6789012',
  },
  {
    id: 7,
    first_name: 'Roberto',
    last_name: 'Fernández',
    identity_card: null,
  },
  {
    id: 8,
    first_name: 'Carmen',
    last_name: 'Torres',
    identity_card: '7890123',
  },
]

export const personaMockService = {
  getAll: (): Person[] => {
    return [...mockPersonas]
  },

  search: async (query: string): Promise<Person[]> => {
    await delay(300)
    if (!query || !query.trim()) {
      return []
    }

    const searchTerm = query.toLowerCase().trim()
    return mockPersonas.filter(
      person =>
        person.first_name.toLowerCase().includes(searchTerm) ||
        person.last_name.toLowerCase().includes(searchTerm) ||
        (person.identity_card && person.identity_card.toLowerCase().includes(searchTerm))
    )
  },
}

