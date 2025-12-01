import type { EventItem } from '@/services/eventService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para eventos
let mockEvents: EventItem[] = [
  {
    id: 1,
    nombre: 'Conferencia de Tecnología',
    fecha_evento: '2025-02-15',
    hora_inicio: '09:00',
    hora_fin: '12:00',
    aulas: [
      { id: 1, nombre: 'Aula 101' },
      { id: 2, nombre: 'Aula 102' },
    ],
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 2,
    nombre: 'Taller de Programación',
    fecha_evento: '2025-02-20',
    hora_inicio: '14:00',
    hora_fin: '17:00',
    aulas: [
      { id: 3, nombre: 'Aula 201' },
    ],
    created_at: '2025-01-12T14:30:00Z',
    updated_at: '2025-01-12T14:30:00Z',
  },
  {
    id: 3,
    nombre: 'Seminario de Investigación',
    fecha_evento: '2025-03-01',
    hora_inicio: '10:00',
    hora_fin: '13:00',
    aulas: [
      { id: 1, nombre: 'Aula 101' },
      { id: 4, nombre: 'Aula 301' },
    ],
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-01-15T09:00:00Z',
  },
  {
    id: 4,
    nombre: 'Exposición de Proyectos',
    fecha_evento: '2025-03-10',
    hora_inicio: '08:00',
    hora_fin: '18:00',
    aulas: [
      { id: 2, nombre: 'Aula 102' },
      { id: 3, nombre: 'Aula 201' },
      { id: 4, nombre: 'Aula 301' },
    ],
    created_at: '2025-01-18T11:00:00Z',
    updated_at: '2025-01-18T11:00:00Z',
  },
]

let nextId = 5

export const eventMockService = {
  getAll: async (): Promise<EventItem[]> => {
    await delay(500)
    return [...mockEvents]
  },

  getById: async (id: string | number): Promise<EventItem> => {
    await delay(300)
    const item = mockEvents.find(e => String(e.id) === String(id))
    if (!item) {
      throw new Error('Evento no encontrado')
    }
    return item
  },

  create: async (data: any): Promise<EventItem> => {
    await delay(800)
    const newItem: EventItem = {
      id: nextId++,
      nombre: data.nombre,
      fecha_evento: data.fecha_evento,
      hora_inicio: data.hora_inicio,
      hora_fin: data.hora_fin,
      aulas: data.aula_ids
        ? data.aula_ids.map((id: string | number) => ({
            id: Number(id),
            nombre: `Aula ${id}`,
          }))
        : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockEvents.push(newItem)
    return newItem
  },

  update: async (id: string | number, data: any): Promise<EventItem> => {
    await delay(600)
    const index = mockEvents.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Evento no encontrado')
    }
    const updated: EventItem = {
      ...mockEvents[index],
      ...data,
      id: mockEvents[index].id,
      aulas: data.aula_ids
        ? data.aula_ids.map((aid: string | number) => ({
            id: Number(aid),
            nombre: `Aula ${aid}`,
          }))
        : mockEvents[index].aulas,
      updated_at: new Date().toISOString(),
    }
    mockEvents[index] = updated
    return updated
  },

  remove: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockEvents.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Evento no encontrado')
    }
    mockEvents.splice(index, 1)
  },
}

