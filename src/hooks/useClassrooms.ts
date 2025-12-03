import { useState, useEffect, useCallback } from 'react'
import { classroomService, type Classroom } from '@/services/classroomService'

export function useClassrooms() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClassrooms = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await classroomService.getAll()
      setClassrooms(data)
    } catch (err: any) {
      setError(err.message || 'Error loading classrooms')
      console.error('Error loading classrooms:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClassrooms()
  }, [fetchClassrooms])

  return {
    classrooms,
    isLoading,
    error,
    refetch: fetchClassrooms,
  }
}

