import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { reservationService, type ReservationItem } from '@/services/reservationService'
import { Calendar } from '@/components/ui/Calendar'

interface ReservationDetailModalProps {
    isOpen: boolean
    onClose: () => void
    reservation: ReservationItem | null
    onReservationUpdated: () => void
}

const DAY_TYPE_OPTIONS = [
    { value: 'Modular', label: 'Modular (Lun-Vie)', days: [1, 2, 3, 4, 5] },
    { value: 'Martes y Jueves', label: 'Martes y Jueves', days: [2, 4] },
    { value: 'Lunes y Miercoles', label: 'Lunes y Miércoles', days: [1, 3] },
    { value: 'Viernes y Sabado', label: 'Viernes y Sábado', days: [5, 6] },
    { value: 'Variado', label: 'Variado', days: [] } // Empty means any
]

export function ReservationDetailModal({ isOpen, onClose, reservation, onReservationUpdated }: ReservationDetailModalProps) {
    const [isExtending, setIsExtending] = useState(false)
    const [newDates, setNewDates] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen) {
            setIsExtending(false)
            setNewDates([])
            setError(null)
        }
    }, [isOpen])

    if (!reservation) return null

    const isDateSelectable = (date: Date) => {
        if (!reservation.day_type) return false
        if (reservation.day_type === 'Variado') return true

        const selectedType = DAY_TYPE_OPTIONS.find(d => d.value === reservation.day_type)
        if (!selectedType) return false

        const dayOfWeek = date.getDay()
        return selectedType.days.includes(dayOfWeek)
    }

    const toggleDate = (date: Date) => {
        if (!isDateSelectable(date)) return

        const dateStr = date.toISOString().split('T')[0]

        // Don't allow toggling existing dates
        const existingDates = (reservation.dates as string[]) || []
        if (existingDates.includes(dateStr)) return

        setNewDates(prev => {
            const exists = prev.includes(dateStr)
            if (exists) {
                return prev.filter(d => d !== dateStr)
            } else {
                return [...prev, dateStr].sort()
            }
        })
    }

    const handleExtend = async () => {
        if (newDates.length === 0) return

        setIsLoading(true)
        setError(null)
        try {
            await reservationService.extend(reservation.id, newDates)
            onReservationUpdated()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Error al extender la reserva')
        } finally {
            setIsLoading(false)
        }
    }

    const existingDates = (reservation.dates as string[]) || []
    const allDates = [...existingDates, ...newDates].sort()

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles de Reserva"
            size="lg"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div>
                        <h3 className="text-xl font-bold text-charcoal-900 break-words">{reservation.subject}</h3>
                        <p className="text-charcoal-600">
                            Solicitado por: <span className="font-medium">{reservation.person?.first_name} {reservation.person?.last_name}</span>
                        </p>
                    </div>
                    <StatusBadge label={reservation.state || 'Pending'} />
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 bg-charcoal-50 p-4 rounded-xl border border-charcoal-100">
                    <div>
                        <span className="text-xs text-charcoal-500 uppercase tracking-wider block mb-1">Aula</span>
                        <span className="font-medium text-charcoal-900">{reservation.classroom?.name || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="text-xs text-charcoal-500 uppercase tracking-wider block mb-1">Horario</span>
                        <span className="font-medium text-charcoal-900">{reservation.schedule}</span>
                    </div>
                    <div>
                        <span className="text-xs text-charcoal-500 uppercase tracking-wider block mb-1">Tipo de Días</span>
                        <span className="font-medium text-charcoal-900">{reservation.day_type}</span>
                    </div>
                    <div>
                        <span className="text-xs text-charcoal-500 uppercase tracking-wider block mb-1">Cant. Estudiantes</span>
                        <span className="font-medium text-charcoal-900">{reservation.student_count}</span>
                    </div>
                    {reservation.observation && (
                        <div className="col-span-2">
                            <span className="text-xs text-charcoal-500 uppercase tracking-wider block mb-1">Observación</span>
                            <p className="text-sm text-charcoal-700">{reservation.observation}</p>
                        </div>
                    )}
                </div>

                {/* Dates Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-charcoal-900">Fechas Seleccionadas ({allDates.length})</h4>
                        {!isExtending ? (
                            <Button
                                label="Aumentar Fechas"
                                variant="secondary"
                                onClick={() => setIsExtending(true)}
                                className="text-xs"
                            />
                        ) : (
                            <Button
                                label="Cancelar Edición"
                                variant="ghost"
                                onClick={() => {
                                    setIsExtending(false)
                                    setNewDates([])
                                    setError(null)
                                }}
                                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                            />
                        )}
                    </div>

                    {/* Date List (Collapsed view if not extending) */}
                    {!isExtending && (
                        <div className="flex flex-wrap gap-2">
                            {existingDates.map(date => (
                                <span key={date} className="px-2 py-1 bg-white border border-charcoal-200 rounded-lg text-sm text-charcoal-600">
                                    {new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Calendar View for Extending */}
                    {isExtending && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="grid grid-cols-1 gap-6">
                                <Calendar
                                    selectedDates={newDates}
                                    existingDates={existingDates}
                                    onDateSelect={toggleDate}
                                    isDateSelectable={isDateSelectable}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <Button
                                    label={isLoading ? "Guardando..." : `Confirmar y Agregar ${newDates.length} Fechas`}
                                    onClick={handleExtend}
                                    disabled={newDates.length === 0 || isLoading}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t border-charcoal-100">
                    <Button label="Cerrar" variant="ghost" onClick={onClose} />
                </div>
            </div>
        </Modal>
    )
}
