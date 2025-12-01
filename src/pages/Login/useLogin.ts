// pages/Login/useLogin.ts
import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config'

interface LoginValues {
  usuario: string
  clave: string
}

export function useLogin() {
  const navigate = useNavigate()
  
  const [values, setValues] = useState<LoginValues>({
    usuario: '',
    clave: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setProfile } = useUserStore()
  const { login } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({
      ...prev,
      [name]: value
    }))
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      console.log('🔐 Intentando login con:', values.usuario)
      const response = await login(values)

      console.log('✅ Login exitoso:', response.user)

      setProfile(response.user)

      setTimeout(() => {
        navigate(ROUTES.dashboard, { replace: true })
      }, 100)
      
    } catch (err: any) {
      console.error('❌ Error en login:', err)
      setError(err.message || 'Credenciales incorrectas.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    values,
    handleChange,
    handleSubmit,
    error,
    isSubmitting
  }
}
