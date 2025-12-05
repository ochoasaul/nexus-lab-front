import { CreateClassroomModal } from '../components/modals/CreateClassroomModal'
import { OccupantDetailModal } from '../components/modals/OccupantDetailModal'
import { ClassroomScheduleModal } from '../components/modals/ClassroomScheduleModal'
import { useClassroomTab } from './useClassroomTab'
import Button from '@/components/ui/Button/Button'

export function ClassroomTab() {
    const {
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
        handleCreateSuccess
    } = useClassroomTab()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-charcoal-900">
                    Aulas y Laboratorios
                </h3>
                <Button
                    variant="primary"
                    label="Nueva Aula"
                    onClick={() => setIsCreateModalOpen(true)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-charcoal-500">
                    Cargando aulas...
                </div>
            ) : classrooms.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50">
                    <p className="text-charcoal-500">No se encontraron aulas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms.map((classroom: any) => {
                        const isOccupied = classroom.status?.isOccupied
                        const detail = classroom.classroom_detail?.[0]

                        return (
                            <div
                                key={classroom.id}
                                className={`
                                    relative rounded-2xl border p-5 transition-all
                                    ${isOccupied
                                        ? 'border-orange-200 bg-orange-50/30 hover:shadow-md'
                                        : 'border-charcoal-100 bg-white hover:border-primary-200 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="text-lg font-bold text-charcoal-900">{classroom.name}</h4>
                                        <span className="text-xs text-charcoal-500">Bloque {classroom.block || '-'}</span>
                                    </div>
                                    <span className={`
                                        px-2.5 py-1 rounded-full text-xs font-medium
                                        ${isOccupied
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-green-100 text-green-700'
                                        }
                                    `}>
                                        {isOccupied ? 'Ocupado' : 'Libre'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-charcoal-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        <span>Capacidad: {detail?.student_capacity || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-charcoal-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>Computadoras: {detail?.computer_count || 0}</span>
                                    </div>
                                </div>

                                {isOccupied ? (
                                    <div className="mt-3 pt-3 border-t border-orange-100">
                                        <p className="text-xs text-charcoal-500 mb-1">Ocupado por:</p>
                                        <p className="font-medium text-charcoal-900 truncate">{classroom.status.occupantName}</p>
                                        <p className="text-xs text-charcoal-600 mt-1">{classroom.status.schedule}</p>

                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleViewDetails(classroom)}
                                                className="flex-1 py-2 text-sm font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors"
                                            >
                                                Ver Detalles
                                            </button>
                                            <button
                                                onClick={() => handleViewSchedule(classroom)}
                                                className="flex-1 py-2 text-sm font-medium text-charcoal-700 bg-white border border-charcoal-200 hover:bg-charcoal-50 rounded-xl transition-colors"
                                            >
                                                Ver Horario
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3 pt-3 border-t border-charcoal-50">
                                        <p className="text-xs text-green-600 font-medium mb-2">Disponible para reserva</p>
                                        <button
                                            onClick={() => handleViewSchedule(classroom)}
                                            className="w-full py-2 text-sm font-medium text-charcoal-700 bg-white border border-charcoal-200 hover:bg-charcoal-50 rounded-xl transition-colors"
                                        >
                                            Ver Horario
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <CreateClassroomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <OccupantDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                data={selectedStatus}
                classroomName={selectedClassroomName}
            />

            <ClassroomScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                classroomId={selectedClassroomId}
                classroomName={selectedClassroomName}
            />
        </div>
    )
}
