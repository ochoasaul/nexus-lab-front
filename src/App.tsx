import { useEffect } from 'react'
import { AppRouter } from './routes/AppRouter'
import { useUserStore } from './store/userStore'
import { authService } from './services/authService'

function App() {
  const { setProfile } = useUserStore()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setProfile(user as any)
      console.log('👤 Usuario cargado:', user)
    }
  }, [setProfile])

  return <AppRouter />
}

export default App
