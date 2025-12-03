import { create } from 'zustand'
import type { AuthUser } from '@/services/authService'

export type User = AuthUser

type UserState = {
  profile: User | null
  isLoading: boolean
  setProfile: (profile: User) => void
  setLoading: (isLoading: boolean) => void
  clearProfile: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  clearProfile: () => set({ profile: null }),
}))
