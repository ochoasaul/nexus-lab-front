import { useState } from 'react'
import { classroomService, CreateClassroomDto, Classroom } from '@/services/classroomService'
import { useToastStore } from '@/store/toastStore'

export const useClassroom = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { addToast } = useToastStore()

    const fetchClassrooms = async () => {
        setIsLoading(true)
        try {
            const data = await classroomService.getAll()
            setClassrooms(data)
        } catch (error: any) {
            addToast(error.message || 'Error loading classrooms', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return { classrooms, isLoading, fetchClassrooms }
}

export const useCreateClassroom = () => {
    const [isPending, setIsPending] = useState(false)
    const { addToast } = useToastStore()

    const mutate = async (data: CreateClassroomDto, options?: { onSuccess?: () => void }) => {
        setIsPending(true)
        try {
            await classroomService.create(data)
            addToast('Classroom created successfully', 'success')
            if (options?.onSuccess) {
                options.onSuccess()
            }
        } catch (error: any) {
            addToast(error.message || 'Error creating classroom', 'error')
        } finally {
            setIsPending(false)
        }
    }

    return { mutate, isPending }
}
