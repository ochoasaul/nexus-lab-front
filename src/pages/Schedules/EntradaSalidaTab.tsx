import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Modal } from '@/components/modals/BaseModal'

// Tipos temporales hasta que tengamos el backend
interface AsistenciaDocente {
  id: string | number
  materia: string
  docente: string
  horario: string
  fecha: string
  horaIngreso: string
  horaSalida?: string | null
  estado: string
}

interface MateriaOption {
  id: string | number
  nombre: string
  docente: string
  horario: string
}

export function EntradaSalidaTab() {
  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false)
  const [selectedMateria, setSelectedMateria] = useState<string>('')
  const [tipoRegistro, setTipoRegistro] = useState<'entrada' | 'salida'>('entrada')
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

  // Materias disponibles para registro rápido
  const materiasDisponibles: MateriaOption[] = [
    { id: 1, nombre: 'Programación I', docente: 'Dr. Juan Pérez', horario: '7:15 - 10:00' },
    { id: 2, nombre: 'Base de Datos', docente: 'Dra. María García', horario: '10:15 - 13:00' },
    { id: 3, nombre: 'Redes', docente: 'Ing. Carlos López', horario: '13:00 - 16:00' },
  ]

  const handleRegistrarEntrada = (materiaId: string | number) => {
    const materia = materiasDisponibles.find(m => m.id === materiaId)
    if (!materia) return

    const ahora = new Date()
    const horaActual = ahora.toTimeString().slice(0, 5)
    const fechaActual = ahora.toISOString().split('T')[0]

    // Buscar si ya existe una asistencia para esta materia hoy
    const asistenciaExistente = asistencias.find(
      a => a.materia === materia.nombre && a.fecha === fechaActual
    )

    if (asistenciaExistente) {
      alert('Ya existe un registro de entrada para esta materia hoy')
      return
    }

    // Crear nueva entrada
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
  }

  const handleRegistrarSalida = (asistenciaId: string | number) => {
    const ahora = new Date()
    const horaActual = ahora.toTimeString().slice(0, 5)

    setAsistencias(prev =>
      prev.map(a =>
        a.id === asistenciaId
          ? { ...a, horaSalida: horaActual, estado: 'completo' }
          : a
      )
    )
  }

  const handleRegistrar = () => {
    if (!selectedMateria) return

    const materia = materiasDisponibles.find(m => String(m.id) === selectedMateria)
    if (!materia) return

    const ahora = new Date()
    const horaActual = ahora.toTimeString().slice(0, 5)
    const fechaActual = ahora.toISOString().split('T')[0]

    if (tipoRegistro === 'entrada') {
      handleRegistrarEntrada(materia.id)
    } else {
      // Registrar salida
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
        <div className="grid gap-3 md:grid-cols-2">
          {materiasDisponibles.map((materia) => {
            const asistenciaHoy = asistencias.find(
              a => a.materia === materia.nombre && a.fecha === new Date().toISOString().split('T')[0]
            )
            return (
              <article
                key={materia.id}
                className="rounded-2xl border border-charcoal-100 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-charcoal-900">{materia.nombre}</h4>
                    <p className="text-sm text-charcoal-600 mt-1">{materia.docente}</p>
                    <p className="text-xs text-charcoal-500 mt-1">{materia.horario}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!asistenciaHoy ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => handleRegistrarEntrada(materia.id)}
                          className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-charcoal-700">Entrada</span>
                      </label>
                    ) : (
                      <>
                        <div className="text-xs text-charcoal-500">
                          <p>Entrada: <span className="text-primary-600">{asistenciaHoy.horaIngreso}</span></p>
                        </div>
                        {!asistenciaHoy.horaSalida && (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => handleRegistrarSalida(asistenciaHoy.id)}
                              className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-charcoal-700">Salida</span>
                          </label>
                        )}
                        {asistenciaHoy.horaSalida && (
                          <div className="text-xs text-charcoal-500">
                            <p>Salida: <span className="text-primary-600">{asistenciaHoy.horaSalida}</span></p>
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
      </div>

      {/* Lista de asistencias registradas */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-charcoal-700 mb-3">Registros del día</h3>
        {asistencias.filter(a => a.fecha === new Date().toISOString().split('T')[0]).length === 0 ? (
          <p className="text-sm text-charcoal-500 text-center py-8">
            No hay registros de entrada y salida hoy.
          </p>
        ) : (
          asistencias
            .filter(a => a.fecha === new Date().toISOString().split('T')[0])
            .map((asistencia) => (
              <article
                key={asistencia.id}
                className="rounded-2xl border border-charcoal-100 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-charcoal-900">{asistencia.materia}</h4>
                      <StatusBadge
                        label={
                          asistencia.estado === 'completo'
                            ? 'Completo'
                            : asistencia.estado === 'en_curso'
                            ? 'En curso'
                            : 'Pendiente'
                        }
                      />
                    </div>
                    <div className="space-y-1 text-sm text-charcoal-600">
                      <p>
                        <span className="font-medium">Docente:</span> {asistencia.docente}
                      </p>
                      <p>
                        <span className="font-medium">Horario:</span> {asistencia.horario}
                      </p>
                      <p>
                        <span className="font-medium">Fecha:</span>{' '}
                        {new Date(asistencia.fecha).toLocaleDateString()}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <p>
                          <span className="font-medium">Entrada:</span>{' '}
                          <span className="text-primary-600">{asistencia.horaIngreso}</span>
                        </p>
                        {asistencia.horaSalida ? (
                          <p>
                            <span className="font-medium">Salida:</span>{' '}
                            <span className="text-primary-600">{asistencia.horaSalida}</span>
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

      {asistencias.length === 0 && (
        <p className="text-center text-sm text-charcoal-500 py-8">
          No hay registros de entrada y salida.
        </p>
      )}

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
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                  tipoRegistro === 'entrada'
                    ? 'border-primary-400 bg-primary-50 text-primary-700'
                    : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-primary-200'
                }`}
              >
                Entrada
              </button>
              <button
                type="button"
                onClick={() => setTipoRegistro('salida')}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                  tipoRegistro === 'salida'
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
              {materiasDisponibles.map((materia) => (
                <option key={materia.id} value={String(materia.id)}>
                  {materia.nombre} - {materia.docente} ({materia.horario})
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
