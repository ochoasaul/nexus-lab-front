import { useState, useMemo, useCallback } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import { lostObjectService, type LostObjectItem } from '@/services/lostObjectService'
import { useAulas } from '@/hooks/useAulas'
import { useLostObjects } from '@/hooks/useLostObjects'
import { useToastStore } from '@/store/toastStore'
import { type LostObjectFormData } from './components/modals/LostObjectModal'

export function useReports() {
  const { user, simulateReservation, simulateLostObject } = useDashboard()
  const [isLostObjectModalOpen, setIsLostObjectModalOpen] = useState(false)
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false)
  const [isAllLostObjectsModalOpen, setIsAllLostObjectsModalOpen] = useState(false)
  const [isViewImageModalOpen, setIsViewImageModalOpen] = useState(false)
  const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false)
  const [selectedLostObject, setSelectedLostObject] = useState<LostObjectItem | null>(null)
  const [modalFilterState, setModalFilterState] = useState<'all' | 'Perdido' | 'Porteria' | 'Entregado'>('all')
  const [isMovingToPorteria, setIsMovingToPorteria] = useState(false)
  const [expandedSections, setExpandedSections] = useState<{
    reports: boolean
    reservations: boolean
    lostObjects: boolean
  }>({
    reports: false,
    reservations: false,
    lostObjects: false,
  })
  const addToast = useToastStore((state) => state.addToast)
  
  const currentMonth = new Date().toISOString().slice(0, 7)
  const { lostObjects, isLoading: isLoadingLostObjects, error: lostObjectsError, refetch: refetchLostObjects } = useLostObjects(currentMonth)
  const { aulas, isLoading: isLoadingAulas, error: aulasError } = useAulas()

  // Filtrar solo objetos con estado "Perdido" y ordenar por fecha (más recientes primero)
  const perdidos = useMemo(() => {
    const filtered = lostObjects.filter(obj => obj.estado === 'Perdido')
    const sortByDate = (a: LostObjectItem, b: LostObjectItem) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return filtered.sort(sortByDate).slice(0, 4)
  }, [lostObjects])

  // Contar totales
  const totalPerdidos = useMemo(() => lostObjects.filter(o => o.estado === 'Perdido').length, [lostObjects])
  const totalLostObjects = useMemo(() => lostObjects.length, [lostObjects])

  // Preparar aulas desde el backend
  const aulasFormatted = useMemo(() => 
    aulas.map((aula) => ({
      id: aula.id,
      nombre: aula.nombre,
    })), [aulas]
  )

  // Filtrar objetos para el modal según el estado seleccionado
  const filteredObjectsForModal = useMemo(() => {
    if (modalFilterState === 'all') return lostObjects
    return lostObjects.filter(obj => obj.estado === modalFilterState)
  }, [lostObjects, modalFilterState])

  const handleLostObjectSubmit = useCallback(async (data: LostObjectFormData) => {
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
  }, [refetchLostObjects, addToast])

  const handleDeliverLostObject = useCallback(async ({ persona_id, evidence }: { persona_id: string; evidence: File }) => {
    if (!selectedLostObject) {
      throw new Error('No hay un objeto seleccionado')
    }
    try {
      await lostObjectService.deliver(selectedLostObject.id, { persona_id }, evidence)
      await refetchLostObjects()
      setIsDeliverModalOpen(false)
      setIsAllLostObjectsModalOpen(false)
      setSelectedLostObject(null)
      addToast('Objeto entregado exitosamente', 'success')
    } catch (error: any) {
      const errorMessage = error.message || 'Error al entregar el objeto'
      addToast(errorMessage, 'error')
      throw error
    }
  }, [selectedLostObject, refetchLostObjects, addToast])

  const handleMoveAllToPorteria = useCallback(() => {
    if (totalPerdidos === 0) {
      addToast('No hay objetos perdidos para mover', 'info')
      return
    }
    setIsConfirmMoveModalOpen(true)
  }, [totalPerdidos, addToast])

  const confirmMoveAllToPorteria = useCallback(async () => {
    setIsConfirmMoveModalOpen(false)
    setIsMovingToPorteria(true)
    try {
      const result = await lostObjectService.moveAllPerdidosToPorteria()
      await refetchLostObjects()
      addToast(`${result.updated} objetos movidos a portería exitosamente`, 'success')
    } catch (error: any) {
      const errorMessage = error.message || 'Error al mover objetos a portería'
      addToast(errorMessage, 'error')
    } finally {
      setIsMovingToPorteria(false)
    }
  }, [refetchLostObjects, addToast])

  const getImageUrl = useCallback((lostObject: LostObjectItem | null): string | null => {
    if (!lostObject) return null
    if ((lostObject.estado === 'Perdido' || lostObject.estado === 'Porteria') && lostObject.multimedia?.ruta) {
      return lostObject.multimedia.ruta
    }
    if (lostObject.estado === 'Entregado' && lostObject.entrega_objeto?.[0]?.multimedia?.ruta) {
      return lostObject.entrega_objeto[0].multimedia.ruta
    }
    return null
  }, [])

  const handleOpenAllModal = useCallback((filterState: 'all' | 'Perdido' | 'Porteria' | 'Entregado') => {
    setModalFilterState(filterState)
    setIsAllLostObjectsModalOpen(true)
  }, [])

  const handleDeliverFromModal = useCallback((lostObject: LostObjectItem) => {
    setSelectedLostObject(lostObject)
    setIsAllLostObjectsModalOpen(false)
    setIsDeliverModalOpen(true)
  }, [])

  const toggleSection = useCallback((section: 'reports' | 'reservations' | 'lostObjects') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }, [])

  return {
    user,
    // Data
    perdidos,
    totalPerdidos,
    totalLostObjects,
    lostObjects,
    isLoadingLostObjects,
    lostObjectsError,
    aulasFormatted,
    isLoadingAulas,
    aulasError,
    filteredObjectsForModal,
    currentMonth,
    // Modal states
    isLostObjectModalOpen,
    setIsLostObjectModalOpen,
    isDeliverModalOpen,
    setIsDeliverModalOpen,
    isAllLostObjectsModalOpen,
    setIsAllLostObjectsModalOpen,
    isViewImageModalOpen,
    setIsViewImageModalOpen,
    isConfirmMoveModalOpen,
    setIsConfirmMoveModalOpen,
    selectedLostObject,
    setSelectedLostObject,
    modalFilterState,
    isMovingToPorteria,
    expandedSections,
    // Handlers
    handleLostObjectSubmit,
    handleDeliverLostObject,
    handleMoveAllToPorteria,
    confirmMoveAllToPorteria,
    getImageUrl,
    handleOpenAllModal,
    handleDeliverFromModal,
    toggleSection,
    // Dashboard functions
    simulateReservation,
    simulateLostObject,
  }
}

