import { create } from 'zustand'
import type { AuthUser } from '../services/authService'

type AuthState = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuthState: (payload: { user: AuthUser; token: string }) => void
  clearAuthState: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuthState: ({ user, token }) =>
    set({ user, token, isAuthenticated: Boolean(token && user) }),
  clearAuthState: () => set({ user: null, token: null, isAuthenticated: false }),
}))
