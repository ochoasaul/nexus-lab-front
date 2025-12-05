import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'

interface OccupantDetailModalProps {
    isOpen: boolean
    onClose: () => void
    data: any // The status object from the classroom
    classroomName: string
}

export function OccupantDetailModal({ isOpen, onClose, data, classroomName }: OccupantDetailModalProps) {
    if (!data) return null

    const isReservation = data.type === 'Reservation'

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Detalles de Ocupación - ${classroomName}`}
            size="md"
        >
            <div className="space-y-6">
                <div className={`p-4 rounded-xl border ${isReservation ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isReservation ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                            {isReservation ? 'Reserva' : 'Clase Regular'}
                        </span>
                        <span className="text-sm text-charcoal-500">
                            {data.schedule}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-charcoal-900 mb-1">
                        {data.subjectName}
                    </h3>
                    <p className="text-charcoal-600 font-medium">
                        {data.occupantName}
                    </p>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-charcoal-900 border-b border-charcoal-100 pb-2">Información Adicional</h4>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="block text-charcoal-500 text-xs">Tipo de Día</span>
                            <span className="text-charcoal-900">{data.details?.day_type || 'N/A'}</span>
                        </div>
                        <div>
                            <span className="block text-charcoal-500 text-xs">Estado</span>
                            <span className="text-charcoal-900 capitalize">{data.state}</span>
                        </div>
                        {isReservation && (
                            <div className="col-span-2">
                                <span className="block text-charcoal-500 text-xs">Observación</span>
                                <p className="text-charcoal-900 mt-1">{data.details?.observation || 'Sin observaciones'}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-charcoal-100">
                    <Button label="Cerrar" onClick={onClose} variant="secondary" />
                </div>
            </div>
        </Modal>
    )
}
