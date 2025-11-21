import type { RoleKey } from '../config'
import { ROLE_DETAILS } from '../config'
import { LABS } from '../mocks/labs'

export type AuthCredentials = {
  email: string
  password: string
  role: RoleKey
}

export type AuthUser = {
  id: string
  name: string
  email: string
  role: RoleKey
  labs: string[]
}

export type AuthSession = {
  user: AuthUser
  token: string
}

const roleUsernames: Record<RoleKey, string> = {
  super_admin: 'Valeria Ortega',
  encargado: 'Daniel Pineda',
  administrativo: 'Carla Reyes',
  auxiliar: 'Mario Luján',
}

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random()}`
}

const labsByRole = (role: RoleKey): string[] => {
  // Super admin can access all labs
  if (role === 'super_admin') return LABS.map((lab) => lab.id)

  // Encargado: assign a single lab where they have management permissions (first match)
  if (role === 'encargado') {
    const lab = LABS.find((lab) => lab.permissions.canAssignUsers) ?? LABS[0]
    return [lab.id]
  }

  // Administrativo: assign a single lab that has active reservations (first match) — fallback to first lab
  if (role === 'administrativo') {
    const lab = LABS.find((lab) => lab.reservations.length > 0) ?? LABS[0]
    return [lab.id]
  }

  // Auxiliar and others: assign a single lab (for the mock, use the first lab)
  return [LABS[0].id]
}

export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const user: AuthUser = {
    id: createId(),
    name: roleUsernames[credentials.role],
    email: credentials.email,
    role: credentials.role,
    labs: labsByRole(credentials.role),
  }

  const token = `${credentials.role}-${createId()}`

  console.info('Sesión simulada para', ROLE_DETAILS[credentials.role].label)

  return { user, token }
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200))
}

export async function getProfile(): Promise<AuthUser> {
  throw new Error('Perfil no disponible en la maqueta')
}
