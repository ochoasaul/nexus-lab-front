// hooks/useAuth.ts
import { authService } from '../services/authService'
import { useUserStore } from '../store/userStore'

export function useAuth() {
  const profile = useUserStore((state) => state.profile)
  
  // ✅ Verifica AMBOS: token en localStorage Y usuario en store
  const isAuthenticated = authService.isAuthenticated() && profile !== null

  return {
    isAuthenticated,
    user: profile
  }
}
