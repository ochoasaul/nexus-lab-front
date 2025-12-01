import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { SCHEDULE_TIMES } from '@/constants/scheduleTimes'

interface Aula {
  id: string | number
  nombre: string
}

interface MateriaData {
  id?: string | number
  nombre: string
  docente: string
  aula: string
  horario: string
  tipoDias: string
  fechaInicio: string
  fechaFin: string
  estado?: 'activo' | 'inactivo'
}

interface MateriaModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<MateriaData, 'id' | 'estado'>) => void
  materia?: MateriaData | null
  aulas?: Aula[]
  isLoadingAulas?: boolean
}

const TIPO_DIAS_OPTIONS = [
  { value: 'Modular', label: 'Modular' },
  { value: 'Viernes-Sábado', label: 'Viernes-Sábado' },
  { value: 'Martes-Jueves', label: 'Martes-Jueves' },
  { value: 'Lunes-Miércoles', label: 'Lunes-Miércoles' },
  { value: 'Sábado', label: 'Sábado' },
]

export function MateriaModal({
  isOpen,
  onClose,
  onSubmit,
  materia,
  aulas = [],
  isLoadingAulas = false,
}: MateriaModalProps) {
  const [nombre, setNombre] = useState('')
  const [docente, setDocente] = useState('')
  const [aulaId, setAulaId] = useState<string>('')
  const [horario, setHorario] = useState<string>('')
  const [tipoDias, setTipoDias] = useState<string>('')
  const [fechaInicio, setFechaInicio] = useState<string>('')
  const [fechaFin, setFechaFin] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (materia) {
      setNombre(materia.nombre)
      setDocente(materia.docente)
      setAulaId(String(materia.aula))
      setHorario(materia.horario)
      setTipoDias(materia.tipoDias)
      setFechaInicio(materia.fechaInicio)
      setFechaFin(materia.fechaFin)
    } else {
      resetForm()
    }
  }, [materia, isOpen])

  const resetForm = () => {
    setNombre('')
    setDocente('')
    setAulaId('')
    setHorario('')
    setTipoDias('')
    setFechaInicio('')
    setFechaFin('')
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nombre.trim()) {
      setError('El nombre de la materia es requerido')
      return
    }
    if (!docente.trim()) {
      setError('El nombre del docente es requerido')
      return
    }
    if (!aulaId) {
      setError('Debes seleccionar un aula')
      return
    }
    if (!horario) {
      setError('Debes seleccionar un horario')
      return
    }
    if (!tipoDias) {
      setError('Debes seleccionar el tipo de días')
      return
    }
    if (!fechaInicio) {
      setError('La fecha de inicio es requerida')
      return
    }
    if (!fechaFin) {
      setError('La fecha de fin es requerida')
      return
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      setError('La fecha de inicio debe ser anterior a la fecha de fin')
      return
    }

    setIsSubmitting(true)
    try {
      const selectedAula = aulas.find(a => String(a.id) === aulaId)
      await onSubmit({
        nombre: nombre.trim(),
        docente: docente.trim(),
        aula: selectedAula?.nombre || '',
        horario,
        tipoDias,
        fechaInicio,
        fechaFin,
      })
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar la materia')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={materia ? 'Editar materia' : 'Agregar materia'}
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Nombre de la materia */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Nombre de la materia <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ej: Programación I"
            required
          />
        </div>

        {/* Nombre del docente */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Nombre del docente <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={docente}
            onChange={(e) => setDocente(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ej: Dr. Juan Pérez"
            required
          />
        </div>

        {/* Aula */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Aula <span className="text-primary-600">*</span>
          </label>
          {isLoadingAulas ? (
            <p className="text-sm text-charcoal-500">Cargando aulas...</p>
          ) : (
            <select
              value={aulaId}
              onChange={(e) => setAulaId(e.target.value)}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              required
            >
              <option value="">Seleccionar aula</option>
              {aulas.map((aula) => (
                <option key={aula.id} value={String(aula.id)}>
                  {aula.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Horario */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Horario <span className="text-primary-600">*</span>
          </label>
          <select
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          >
            <option value="">Seleccionar horario</option>
            {SCHEDULE_TIMES.map((schedule) => (
              <option key={schedule.id} value={schedule.label}>
                {schedule.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de días */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Tipo de días <span className="text-primary-600">*</span>
          </label>
          <select
            value={tipoDias}
            onChange={(e) => setTipoDias(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          >
            <option value="">Seleccionar tipo de días</option>
            {TIPO_DIAS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Fecha de inicio <span className="text-primary-600">*</span>
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              max={fechaFin || undefined}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Fecha de fin <span className="text-primary-600">*</span>
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              min={fechaInicio || undefined}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancelar"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label={materia ? 'Guardar cambios' : 'Agregar materia'}
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Guardando..."
          />
        </div>
      </form>
    </Modal>
  )
}

