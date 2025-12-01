import type { RoleKey } from '@/config'

export type LabInventoryItem = {
  id: string
  name: string
  category: 'hardware' | 'consumible' | 'seguridad'
  quantity: number
  available: number
  status: 'operativo' | 'mantenimiento'
}

export type LabUserRole = RoleKey | 'docente' | 'alumno'

export type LabUser = {
  id: string
  name: string
  role: LabUserRole
  status: 'activo' | 'pendiente'
}

export type LabSchedule = {
  id: string
  subject: string
  teacher: string
  day: string
  timeRange: string
  duration: string
}

export type LabReport = {
  id: string
  type: 'objetos_perdidos' | 'reservas' | 'entradas_docentes' | 'prestamos'
  title: string
  status: 'abierto' | 'en_proceso' | 'cerrado'
  updatedAt: string
  details: string
}

export type LabReservation = {
  id: string
  requester: string
  room: string
  date: string
  status: 'pendiente' | 'aprobada' | 'rechazada'
}

export type LostObject = {
  id: string
  item: string
  reportedBy: string
  date: string
  status: 'pendiente' | 'devuelto'
}

export type LabPermissions = {
  canAssignUsers: boolean
  canCreateAdministrativos: boolean
  canAddSchedules: boolean
  canManageInventory: boolean
}

export type Laboratory = {
  id: string
  name: string
  code: string
  status: 'operativo' | 'mantenimiento'
  location: string
  capacity: number
  lead: string
  tags: string[]
  managerId: string
  permissions: LabPermissions
  inventory: LabInventoryItem[]
  users: LabUser[]
  schedules: LabSchedule[]
  reports: LabReport[]
  reservations: LabReservation[]
  lostObjects: LostObject[]
}

