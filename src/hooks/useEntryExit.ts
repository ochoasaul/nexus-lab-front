import { useState, useEffect, useCallback } from 'react'
import { teacherAttendanceService, DailySchedule } from '@/services/teacherAttendanceService'

export function useEntryExit() {
  const [schedules, setSchedules] = useState<DailySchedule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
  const [selectedMateria, setSelectedMateria] = useState<string>('')
  const [tipoRegistro, setTipoRegistro] = useState<'entrada' | 'salida'>('entrada')

  const fetchSchedules = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await teacherAttendanceService.getDailySchedule()
      setSchedules(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const handleRegistrarEntrada = async (subjectTeacherId: number) => {
    try {
      await teacherAttendanceService.registerEntry(subjectTeacherId)
      fetchSchedules()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error registering entry')
    }
  }

  const handleRegistrarSalida = async (attendanceId: number) => {
    try {
      await teacherAttendanceService.registerExit(attendanceId)
      fetchSchedules()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error registering exit')
    }
  }

  const handleRegistrar = async () => {
    if (!selectedMateria) return

    const schedule = schedules.find(s => String(s.id) === selectedMateria)
    if (!schedule) return

    if (tipoRegistro === 'entrada') {
      await handleRegistrarEntrada(schedule.id)
    } else {
      if (!schedule.attendance) {
        alert('No entry record found for this subject')
        return
      }
      await handleRegistrarSalida(schedule.attendance.id)
    }

    setIsRegistrarModalOpen(false)
    setSelectedMateria('')
    setTipoRegistro('entrada')
  }

  return {
    schedules,
    isLoading,
    isRegistrarModalOpen,
    setIsRegistrarModalOpen,
    selectedMateria,
    setSelectedMateria,
    tipoRegistro,
    setTipoRegistro,
    handleRegistrarEntrada,
    handleRegistrarSalida,
    handleRegistrar,
    refresh: fetchSchedules
  }
}

