import { useState, useMemo, useCallback } from 'react'
import { useAulas } from '@/hooks/useAulas'

export interface MateriaDocente {
  id: string | number
  nombre: string
  docente: string
  aula: string
  horario: string
  tipoDias: string
  fechaInicio: string
  fechaFin: string
  estado: 'activo' | 'inactivo'
}

export function useMaterias() {
  const [isMateriaModalOpen, setIsMateriaModalOpen] = useState(false)
  const [selectedMateria, setSelectedMateria] = useState<MateriaDocente | null>(null)
  const [filterBy, setFilterBy] = useState<'horario' | 'tipoDias'>('horario')
  const [filterValue, setFilterValue] = useState<string>('')
  const { aulas, isLoading: isLoadingAulas } = useAulas()

  // Datos mock - reemplazar con datos reales del backend
  const [materias, setMaterias] = useState<MateriaDocente[]>([
    {
      id: 1,
      nombre: 'Programación I',
      docente: 'Dr. Juan Pérez',
      aula: 'Aula 101',
      horario: '7:15 - 10:00',
      tipoDias: 'Lunes-Miércoles',
      fechaInicio: '2025-01-15',
      fechaFin: '2025-05-30',
      estado: 'activo',
    },
  ])

  const filteredMaterias = useMemo(() => {
    if (!filterValue) return materias

    if (filterBy === 'horario') {
      return materias.filter(m => m.horario === filterValue)
    } else {
      return materias.filter(m => m.tipoDias === filterValue)
    }
  }, [materias, filterBy, filterValue])

  const aulasFormatted = useMemo(() => 
    aulas.map(a => ({ id: a.id, nombre: a.nombre })), 
    [aulas]
  )

  const handleAddMateria = useCallback(() => {
    setSelectedMateria(null)
    setIsMateriaModalOpen(true)
  }, [])

  const handleEditMateria = useCallback((materia: MateriaDocente) => {
    setSelectedMateria(materia)
    setIsMateriaModalOpen(true)
  }, [])

  const handleToggleMateria = useCallback((id: string | number) => {
    setMaterias(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, estado: m.estado === 'activo' ? 'inactivo' : 'activo' }
          : m
      )
    )
  }, [])

  const handleMateriaSubmit = useCallback((data: any) => {
    if (selectedMateria) {
      setMaterias(prev =>
        prev.map(m => (m.id === selectedMateria.id ? { ...m, ...data } : m))
      )
    } else {
      setMaterias(prev => [
        ...prev,
        {
          id: Date.now(),
          ...data,
          estado: 'activo',
        },
      ])
    }
    setIsMateriaModalOpen(false)
    setSelectedMateria(null)
  }, [selectedMateria])

  const handleCloseModal = useCallback(() => {
    setIsMateriaModalOpen(false)
    setSelectedMateria(null)
  }, [])

  const handleFilterChange = useCallback((newFilterBy: 'horario' | 'tipoDias') => {
    setFilterBy(newFilterBy)
    setFilterValue('')
  }, [])

  return {
    materias: filteredMaterias,
    isMateriaModalOpen,
    selectedMateria,
    filterBy,
    filterValue,
    setFilterValue,
    aulasFormatted,
    isLoadingAulas,
    handleAddMateria,
    handleEditMateria,
    handleToggleMateria,
    handleMateriaSubmit,
    handleCloseModal,
    handleFilterChange,
  }
}

