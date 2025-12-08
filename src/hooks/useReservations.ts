import { useState, useEffect, useCallback } from 'react'
import { reservationService, type ReservationItem } from '@/services/reservationService'
import { type LabReservation } from '@/mocks/labs'

export function useReservations() {
    const [reservations, setReservations] = useState<ReservationItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchReservations = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await reservationService.getAll()
            setReservations(data)
        } catch (err: any) {
            setError(err.message || 'Error al cargar las reservas')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReservations()
    }, [fetchReservations])

    const getAvailableClassrooms = useCallback(async (params: any) => {
        try {
            return await reservationService.getAvailableClassrooms(params)
        } catch (err: any) {
            throw new Error(err.message || 'Error al buscar aulas disponibles')
        }
    }, [])

    const extendReservation = useCallback(async (id: string | number, dates: string[]) => {
        try {
            await reservationService.extend(id, dates)
            await fetchReservations()
        } catch (err: any) {
            throw new Error(err.message || 'Error al extender la reserva')
        }
    }, [fetchReservations])

    // Map to LabReservation for UI compatibility
    const formattedReservations: LabReservation[] = reservations.map(r => {
        let dateDisplay = 'Fechas variadas'
        try {
            const dates = JSON.parse(r.dates)
            if (Array.isArray(dates) && dates.length > 0) {
                if (dates.length === 1) {
                    dateDisplay = dates[0]
                } else {
                    const start = dates[0]
                    const end = dates[dates.length - 1]
                    dateDisplay = `${start} - ${end}`
                }
            }
        } catch (e) {
            dateDisplay = 'Fecha inválida'
        }

        const requesterName = r.person
            ? `${r.person.first_name} ${r.person.last_name}`
            : `ID: ${r.requester_person_id}`

        return {
            id: String(r.id),
            requester: requesterName,
            room: r.classroom?.name || 'Sin aula',
            date: dateDisplay,
            status: (r.state?.toLowerCase() as any) || 'pendiente'
        }
    })

    return {
        reservations,
        formattedReservations,
        isLoading,
        error,
        refetch: fetchReservations,
        getAvailableClassrooms,
        extendReservation
    }
}
