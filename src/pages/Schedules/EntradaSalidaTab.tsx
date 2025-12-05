import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/modals/BaseModal'
import { useEntradaSalida } from './useEntradaSalida'

export function EntradaSalidaTab() {
  const {
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
  } = useEntradaSalida()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isTimeWithinWindow = (scheduleStr: string, type: 'entry' | 'exit') => {
    if (!scheduleStr) return false
    const [startStr, endStr] = scheduleStr.split(' - ')
    const targetStr = type === 'entry' ? startStr : endStr
    if (!targetStr) return false

    const [targetHour, targetMinute] = targetStr.split(':').map(Number)
    const targetDate = new Date(currentTime)
    targetDate.setHours(targetHour, targetMinute, 0, 0)

    const diffMinutes = (currentTime.getTime() - targetDate.getTime()) / (1000 * 60)
    return Math.abs(diffMinutes) <= 30
  }

  const attendedSchedules = schedules.filter(s => s.attendance)

  if (isLoading) {
    return <div className="p-8 text-center text-charcoal-500">Cargando horarios...</div>
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Registro de asistencia</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Entradas y salidas de docentes</h3>
          <p className="text-sm text-charcoal-500">
            Registra y visualiza las entradas y salidas de los docentes.
          </p>
        </div>
        <Button
          label="Registrar entrada/salida"
          variant="secondary"
          onClick={() => setIsRegistrarModalOpen(true)}
        />
      </div>

      {/* Lista de materias disponibles para registro rápido */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-charcoal-700 mb-3">Registro rápido</h3>
        {schedules.length === 0 ? (
          <p className="text-sm text-charcoal-500">No hay materias programadas para hoy.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {schedules.map((schedule) => {
              const isEntryEnabled = !schedule.attendance && isTimeWithinWindow(schedule.schedule, 'entry')
              const isExitEnabled = schedule.attendance && !schedule.attendance.exit_time && isTimeWithinWindow(schedule.schedule, 'exit')

              return (
                <article
                  key={schedule.id}
                  className="rounded-2xl border border-charcoal-100 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-charcoal-900">{schedule.subject.name}</h4>
                      <p className="text-sm text-charcoal-600 mt-1">
                        {schedule.teacher.person.first_name} {schedule.teacher.person.last_name}
                      </p>
                      <p className="text-xs text-charcoal-500 mt-1">{schedule.schedule}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!schedule.attendance ? (
                        isEntryEnabled ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => handleRegistrarEntrada(schedule.id)}
                              className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-charcoal-700">Entrada</span>
                          </label>
                        ) : (
                          <span className="text-xs text-charcoal-400 italic">Entrada no disponible</span>
                        )
                      ) : (
                        <>
                          <div className="text-xs text-charcoal-500">
                            <p>Entrada: <span className="text-primary-600">{formatTime(schedule.attendance.entry_time)}</span></p>
                          </div>
                          {!schedule.attendance.exit_time ? (
                            isExitEnabled ? (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={false}
                                  onChange={() => handleRegistrarSalida(schedule.attendance!.id)}
                                  className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-charcoal-700">Salida</span>
                              </label>
                            ) : (
                              <span className="text-xs text-charcoal-400 italic">Salida no disponible</span>
                            )
                          ) : (
                            <div className="text-xs text-charcoal-500">
                              <p>Salida: <span className="text-primary-600">{formatTime(schedule.attendance.exit_time)}</span></p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* Lista de asistencias registradas */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-charcoal-700 mb-3">Registros del día</h3>
        {attendedSchedules.length === 0 ? (
          <p className="text-sm text-charcoal-500 text-center py-8">
            No hay registros de entrada y salida hoy.
          </p>
        ) : (
          attendedSchedules.map((schedule) => (
            <article
              key={schedule.id}
              className="rounded-2xl border border-charcoal-100 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-charcoal-900">{schedule.subject.name}</h4>
                    <StatusBadge
                      label={
                        schedule.attendance?.state === 'Completed'
                          ? 'Completo'
                          : schedule.attendance?.state === 'Present'
                            ? 'En curso'
                            : 'Pendiente'
                      }
                    />
                  </div>
                  <div className="space-y-1 text-sm text-charcoal-600">
                    <p>
                      <span className="font-medium">Docente:</span> {schedule.teacher.person.first_name} {schedule.teacher.person.last_name}
                    </p>
                    <p>
                      <span className="font-medium">Horario:</span> {schedule.schedule}
                    </p>
                    <p>
                      <span className="font-medium">Fecha:</span>{' '}
                      {new Date(schedule.attendance!.date).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <p>
                        <span className="font-medium">Entrada:</span>{' '}
                        <span className="text-primary-600">{formatTime(schedule.attendance!.entry_time)}</span>
                      </p>
                      {schedule.attendance!.exit_time ? (
                        <p>
                          <span className="font-medium">Salida:</span>{' '}
                          <span className="text-primary-600">{formatTime(schedule.attendance!.exit_time)}</span>
                        </p>
                      ) : (
                        <p className="text-charcoal-400">Salida: Pendiente</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Modal para registrar entrada/salida */}
      <Modal
        isOpen={isRegistrarModalOpen}
        onClose={() => {
          setIsRegistrarModalOpen(false)
          setSelectedMateria('')
          setTipoRegistro('entrada')
        }}
        title="Registrar entrada/salida"
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Tipo de registro
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoRegistro('entrada')}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${tipoRegistro === 'entrada'
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-primary-200'
                  }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipoRegistro('salida')}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${tipoRegistro === 'salida'
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-primary-200'
                  }`}
              >
                Salida
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Materia <span className="text-primary-600">*</span>
            </label>
            <select
              value={selectedMateria}
              onChange={(e) => setSelectedMateria(e.target.value)}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            >
              <option value="">Seleccionar materia</option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={String(schedule.id)}>
                  {schedule.subject.name} - {schedule.teacher.person.first_name} {schedule.teacher.person.last_name} ({schedule.schedule})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
            <Button
              type="button"
              variant="ghost"
              label="Cancelar"
              onClick={() => {
                setIsRegistrarModalOpen(false)
                setSelectedMateria('')
                setTipoRegistro('entrada')
              }}
            />
            <Button
              type="button"
              label={tipoRegistro === 'entrada' ? 'Registrar entrada' : 'Registrar salida'}
              variant="primary"
              onClick={handleRegistrar}
              disabled={!selectedMateria}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
