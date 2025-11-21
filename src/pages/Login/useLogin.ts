import type { FormEvent } from 'react'
import { useState } from 'react'
import { ROLE_DETAILS, type RoleKey } from '../../config'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'

type LoginFormValues = {
  email: string
  password: string
  role: RoleKey
}

const firstRole = Object.keys(ROLE_DETAILS)[0] as RoleKey

export function useLogin() {
  const { login, isAuthenticated } = useAuth()
  const { values, handleChange, reset } = useForm<LoginFormValues>({
    email: 'demo@maquetalab.dev',
    password: '123456',
    role: firstRole,
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login(values)
      reset()
    } catch (submissionError) {
      setError('No pudimos iniciar sesión. Intenta nuevamente más tarde.')
      console.error(submissionError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleOptions = (Object.entries(ROLE_DETAILS) as [RoleKey, (typeof ROLE_DETAILS)[RoleKey]][]).map(
    ([key, role]) => ({ value: key, label: role.label, description: role.description }),
  )

  return {
    values,
    handleChange,
    handleSubmit,
    error,
    isAuthenticated,
    isSubmitting,
    roleOptions,
  }
}
