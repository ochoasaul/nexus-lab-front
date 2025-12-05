import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { useUserStore } from '@/store/userStore'
import { authService } from '@/services/authService'
import { ToastContainer } from '@/components/feedback/Toast'

function App() {
  const { setProfile, setLoading } = useUserStore()

  useEffect(() => {
    // Obtener el perfil desde el backend si hay un token válido
    const loadUserProfile = async () => {
      setLoading(true)
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setProfile(user)
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [setProfile, setLoading])

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}

export default App
