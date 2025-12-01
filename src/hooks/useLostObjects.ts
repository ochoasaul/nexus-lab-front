import { useEffect, useCallback } from 'react'
import { lostObjectService } from '@/services/lostObjectService'
import { useLostObjectsStore } from '@/store/lostObjectsStore'

export function useLostObjects(month?: string) {
  const { 
    lostObjects, 
    setLostObjects, 
    isLoading: storeIsLoading, 
    error: storeError,
    setLoading,
    setError,
    clearError
  } = useLostObjectsStore()

  const fetchLostObjects = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const data = await lostObjectService.getByLaboratoryAndMonth(month)
      setLostObjects(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar los objetos perdidos'
      setError(errorMessage)
      console.error('Error al cargar objetos perdidos:', err)
    } finally {
      setLoading(false)
    }
  }, [month, setLostObjects, setLoading, setError, clearError])

  useEffect(() => {
    fetchLostObjects()
  }, [fetchLostObjects])

  return {
    lostObjects,
    isLoading: storeIsLoading,
    error: storeError,
    refetch: fetchLostObjects,
  }
}
