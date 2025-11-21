import { useCallback } from 'react'
import type { AuthCredentials } from '../services/authService'
import * as authService from '../services/authService'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, token, isAuthenticated, setAuthState, clearAuthState } = useAuthStore()

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      const session = await authService.login(credentials)
      setAuthState({ user: session.user, token: session.token })
    },
    [setAuthState],
  )

  const logout = useCallback(async () => {
    await authService.logout()
    clearAuthState()
  }, [clearAuthState])

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  } as const
}
