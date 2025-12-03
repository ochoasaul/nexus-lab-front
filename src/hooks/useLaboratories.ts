import { useState, useEffect, useCallback } from 'react'
import { laboratoryService, type Laboratory } from '@/services/laboratoryService'

export function useLaboratories() {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLaboratories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await laboratoryService.getAll()
      setLaboratories(data)
    } catch (err: any) {
      setError(err.message || 'Error loading laboratories')
      console.error('Error loading laboratories:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLaboratories()
  }, [fetchLaboratories])

  return {
    laboratories,
    isLoading,
    error,
    refetch: fetchLaboratories,
  }
}

