import { useState, useCallback } from 'react'

export interface AsistenciaDocente {
  id: string | number
  materia: string
  docente: string
  horario: string
  fecha: string
  horaIngreso: string
  horaSalida?: string | null
  estado: string
}

export interface MateriaOption {
  id: string | number
  nombre: string
  docente: string
  horario: string
}

export function useEntradaSalida() {
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
  const [selectedMateria, setSelectedMateria] = useState<string>('')
  const [tipoRegistro, setTipoRegistro] = useState<'entrada' | 'salida'>('entrada')
  
  // Materias disponibles para registro rápido
  const materiasDisponibles: MateriaOption[] = [
    { id: 1, nombre: 'Programación I', docente: 'Dr. Juan Pérez', horario: '7:15 - 10:00' },
    { id: 2, nombre: 'Base de Datos', docente: 'Dra. María García', horario: '10:15 - 13:00' },
    { id: 3, nombre: 'Redes', docente: 'Ing. Carlos López', horario: '13:00 - 16:00' },
  ]

  const [asistencias, setAsistencias] = useState<AsistenciaDocente[]>([
    {
      id: 1,
      materia: 'Programación I',
      docente: 'Dr. Juan Pérez',
      horario: '7:15 - 10:00',
      fecha: '2025-01-15',
      horaIngreso: '07:20',
      horaSalida: '10:05',
      estado: 'completo',
    },
    {
      id: 2,
      materia: 'Base de Datos',
      docente: 'Dra. María García',
      horario: '10:15 - 13:00',
      fecha: '2025-01-15',
      horaIngreso: '10:18',
      horaSalida: null,
      estado: 'en_curso',
    },
  ])

  const handleRegistrarEntrada = useCallback((materiaId: string | number) => {
    const materia = materiasDisponibles.find(m => m.id === materiaId)
    if (!materia) return

    const ahora = new Date()
    const horaActual = ahora.toTimeString().slice(0, 5)
    const fechaActual = ahora.toISOString().split('T')[0]

    const asistenciaExistente = asistencias.find(
      a => a.materia === materia.nombre && a.fecha === fechaActual
    )

    if (asistenciaExistente) {
      alert('Ya existe un registro de entrada para esta materia hoy')
      return
    }

    setAsistencias(prev => [
      ...prev,
      {
        id: Date.now(),
        materia: materia.nombre,
        docente: materia.docente,
        horario: materia.horario,
        fecha: fechaActual,
        horaIngreso: horaActual,
        horaSalida: null,
        estado: 'en_curso',
      },
    ])
  }, [asistencias, materiasDisponibles])

  const handleRegistrarSalida = useCallback((asistenciaId: string | number) => {
    const ahora = new Date()
    const horaActual = ahora.toTimeString().slice(0, 5)

    setAsistencias(prev =>
      prev.map(a =>
        a.id === asistenciaId
          ? { ...a, horaSalida: horaActual, estado: 'completo' }
          : a
      )
    )
  }, [])

  const handleRegistrar = useCallback(() => {
    if (!selectedMateria) return

    const materia = materiasDisponibles.find(m => String(m.id) === selectedMateria)
    if (!materia) return

    const ahora = new Date()
    const horaActual = ahora.toTimeString().slice(0, 5)
    const fechaActual = ahora.toISOString().split('T')[0]

    if (tipoRegistro === 'entrada') {
      handleRegistrarEntrada(materia.id)
    } else {
      const asistenciaExistente = asistencias.find(
        a => a.materia === materia.nombre && a.fecha === fechaActual && !a.horaSalida
      )

      if (!asistenciaExistente) {
        alert('No existe un registro de entrada para esta materia hoy')
        return
      }

      handleRegistrarSalida(asistenciaExistente.id)
    }

    setIsRegistrarModalOpen(false)
    setSelectedMateria('')
    setTipoRegistro('entrada')
  }, [selectedMateria, tipoRegistro, handleRegistrarEntrada, handleRegistrarSalida, asistencias, materiasDisponibles])

  const asistenciasHoy = asistencias.filter(
    a => a.fecha === new Date().toISOString().split('T')[0]
  )

  return {
    materiasDisponibles,
    asistencias,
    asistenciasHoy,
    isRegistrarModalOpen,
    setIsRegistrarModalOpen,
    selectedMateria,
    setSelectedMateria,
    tipoRegistro,
    setTipoRegistro,
    handleRegistrarEntrada,
    handleRegistrarSalida,
    handleRegistrar,
  }
}

