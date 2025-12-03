import { useState } from 'react'
import { supportService, CreateSupportDto } from '@/services/supportService'
import { useToastStore } from '@/store/toastStore'

export const useCreateSupport = () => {
    const [isPending, setIsPending] = useState(false)
    const { addToast } = useToastStore()

    const mutate = async (data: CreateSupportDto, options?: { onSuccess?: () => void }) => {
        setIsPending(true)
        try {
            await supportService.create(data)
            addToast('Soporte registrado exitosamente', 'success')
            if (options?.onSuccess) {
                options.onSuccess()
            }
        } catch (error: any) {
            addToast(error.message || 'Error al registrar el soporte', 'error')
        } finally {
            setIsPending(false)
        }
    }

    return { mutate, isPending }
}

export const useSupports = () => {
    const [supports, setSupports] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { addToast } = useToastStore()

    const fetchSupports = async () => {
        setIsLoading(true)
        try {
            const data = await supportService.getAll()
            setSupports(data)
        } catch (error: any) {
            addToast(error.message || 'Error loading supports', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return { supports, isLoading, fetchSupports }
}
