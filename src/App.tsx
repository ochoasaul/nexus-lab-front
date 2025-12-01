import { useEffect } from 'react'
import { AppRouter } from '@/routes/AppRouter'
import { useUserStore } from '@/store/userStore'
import { authService } from '@/services/authService'
import { ToastContainer } from '@/components/feedback/Toast'

function App() {
  const { setProfile } = useUserStore()

  useEffect(() => {
    // Obtener el perfil desde el backend si hay un token válido
    const loadUserProfile = async () => {
      const user = await authService.getCurrentUser()
      if (user) {
        setProfile(user)
        console.log('👤 Usuario cargado desde el servidor:', user)
      }
    }
    
    loadUserProfile()
  }, [setProfile])

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  )
}

export default App
