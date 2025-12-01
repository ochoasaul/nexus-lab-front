import { useState, useEffect, useCallback } from 'react'
import { aulaService, type Aula } from '@/services/aulaService'

export function useAulas() {
  const [aulas, setAulas] = useState<Aula[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAulas = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await aulaService.getAll()
      setAulas(data)
    } catch (err: any) {
      setError(err.message || 'Error al cargar las aulas')
      console.error('Error al cargar aulas:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAulas()
  }, [fetchAulas])

  return {
    aulas,
    isLoading,
    error,
    refetch: fetchAulas,
  }
}

