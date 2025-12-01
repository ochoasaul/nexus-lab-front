import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import { LoanIcon, SupportIcon, InventoryIcon, CalendarIcon } from '@/components/icons/Icons'
import { Panel } from './Panel'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import { SoporteModal } from '@/pages/Register/components/modals/SoporteModal'
import { LostObjectModal, type LostObjectFormData } from '@/pages/Reports/components/modals/LostObjectModal'
import { soporteService } from '@/services/soporteService'
import { lostObjectService } from '@/services/lostObjectService'
import { useAulas } from '@/hooks/useAulas'
import { useLostObjects } from '@/hooks/useLostObjects'
import { useToastStore } from '@/store/toastStore'

export function QuickActions() {
  const { simulateInventoryAudit, simulateReservation } = useDashboard()
  const [isSoporteModalOpen, setIsSoporteModalOpen] = useState(false)
  const [isLostObjectModalOpen, setIsLostObjectModalOpen] = useState(false)
  const addToast = useToastStore((state) => state.addToast)
  
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { refetch: refetchLostObjects } = useLostObjects(currentMonth)
  const { aulas, isLoading: isLoadingAulas, error: aulasError } = useAulas()

  const handleSoporteSubmit = async (data: {
    tipo: 'materia' | 'tecnico'
    problema: string
    solucion?: string
    fecha_hora?: string
    persona_solicitante_id?: string
  }) => {
    try {
      if (data.tipo === 'materia') {
        await soporteService.createMateria({
          problema: data.problema,
          solucion: data.solucion,
          fecha_hora: data.fecha_hora,
          tipo: 'Soporte de Materia',
        })
        addToast('Soporte de materia registrado exitosamente', 'success')
      } else {
        await soporteService.createTecnico({
          problema: data.problema,
          solucion: data.solucion,
          fecha_hora: data.fecha_hora,
          persona_solicitante_id: data.persona_solicitante_id,
          tipo: 'Soporte Técnico',
        })
        addToast('Soporte técnico registrado exitosamente', 'success')
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
          objeto: data.objeto,
          fecha_encontrado: data.fecha_encontrado || undefined,
          horario_encontrado: data.horario_encontrado || undefined,
          aula_id: data.aula_id || undefined,
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

  const aulasFormatted = aulas.map((aula) => ({
    id: aula.id,
    nombre: aula.nombre,
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
            label="Registro de Soporte" 
            variant="secondary" 
            onClick={() => setIsSoporteModalOpen(true)} 
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

      <SoporteModal
        isOpen={isSoporteModalOpen}
        onClose={() => setIsSoporteModalOpen(false)}
        onSubmit={handleSoporteSubmit}
      />

      <LostObjectModal
        isOpen={isLostObjectModalOpen}
        onClose={() => setIsLostObjectModalOpen(false)}
        onSubmit={handleLostObjectSubmit}
        aulas={aulasFormatted}
        isLoadingAulas={isLoadingAulas}
        aulasError={aulasError}
      />
    </>
  )
}
