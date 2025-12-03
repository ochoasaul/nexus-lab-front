import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import { LoanIcon, SupportIcon, InventoryIcon, CalendarIcon } from '@/components/icons/Icons'
import { Panel } from './Panel'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import { SupportModal } from '@/pages/Register/components/modals/SoporteModal'
import { LostObjectModal, type LostObjectFormData } from '@/pages/Reports/components/modals/LostObjectModal'
import { supportService } from '@/services/supportService'
import { lostObjectService } from '@/services/lostObjectService'
import { useClassrooms } from '@/hooks/useClassrooms'
import { useLostObjects } from '@/hooks/useLostObjects'
import { useToastStore } from '@/store/toastStore'

export function QuickActions() {
  const { simulateInventoryAudit, simulateReservation } = useDashboard()
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [isLostObjectModalOpen, setIsLostObjectModalOpen] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const { refetch: refetchLostObjects } = useLostObjects(currentMonth)
  const { classrooms, isLoading: isLoadingClassrooms, error: classroomsError } = useClassrooms()

  const handleSupportSubmit = async (data: {
    type: 'subject' | 'technical'
    problem: string
    solution?: string
    date_time?: string
    requester_person_id?: string
  }) => {
    try {
      if (data.type === 'subject') {
        await supportService.createSubject({
          problem: data.problem,
          solution: data.solution,
          date_time: data.date_time,
        })
        addToast('Subject support registered successfully', 'success')
      } else {
        await supportService.createTechnical({
          problem: data.problem,
          solution: data.solution,
          date_time: data.date_time,
          requester_person_id: data.requester_person_id,
        })
        addToast('Technical support registered successfully', 'success')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Error al registrar el soporte'
      addToast(errorMessage, 'error')
      throw error
    }
  }

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

  return (
    <>
      <Panel title="Acciones rápidas">
        <div className="flex flex-wrap gap-3">
          <Button
            label="Registro de préstamos"
            variant="primary"
            onClick={simulateInventoryAudit}
            Icon={LoanIcon}
          />
          <Button
            label="Support Registration"
            variant="secondary"
            onClick={() => setIsSupportModalOpen(true)}
            Icon={SupportIcon}
          />
          <Button
            label="Registro de Objetos perdidos"
            variant="ghost"
            onClick={() => setIsLostObjectModalOpen(true)}
            Icon={InventoryIcon}
          />
          <Button
            label="Registro de Reservas"
            variant="ghost"
            onClick={simulateReservation}
            Icon={CalendarIcon}
          />
        </div>
      </Panel>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        onSubmit={handleSupportSubmit}
      />

      <LostObjectModal
        isOpen={isLostObjectModalOpen}
        onClose={() => setIsLostObjectModalOpen(false)}
        onSubmit={handleLostObjectSubmit}
        classrooms={classroomsFormatted}
        isLoadingClassrooms={isLoadingClassrooms}
        classroomsError={classroomsError}
      />
    </>
  )
}
