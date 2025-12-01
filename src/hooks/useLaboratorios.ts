import { useState, useEffect, useCallback } from 'react'
import { laboratorioService, type Laboratorio } from '@/services/laboratorioService'

export function useLaboratorios() {
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLaboratorios = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await laboratorioService.getAll()
      setLaboratorios(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar los laboratorios')
      console.error('Error al cargar laboratorios:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLaboratorios()
  }, [fetchLaboratorios])

  return {
    laboratorios,
    isLoading,
    error,
    refetch: fetchLaboratorios,
  }
}

