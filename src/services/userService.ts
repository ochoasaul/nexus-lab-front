import type { AuthUser } from './authService'
import api from './api'

export type User = AuthUser & {
  role?: string
  status?: string
}

export async function getUsers(params: Record<string, unknown> = {}): Promise<User[]> {
  const { data } = await api.get<User[]>('/users', { params })
  return data
}

export async function getUserById(userId: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${userId}`)
  return data
}

export async function updateUser(userId: string, payload: Partial<User>): Promise<User> {
  const { data } = await api.put<User>(`/users/${userId}`, payload)
  return data
}
