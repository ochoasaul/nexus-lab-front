export const CONFIG = {
  appName: 'MaquetaLab',
  apiBaseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5173/api',
  defaultLocale: 'es-ES',
} as const

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  inventory: '/inventory',
  users: '/users',
  reports: '/reports',
  schedules: '/schedules',
  tasks: '/tasks',
} as const

export type RoleKey = 'super_admin' | 'encargado' | 'administrativo' | 'auxiliar'

export const ROLE_DETAILS: Record<
  RoleKey,
  { label: string; description: string; accent: string; capabilities: string[] }
> = {
  super_admin: {
    label: 'Super Administrador',
    description: 'Orquesta todos los laboratorios, crea nuevos espacios y asigna responsables.',
    accent: '#c3002f',
    capabilities: ['Crear laboratorios', 'Asignar encargados', 'Ver información global', 'Definir políticas'],
  },
  encargado: {
    label: 'Encargado',
    description: 'Gestiona un laboratorio específico, su personal y su inventario.',
    accent: '#f04d4d',
    capabilities: ['Asignar usuarios', 'Agregar docentes y alumnos', 'Gestionar horarios'],
  },
  administrativo: {
    label: 'Administrativo',
    description: 'Da seguimiento a reservas, reportes y documentación.',
    accent: '#222222',
    capabilities: ['Actualizar reportes', 'Confirmar reservas', 'Gestionar entregables'],
  },
  auxiliar: {
    label: 'Auxiliar',
    description: 'Apoya en inventarios, préstamos y operación diaria.',
    accent: '#6b6b6b',
    capabilities: ['Registrar préstamos', 'Reportar hallazgos', 'Apoyar al encargado'],
  },
}
