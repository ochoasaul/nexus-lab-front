import { useState, useMemo, useCallback } from 'react'
import { useClassrooms } from '@/hooks/useClassrooms'

export interface SubjectTeacher {
  id: string | number
  name: string
  teacher: string
  classroom: string
  schedule: string
  daysType: string
  startDate: string
  endDate: string
  state: 'active' | 'inactive'
}

export function useSubjects() {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<SubjectTeacher | null>(null)
  const [filterBy, setFilterBy] = useState<'schedule' | 'daysType'>('schedule')
  const [filterValue, setFilterValue] = useState<string>('')
  const { classrooms, isLoading: isLoadingClassrooms } = useClassrooms()

  // Datos mock - reemplazar con datos reales del backend
  const [subjects, setSubjects] = useState<SubjectTeacher[]>([
    {
      id: 1,
      name: 'Programación I',
      teacher: 'Dr. Juan Pérez',
      classroom: 'Aula 101',
      schedule: '7:15 - 10:00',
      daysType: 'Lunes-Miércoles',
      startDate: '2025-01-15',
      endDate: '2025-05-30',
      state: 'active',
    },
  ])

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

  const handleToggleSubject = useCallback((id: string | number) => {
    setSubjects(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, state: m.state === 'active' ? 'inactive' : 'active' }
          : m
      )
    )
  }, [])

  const handleSubjectSubmit = useCallback((data: any) => {
    if (selectedSubject) {
      setSubjects(prev =>
        prev.map(m => (m.id === selectedSubject.id ? { ...m, ...data } : m))
      )
    } else {
      setSubjects(prev => [
        ...prev,
        {
          id: Date.now(),
          ...data,
          state: 'active',
        },
      ])
    }
    setIsSubjectModalOpen(false)
    setSelectedSubject(null)
  }, [selectedSubject])

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
  }
}

