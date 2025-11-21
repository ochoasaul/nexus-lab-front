import { create } from 'zustand'
import type { User } from '../services/userService'

type UserState = {
  profile: User | null
  setProfile: (profile: User) => void
  clearProfile: () => void
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}))
