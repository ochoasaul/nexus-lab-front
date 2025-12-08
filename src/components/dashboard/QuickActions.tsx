import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import { LoanIcon, SupportIcon, InventoryIcon, CalendarIcon } from '@/components/icons/Icons'
import { Panel } from './Panel'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import { SupportModal } from '@/pages/Register/components/modals/SoporteModal'
import { LostObjectModal, type LostObjectFormData } from '@/pages/Reports/components/modals/LostObjectModal'
import { CreateReservationModal } from '@/pages/Reports/components/modals/CreateReservationModal'

import { lostObjectService } from '@/services/lostObjectService'
import { reservationService } from '@/services/reservationService'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useLostObjects } from '@/hooks/useLostObjects'
import { useToastStore } from '@/store/toastStore'

export function QuickActions() {
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [isLostObjectModalOpen, setIsLostObjectModalOpen] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const { refetch: refetchLostObjects } = useLostObjects(currentMonth)
  const { classrooms, isLoading: isLoadingClassrooms, error: classroomsError } = useClassrooms()


  const handleLostObjectSubmit = async (data: LostObjectFormData) => {
    if (!data.multimedia) {
      throw new Error('La imagen es requerida')
    }

    try {
      await lostObjectService.create(
        {
          object: data.object,
          found_date: data.date_found || undefined,
          found_schedule: data.time_found || undefined,
          classroom_id: data.classroom_id || undefined,
        },
        data.multimedia
      )
      await refetchLostObjects()
      setIsLostObjectModalOpen(false)
      addToast('Objeto perdido registrado exitosamente', 'success')
    } catch (error: any) {
      console.error('Error al registrar objeto perdido:', error)
      const errorMessage = error.message || 'Error al registrar el objeto perdido'
      addToast(errorMessage, 'error')
      throw error
    }
  }

  const classroomsFormatted = classrooms.map((classroom) => ({
    id: classroom.id,
    name: classroom.name,
  }))

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const { simulateInventoryAudit, simulateReservation } = useDashboard()

  const handleReservationSubmit = async (data: any) => {
    try {
      await reservationService.create(data)
      addToast('Reserva creada exitosamente', 'success')
      setIsReservationModalOpen(false)
    } catch (error: any) {
      console.error('Error creating reservation:', error)
      addToast(error.message || 'Error al crear la reserva', 'error')
    }
  }

  return (
    <>
      <Panel title="Acciones rápidas">
        <div className="grid grid-cols-2 lg:flex  gap-6">
          <Button
            label="Registro de Préstamos"
            variant="secondary"
            onClick={simulateInventoryAudit}
            Icon={LoanIcon}
            className="w-full hover:border-primary-500 hover:text-primary-600 transition-colors shadow-sm "
          />
          <Button
            label="Registro de Soporte"
            variant="secondary"
            onClick={() => setIsSupportModalOpen(true)}
            Icon={SupportIcon}
            className="w-full hover:border-primary-500 hover:text-primary-600 transition-colors shadow-sm "
          />
          <Button
            label="Registro de Objetos Perdidos"
            variant="secondary"
            onClick={() => setIsLostObjectModalOpen(true)}
            Icon={InventoryIcon}
            className="w-full hover:border-primary-500 hover:text-primary-600 transition-colors shadow-sm "
          />
          <Button
            label="Registro de Reservas"
            variant="secondary"
            onClick={() => setIsReservationModalOpen(true)}
            Icon={CalendarIcon}
            className="w-full hover:border-primary-500 hover:text-primary-600 transition-colors shadow-sm"
          />
        </div>
      </Panel>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSuccess={() => setIsSupportModalOpen(false)}
      />

      <LostObjectModal
        isOpen={isLostObjectModalOpen}
        onClose={() => setIsLostObjectModalOpen(false)}
        onSubmit={handleLostObjectSubmit}
        classrooms={classroomsFormatted}
        isLoadingClassrooms={isLoadingClassrooms}
        classroomsError={classroomsError}
      />

      <CreateReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onSubmit={handleReservationSubmit}
        classrooms={classroomsFormatted}
      />
    </>
  )
}
