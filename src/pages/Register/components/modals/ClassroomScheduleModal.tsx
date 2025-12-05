import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useClassroomSchedule } from './useClassroomSchedule'

interface ClassroomScheduleModalProps {
    isOpen: boolean
    onClose: () => void
    classroomId: number
    classroomName: string
}

export function ClassroomScheduleModal({ isOpen, onClose, classroomId, classroomName }: ClassroomScheduleModalProps) {
    const { activeTab, setActiveTab, schedule, isLoading } = useClassroomSchedule(classroomId, isOpen)

    if (!isOpen) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Horario - ${classroomName}`}
            size="lg"
        >
            <div className="flex gap-4 border-b border-charcoal-100 mb-4">
                <button
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'classes'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-charcoal-500 hover:text-charcoal-900'
                        }`}
                    onClick={() => setActiveTab('classes')}
                >
                    Clases Regulares
                </button>
                <button
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === 'reservations'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-charcoal-500 hover:text-charcoal-900'
                        }`}
                    onClick={() => setActiveTab('reservations')}
                >
                    Reservas Próximas
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-charcoal-500">Cargando horario...</div>
            ) : !schedule ? (
                <div className="text-center py-8 text-charcoal-500">No se pudo cargar el horario.</div>
            ) : (
                <div className="min-h-[300px] max-h-[500px] overflow-y-auto">
                    {activeTab === 'classes' && (
                        <div className="space-y-3">
                            {schedule.assignments.length === 0 ? (
                                <p className="text-center text-charcoal-500 py-4">No hay clases regulares asignadas.</p>
                            ) : (
                                schedule.assignments.map((assignment: any) => (
                                    <div key={assignment.id} className="p-3 border border-charcoal-100 rounded-xl bg-white">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-charcoal-900">{assignment.subject}</h4>
                                                <p className="text-sm text-charcoal-600">{assignment.teacher}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                                                {assignment.day_type}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-charcoal-500 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {assignment.schedule}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'reservations' && (
                        <div className="space-y-3">
                            {schedule.reservations.length === 0 ? (
                                <p className="text-center text-charcoal-500 py-4">No hay reservas próximas.</p>
                            ) : (
                                schedule.reservations.map((reservation: any) => (
                                    <div key={reservation.id} className="p-3 border border-charcoal-100 rounded-xl bg-white">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-charcoal-900">{reservation.subject}</h4>
                                                <p className="text-sm text-charcoal-600">Solicitado por: {reservation.requester}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${reservation.state === 'Approved' ? 'bg-green-50 text-green-700' :
                                                reservation.state === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                                    'bg-gray-50 text-gray-700'
                                                }`}>
                                                {reservation.state}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <div className="text-sm text-charcoal-500 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {/* Display dates nicely */}
                                                {reservation.dates && JSON.parse(reservation.dates as string).join(', ')}
                                            </div>
                                            <div className="text-sm text-charcoal-500 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {reservation.schedule}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-charcoal-100 mt-4">
                <Button label="Cerrar" onClick={onClose} variant="secondary" />
            </div>
        </Modal>
    )
}