export const LABS: Laboratory[] = [
  {
    id: 'lab-quimica',
    name: 'Laboratorio de Química Aplicada',
    code: 'LAB-Q01',
    status: 'operativo',
    location: 'Torre A · Piso 3',
    capacity: 26,
    lead: 'Ing. Ana López',
    tags: ['Química', 'Biomateriales'],
    managerId: 'encargado-1',
    permissions: {
      canAssignUsers: true,
      canCreateAdministrativos: true,
      canAddSchedules: true,
      canManageInventory: true,
    },
    inventory: [
      { id: 'chem-01', name: 'Campana extractora', category: 'hardware', quantity: 4, available: 3, status: 'operativo' },
      { id: 'chem-02', name: 'Microscopio óptico', category: 'hardware', quantity: 12, available: 10, status: 'operativo' },
      { id: 'chem-03', name: 'Guantes nitrilo', category: 'consumible', quantity: 300, available: 240, status: 'operativo' },
    ],
    users: [
      { id: 'encargado-1', name: 'Ana López', role: 'encargado', status: 'activo' },
      { id: 'adm-1', name: 'Carlos Ortiz', role: 'administrativo', status: 'activo' },
      { id: 'aux-1', name: 'María Pérez', role: 'auxiliar', status: 'activo' },
      { id: 'doc-1', name: 'Dr. Sergio Torres', role: 'docente', status: 'activo' },
      { id: 'alum-1', name: 'Paula Núñez', role: 'alumno', status: 'pendiente' },
    ],
    schedules: [
      { id: 'sched-1', subject: 'Bioquímica I', teacher: 'Dr. Sergio Torres', day: 'Lunes', timeRange: '08:00 - 10:00', duration: '2h' },
      { id: 'sched-2', subject: 'Química Orgánica', teacher: 'Mtra. Irene Díaz', day: 'Miércoles', timeRange: '11:00 - 13:00', duration: '2h' },
    ],
    reports: [
      {
        id: 'rep-1',
        type: 'prestamos',
        title: 'Préstamo de material corrosivo',
        status: 'en_proceso',
        updatedAt: '2024-01-18',
        details: 'Se solicitó autorización especial para ácido perclórico.',
      },
      {
        id: 'rep-2',
        type: 'objetos_perdidos',
        title: 'Llaves del almacén',
        status: 'abierto',
        updatedAt: '2024-01-14',
        details: 'Reportadas por el auxiliar de turno vespertino.',
      },
    ],
    reservations: [
      { id: 'res-1', requester: 'Doc. Camila Ríos', room: 'Q-301', date: '2024-01-21 · 10:00', status: 'aprobada' },
      { id: 'res-2', requester: 'Doc. Álvaro Castañeda', room: 'Q-302', date: '2024-01-23 · 12:00', status: 'pendiente' },
    ],
    lostObjects: [
      { id: 'lost-1', item: 'Tarjeta RFID', reportedBy: 'Paula Núñez', date: '2024-01-16', status: 'devuelto' },
    ],
  },
  {
    id: 'lab-robotica',
    name: 'Laboratorio de Robótica y Automatización',
    code: 'LAB-R02',
    status: 'operativo',
    location: 'Torre B · Piso 1',
    capacity: 32,
    lead: 'Mtro. Daniel Pineda',
    tags: ['Robótica', 'IOT'],
    managerId: 'encargado-2',
    permissions: {
      canAssignUsers: true,
      canCreateAdministrativos: true,
      canAddSchedules: true,
      canManageInventory: true,
    },
    inventory: [
      { id: 'rob-01', name: 'Kit Arduino Pro', category: 'hardware', quantity: 25, available: 18, status: 'operativo' },
      { id: 'rob-02', name: 'Servomotores', category: 'hardware', quantity: 60, available: 54, status: 'operativo' },
      { id: 'rob-03', name: 'Chalecos dieléctricos', category: 'seguridad', quantity: 15, available: 15, status: 'operativo' },
    ],
    users: [
      { id: 'encargado-2', name: 'Daniel Pineda', role: 'encargado', status: 'activo' },
      { id: 'adm-3', name: 'Laura Jiménez', role: 'administrativo', status: 'activo' },
      { id: 'aux-3', name: 'Miguel Silva', role: 'auxiliar', status: 'activo' },
      { id: 'doc-4', name: 'Ing. Sofía Vaca', role: 'docente', status: 'activo' },
    ],
    schedules: [
      { id: 'sched-3', subject: 'Mecatrónica I', teacher: 'Ing. Sofía Vaca', day: 'Martes', timeRange: '09:00 - 12:00', duration: '3h' },
      { id: 'sched-4', subject: 'Robótica Colaborativa', teacher: 'Mtro. Daniel Pineda', day: 'Jueves', timeRange: '15:00 - 18:00', duration: '3h' },
    ],
    reports: [
      {
        id: 'rep-3',
        type: 'reservas',
        title: 'Reserva de aula B-104',
        status: 'cerrado',
        updatedAt: '2024-01-12',
        details: 'Confirmada para club de robótica.',
      },
      {
        id: 'rep-4',
        type: 'entradas_docentes',
        title: 'Registro docentes vespertino',
        status: 'abierto',
        updatedAt: '2024-01-17',
        details: 'Falta confirmar horario actualizado de docentes externos.',
      },
    ],
    reservations: [
      { id: 'res-5', requester: 'Club IOT', room: 'R-104', date: '2024-01-25 · 17:00', status: 'aprobada' },
    ],
    lostObjects: [
      { id: 'lost-2', item: 'Tablet gráfica', reportedBy: 'Miguel Silva', date: '2024-01-11', status: 'pendiente' },
    ],
  },
  {
    id: 'lab-bio',
    name: 'Laboratorio de Bioinnovación',
    code: 'LAB-B05',
    status: 'mantenimiento',
    location: 'Torre C · Piso 2',
    capacity: 20,
    lead: 'Dra. Fernanda Rey',
    tags: ['Biotecnología', 'Ensayos clínicos'],
    managerId: 'encargado-3',
    permissions: {
      canAssignUsers: true,
      canCreateAdministrativos: false,
      canAddSchedules: true,
      canManageInventory: false,
    },
    inventory: [
      { id: 'bio-01', name: 'Incubadora CO₂', category: 'hardware', quantity: 3, available: 2, status: 'mantenimiento' },
      { id: 'bio-02', name: 'Centrífugas', category: 'hardware', quantity: 6, available: 4, status: 'operativo' },
    ],
    users: [
      { id: 'encargado-3', name: 'Fernanda Rey', role: 'encargado', status: 'activo' },
      { id: 'adm-4', name: 'Alberto Vela', role: 'administrativo', status: 'pendiente' },
      { id: 'aux-5', name: 'Lucía Bernal', role: 'auxiliar', status: 'activo' },
      { id: 'alum-4', name: 'Diego Ramos', role: 'alumno', status: 'activo' },
    ],
    schedules: [
      { id: 'sched-5', subject: 'Prácticas de cultivo celular', teacher: 'Dra. Fernanda Rey', day: 'Viernes', timeRange: '07:00 - 11:00', duration: '4h' },
    ],
    reports: [
      {
        id: 'rep-5',
        type: 'prestamos',
        title: 'Préstamo de incubadora portátil',
        status: 'abierto',
        updatedAt: '2024-01-15',
        details: 'Auxiliar solicitó traslado temporal al laboratorio clínico.',
      },
    ],
    reservations: [],
    lostObjects: [],
  },
]
