// hooks/useAuth.ts
import { useCallback } from 'react'
import { authService, type LoginCredentials, type AuthUser } from '@/services/authService'
import { useUserStore } from '@/store/userStore'

export function useAuth() {
  const profile = useUserStore((state) => state.profile)
  const setProfile = useUserStore((state) => state.setProfile)
  const clearProfile = useUserStore((state) => state.clearProfile)

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    setProfile(response.user)
    return response
  }, [setProfile])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearProfile()
      window.location.href = '/login'
    }
  }, [clearProfile])

  const token = authService.getToken()
  const isLoading = useUserStore((state) => state.isLoading)
  const isAuthenticated = authService.isAuthenticated() && profile !== null

  return {
    isAuthenticated,
    isLoading,
    user: profile,
    token,
    login,
    logout,
  }
}
