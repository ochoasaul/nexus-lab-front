import { useState, useMemo, useCallback } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import { lostObjectService, type LostObjectItem, LostObjectState } from '@/services/lostObjectService'
import { useClassrooms } from '@/hooks/useClassrooms'
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
  const { classrooms, isLoading: isLoadingClassrooms, error: classroomsError } = useClassrooms()

  // Filter only "Lost" objects and sort by date (newest first)
  const lostItems = useMemo(() => {
    const filtered = lostObjects.filter(obj => obj.state === LostObjectState.Perdido)
    const sortByDate = (a: LostObjectItem, b: LostObjectItem) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    return filtered.sort(sortByDate).slice(0, 4)
  }, [lostObjects])

  // Count totals
  const totalLostItems = useMemo(() => lostObjects.filter(o => o.state === LostObjectState.Perdido).length, [lostObjects])
  const totalLostObjects = useMemo(() => lostObjects.length, [lostObjects])

  // Prepare classrooms from backend
  const classroomsFormatted = useMemo(() =>
    classrooms.map((classroom) => ({
      id: classroom.id,
      name: classroom.name,
    })), [classrooms]
  )

  // Filter objects for modal based on selected state
  const filteredObjectsForModal = useMemo(() => {
    if (modalFilterState === 'all') return lostObjects
    return lostObjects.filter(obj => obj.state === modalFilterState)
  }, [lostObjects, modalFilterState])

  const handleLostObjectSubmit = useCallback(async (data: LostObjectFormData) => {
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
  }, [refetchLostObjects, addToast])

  const handleDeliverLostObject = useCallback(async (params: { person_id: string; evidence: File }) => {
    if (!selectedLostObject) return

    try {
      await lostObjectService.deliver(
        selectedLostObject.id,
        { person_id: params.person_id },
        params.evidence
      )
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

  const handleMoveAllToReception = useCallback(() => {
    if (totalLostItems === 0) {
      addToast('No lost objects to move', 'info')
      return
    }
    setIsConfirmMoveModalOpen(true)
  }, [totalLostItems, addToast])

  const confirmMoveAllToReception = useCallback(async () => {
    setIsConfirmMoveModalOpen(false)
    setIsMovingToPorteria(true)
    try {
      const result = await lostObjectService.moveAllLostToReception()
      await refetchLostObjects()
      addToast(`${result.updated} objects moved to reception successfully`, 'success')
    } catch (error: any) {
      const errorMessage = error.message || 'Error moving objects to reception'
      addToast(errorMessage, 'error')
    } finally {
      setIsMovingToPorteria(false)
    }
  }, [refetchLostObjects, addToast])

  const getImageUrl = useCallback((lostObject: LostObjectItem | null): string | null => {
    if (!lostObject) return null
    if ((lostObject.state === LostObjectState.Perdido || lostObject.state === LostObjectState.Porteria) && lostObject.multimedia?.path) {
      return lostObject.multimedia.path
    }
    if (lostObject.state === LostObjectState.Entregado && lostObject.object_delivery?.[0]?.multimedia?.path) {
      return lostObject.object_delivery[0].multimedia.path
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
    lostItems,
    totalLostItems,
    totalLostObjects,
    lostObjects,
    isLoadingLostObjects,
    lostObjectsError,
    classroomsFormatted,
    isLoadingClassrooms,
    classroomsError,
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
    handleMoveAllToReception,
    confirmMoveAllToReception,
    getImageUrl,
    handleOpenAllModal,
    handleDeliverFromModal,
    toggleSection,
    // Dashboard functions
    simulateReservation,
    simulateLostObject,
  }
}

