import type { ReservationItem } from '@/services/reservationService'

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Datos mock iniciales para eventos
let mockReservations: ReservationItem[] = [
  {
    id: 1,
    subject: 'Conferencia de Tecnología',
    dates: '2025-02-15',
    start_time: '09:00',
    end_time: '12:00',
    classrooms: [
      { id: 1, name: 'Aula 101' },
      { id: 2, name: 'Aula 102' },
    ],
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 2,
    subject: 'Taller de Programación',
    dates: '2025-02-20',
    start_time: '14:00',
    end_time: '17:00',
    classrooms: [
      { id: 3, name: 'Aula 201' },
    ],
    created_at: '2025-01-12T14:30:00Z',
    updated_at: '2025-01-12T14:30:00Z',
  },
  {
    id: 3,
    subject: 'Seminario de Investigación',
    dates: '2025-03-01',
    start_time: '10:00',
    end_time: '13:00',
    classrooms: [
      { id: 1, name: 'Aula 101' },
      { id: 4, name: 'Aula 301' },
    ],
    created_at: '2025-01-15T09:00:00Z',
    updated_at: '2025-01-15T09:00:00Z',
  },
  {
    id: 4,
    subject: 'Exposición de Proyectos',
    dates: '2025-03-10',
    start_time: '08:00',
    end_time: '18:00',
    classrooms: [
      { id: 2, name: 'Aula 102' },
      { id: 3, name: 'Aula 201' },
      { id: 4, name: 'Aula 301' },
    ],
    created_at: '2025-01-18T11:00:00Z',
    updated_at: '2025-01-18T11:00:00Z',
  },
]

let nextId = 5

export const reservationMockService = {
  getAll: async (): Promise<ReservationItem[]> => {
    await delay(500)
    return [...mockReservations]
  },

  getById: async (id: string | number): Promise<ReservationItem> => {
    await delay(300)
    const item = mockReservations.find(e => String(e.id) === String(id))
    if (!item) {
      throw new Error('Reservation not found')
    }
    return item
  },

  create: async (data: any): Promise<ReservationItem> => {
    await delay(800)
    const newItem: ReservationItem = {
      id: nextId++,
      subject: data.subject,
      dates: data.dates,
      start_time: data.start_time,
      end_time: data.end_time,
      classrooms: data.classroom_ids
        ? data.classroom_ids.map((id: string | number) => ({
          id: Number(id),
          name: `Classroom ${id}`,
        }))
        : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockReservations.push(newItem)
    return newItem
  },

  update: async (id: string | number, data: any): Promise<ReservationItem> => {
    await delay(600)
    const index = mockReservations.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Reservation not found')
    }
    const updated: ReservationItem = {
      ...mockReservations[index],
      ...data,
      id: mockReservations[index].id,
      classrooms: data.classroom_ids
        ? data.classroom_ids.map((aid: string | number) => ({
          id: Number(aid),
          name: `Classroom ${aid}`,
        }))
        : mockReservations[index].classrooms,
      updated_at: new Date().toISOString(),
    }
    mockReservations[index] = updated
    return updated
  },

  remove: async (id: string | number): Promise<void> => {
    await delay(400)
    const index = mockReservations.findIndex(item => String(item.id) === String(id))
    if (index === -1) {
      throw new Error('Reservation not found')
    }
    mockReservations.splice(index, 1)
  },
}

