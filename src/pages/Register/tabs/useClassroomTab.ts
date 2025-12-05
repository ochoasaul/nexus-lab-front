import { useState, useEffect, useCallback } from 'react'
import { classroomService } from '@/services/classroomService'

export function useClassroomTab() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState<any>(null)
    const [selectedClassroomName, setSelectedClassroomName] = useState('')
    const [selectedClassroomId, setSelectedClassroomId] = useState<number>(0)
    const [classrooms, setClassrooms] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchClassrooms = useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await classroomService.getAllWithStatus()
            setClassrooms(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchClassrooms()
    }, [fetchClassrooms])

    const handleViewDetails = (classroom: any) => {
        if (!classroom.status?.isOccupied) return
        setSelectedStatus(classroom.status)
        setSelectedClassroomName(classroom.name)
        setIsDetailModalOpen(true)
    }

    const handleViewSchedule = (classroom: any) => {
        setSelectedClassroomId(classroom.id)
        setSelectedClassroomName(classroom.name)
        setIsScheduleModalOpen(true)
    }

    const handleCreateSuccess = () => {
        fetchClassrooms()
        setIsCreateModalOpen(false)
    }

    return {
        classrooms,
        isLoading,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDetailModalOpen,
        setIsDetailModalOpen,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        selectedStatus,
        selectedClassroomName,
        selectedClassroomId,
        handleViewDetails,
        handleViewSchedule,
        handleCreateSuccess,
        refreshClassrooms: fetchClassrooms
    }
}
