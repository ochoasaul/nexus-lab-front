import { useState, useMemo, useCallback, useEffect } from 'react'
import { useClassrooms } from '@/hooks/useClassrooms'
import { subjectService, type Subject } from '@/services/subjectService'
import { useToastStore } from '@/store/toastStore'

export type SubjectTeacher = Subject

export function useSubjects() {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<SubjectTeacher | null>(null)
  const [filterBy, setFilterBy] = useState<'schedule' | 'daysType'>('schedule')
  const [filterValue, setFilterValue] = useState<string>('')
  const { classrooms, isLoading: isLoadingClassrooms } = useClassrooms()
  const addToast = useToastStore((state) => state.addToast)

  const [subjects, setSubjects] = useState<SubjectTeacher[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSubjects = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await subjectService.getAll()
      setSubjects(data)
    } catch (error) {
      console.error('Error fetching subjects:', error)
      addToast('Error al cargar las materias', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const filteredSubjects = useMemo(() => {
    if (!filterValue) return subjects

    if (filterBy === 'schedule') {
      return subjects.filter(m => m.schedule === filterValue)
    } else {
      return subjects.filter(m => m.daysType === filterValue)
    }
  }, [subjects, filterBy, filterValue])

  const classroomsFormatted = useMemo(() =>
    classrooms.map(a => ({ id: a.id, name: a.name })),
    [classrooms]
  )

  const handleAddSubject = useCallback(() => {
    setSelectedSubject(null)
    setIsSubjectModalOpen(true)
  }, [])

  const handleEditSubject = useCallback((subject: SubjectTeacher) => {
    setSelectedSubject(subject)
    setIsSubjectModalOpen(true)
  }, [])

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [subjectToToggle, setSubjectToToggle] = useState<SubjectTeacher | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleSubject = useCallback((subject: SubjectTeacher) => {
    setSubjectToToggle(subject)
    setIsConfirmModalOpen(true)
  }, [])

  const confirmToggleSubject = useCallback(async () => {
    if (!subjectToToggle) return

    setIsToggling(true)
    try {
      const newState = subjectToToggle.state === 'active' ? 'inactive' : 'active'
      await subjectService.update(subjectToToggle.id, { state: newState })

      // Update local state
      setSubjects(prev =>
        prev.map(m =>
          m.id === subjectToToggle.id
            ? { ...m, state: newState }
            : m
        )
      )
      addToast(`Materia ${newState === 'active' ? 'habilitada' : 'deshabilitada'} exitosamente`, 'success')
      setIsConfirmModalOpen(false)
      setSubjectToToggle(null)
    } catch (error) {
      console.error('Error toggling subject state:', error)
      addToast('Error al actualizar el estado', 'error')
    } finally {
      setIsToggling(false)
    }
  }, [subjectToToggle, addToast])

  const handleCloseConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
    setSubjectToToggle(null)
  }, [])

  const handleSubjectSubmit = useCallback(async (data: any) => {
    try {
      if (selectedSubject) {
        await subjectService.update(selectedSubject.id, data)
        addToast('Materia actualizada exitosamente', 'success')
      } else {
        await subjectService.create(data)
        addToast('Materia creada exitosamente', 'success')
      }
      fetchSubjects()
      setIsSubjectModalOpen(false)
      setSelectedSubject(null)
    } catch (error: any) {
      console.error('Error saving subject:', error)
      addToast(error.message || 'Error al guardar la materia', 'error')
      throw error // Re-throw to let modal handle loading state if needed
    }
  }, [selectedSubject, addToast, fetchSubjects])

  const handleCloseModal = useCallback(() => {
    setIsSubjectModalOpen(false)
    setSelectedSubject(null)
  }, [])

  const handleFilterChange = useCallback((newFilterBy: 'schedule' | 'daysType') => {
    setFilterBy(newFilterBy)
    setFilterValue('')
  }, [])

  return {
    subjects: filteredSubjects,
    isSubjectModalOpen,
    selectedSubject,
    filterBy,
    filterValue,
    setFilterValue,
    classroomsFormatted,
    isLoadingClassrooms,
    handleAddSubject,
    handleEditSubject,
    handleToggleSubject,
    handleSubjectSubmit,
    handleCloseModal,
    handleFilterChange,
    isLoading,
    isConfirmModalOpen,
    subjectToToggle,
    confirmToggleSubject,
    handleCloseConfirmModal,
    isToggling
  }
}

