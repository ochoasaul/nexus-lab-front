import { useState, useEffect, useCallback } from 'react'
import { lostObjectService, type LostObjectItem } from '@/services/lostObjectService'

export function useLostObjects(month?: string) {
  const [lostObjects, setLostObjects] = useState<LostObjectItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLostObjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await lostObjectService.getByLaboratoryAndMonth(month)
      setLostObjects(data)
    } catch (err: any) {
      setError(err.message || 'Error loading lost objects')
    } finally {
      setIsLoading(false)
    }
  }, [month])

  useEffect(() => {
    fetchLostObjects()
  }, [fetchLostObjects])

  const deliverLostObject = useCallback(async (id: string | number, data: { person_id: string; evidence: File }) => {
    try {
      await lostObjectService.deliver(id, { person_id: data.person_id }, data.evidence)
      await fetchLostObjects()
    } catch (err: any) {
      throw new Error(err.message || 'Error delivering lost object')
    }
  }, [fetchLostObjects])

  const moveAllLostToReception = useCallback(async () => {
    try {
      await lostObjectService.moveAllLostToReception()
      await fetchLostObjects()
    } catch (err: any) {
      throw new Error(err.message || 'Error moving objects to reception')
    }
  }, [fetchLostObjects])

  return {
    lostObjects,
    isLoading,
    error,
    refetch: fetchLostObjects,
    deliverLostObject,
    moveAllLostToReception
  }
}
