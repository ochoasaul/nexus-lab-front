import { useState, useEffect, useCallback } from 'react'
import { classroomService } from '@/services/classroomService'

export function useClassroomSchedule(classroomId: number, isOpen: boolean) {
    const [activeTab, setActiveTab] = useState<'classes' | 'reservations'>('classes')
    const [schedule, setSchedule] = useState<{ assignments: any[], reservations: any[] } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchSchedule = useCallback(async () => {
        if (!classroomId) return
        setIsLoading(true)
        try {
            const data = await classroomService.getSchedule(classroomId)
            setSchedule(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [classroomId])

    useEffect(() => {
        if (isOpen && classroomId) {
            fetchSchedule()
        }
    }, [isOpen, classroomId, fetchSchedule])

    return {
        activeTab,
        setActiveTab,
        schedule,
        isLoading,
        refreshSchedule: fetchSchedule
    }
}
