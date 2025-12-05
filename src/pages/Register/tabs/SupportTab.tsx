import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { SupportModal } from '../components/modals/SoporteModal'
import { useSupports } from '@/hooks/useSupport'

export function SupportTab() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { supports, isLoading, fetchSupports } = useSupports()

    useEffect(() => {
        fetchSupports()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-charcoal-900">
                    Tickets de Soporte
                </h3>
                <Button
                    variant="primary"
                    label="Registrar Soporte"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-charcoal-500">
                    Cargando soportes...
                </div>
            ) : supports.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50">
                    <p className="text-charcoal-500">No hay tickets de soporte.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {supports.map((support: any) => (
                        <div
                            key={support.id}
                            className="rounded-xl border border-charcoal-100 bg-white p-3 hover:border-primary-200 hover:shadow-sm transition-all"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-charcoal-500 font-medium">
                                    {support.date_time ? new Date(support.date_time).toLocaleDateString() : '-'}
                                </span>
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${support.solution
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {support.solution ? 'Resuelto' : 'Pendiente'}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <h4 className="text-xs font-medium text-charcoal-900">Solicitado por</h4>
                                    <p className="text-charcoal-600 text-xs">
                                        {support.person ? `${support.person.first_name} ${support.person.last_name}` : 'Desconocido'}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-medium text-charcoal-900">Problema</h4>
                                    <p className="text-charcoal-600 text-xs line-clamp-2">{support.problem}</p>
                                </div>

                                {support.solution && (
                                    <div className="pt-2 border-t border-charcoal-50">
                                        <h4 className="text-xs font-medium text-charcoal-900">Solución</h4>
                                        <p className="text-charcoal-600 text-xs line-clamp-2">{support.solution}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <SupportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchSupports()
                    setIsModalOpen(false)
                }}
            />
        </div>
    )
}
