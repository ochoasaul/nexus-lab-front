import { useState, useEffect } from 'react'
import api from '@/services/api'

export interface Career {
    id: number
    name: string
    faculty_id?: number
}

export function useCareers(facultyId?: number | string) {
    const [careers, setCareers] = useState<Career[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchCareers = async () => {
            setIsLoading(true)
            try {
                const params = facultyId ? { faculty_id: facultyId } : {}
                const response = await api.get('/career', { params })
                setCareers(response.data)
            } catch (error) {
                console.error('Error fetching careers:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCareers()
    }, [facultyId])

    return { careers, isLoading }
}
