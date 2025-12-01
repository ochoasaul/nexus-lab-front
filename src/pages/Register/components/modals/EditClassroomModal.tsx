import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useAulas } from '@/hooks/useAulas'
import type { ClassroomDetailItem } from '@/services/classroomDetailService'

interface EditClassroomModalProps {
  isOpen: boolean
  onClose: () => void
  classroom: ClassroomDetailItem
  onSubmit: (id: string | number, data: {
    aula_id?: string | number
    capacidad_alumnos?: number
    num_computadoras?: number
    proyector_instalado?: boolean
    aire_acondicionado?: boolean
  }) => Promise<void>
}

export function EditClassroomModal({
  isOpen,
  onClose,
  classroom,
  onSubmit,
}: EditClassroomModalProps) {
  const { aulas, isLoading: isLoadingAulas } = useAulas()
  const [aulaId, setAulaId] = useState<string>(classroom.aula_id ? String(classroom.aula_id) : '')
  const [capacidadAlumnos, setCapacidadAlumnos] = useState<number>(classroom.capacidad_alumnos)
  const [numComputadoras, setNumComputadoras] = useState<number | undefined>(classroom.num_computadoras || undefined)
  const [proyectorInstalado, setProyectorInstalado] = useState(classroom.proyector_instalado)
  const [aireAcondicionado, setAireAcondicionado] = useState(classroom.aire_acondicionado)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (classroom) {
      setAulaId(classroom.aula_id ? String(classroom.aula_id) : '')
      setCapacidadAlumnos(classroom.capacidad_alumnos)
      setNumComputadoras(classroom.num_computadoras || undefined)
      setProyectorInstalado(classroom.proyector_instalado)
      setAireAcondicionado(classroom.aire_acondicionado)
    }
  }, [classroom])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (capacidadAlumnos <= 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(classroom.id, {
        aula_id: aulaId || undefined,
        capacidad_alumnos: capacidadAlumnos,
        num_computadoras: numComputadoras || undefined,
        proyector_instalado: proyectorInstalado,
        aire_acondicionado: aireAcondicionado,
      })
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Classroom" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Classroom
          </label>
          {isLoadingAulas ? (
            <p className="text-sm text-charcoal-500">Loading classrooms...</p>
          ) : (
            <select
              value={aulaId}
              onChange={(e) => setAulaId(e.target.value)}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            >
              <option value="">Select classroom (optional)</option>
              {aulas.map((aula) => (
                <option key={aula.id} value={String(aula.id)}>
                  {aula.nombre}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Student Capacity <span className="text-primary-600">*</span>
          </label>
          <input
            type="number"
            value={capacidadAlumnos}
            onChange={(e) => setCapacidadAlumnos(parseInt(e.target.value) || 0)}
            required
            min="1"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Number of Computers
          </label>
          <input
            type="number"
            value={numComputadoras || ''}
            onChange={(e) => setNumComputadoras(e.target.value ? parseInt(e.target.value) : undefined)}
            min="0"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={proyectorInstalado}
              onChange={(e) => setProyectorInstalado(e.target.checked)}
              className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-charcoal-700">Projector Installed</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={aireAcondicionado}
              onChange={(e) => setAireAcondicionado(e.target.checked)}
              className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-charcoal-700">Air Conditioning</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancel"
            onClick={onClose}
          />
          <Button
            type="submit"
            label="Update"
            variant="primary"
            disabled={capacidadAlumnos <= 0 || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

