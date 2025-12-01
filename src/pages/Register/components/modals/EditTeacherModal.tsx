import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import type { TeacherItem } from '@/services/teacherService'

interface EditTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  teacher: TeacherItem
  onSubmit: (id: string | number, data: {
    persona_id?: string | number
    estado?: string
  }) => Promise<void>
}

export function EditTeacherModal({
  isOpen,
  onClose,
  teacher,
  onSubmit,
}: EditTeacherModalProps) {
  const [estado, setEstado] = useState<string>(teacher.estado || 'activo')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (teacher) {
      setEstado(teacher.estado || 'activo')
    }
  }, [teacher])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await onSubmit(teacher.id, {
        persona_id: teacher.persona_id || undefined,
        estado: estado || undefined,
      })
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Teacher" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Teacher
          </label>
          <div className="rounded-2xl border border-charcoal-200 bg-charcoal-50 px-4 py-2.5">
            <p className="text-charcoal-900">
              {teacher.persona
                ? `${teacher.persona.nombre} ${teacher.persona.apellido || ''}`.trim()
                : 'Unassigned Teacher'}
            </p>
            {teacher.persona?.carnet && (
              <p className="text-xs text-charcoal-500 mt-1">ID: {teacher.persona.carnet}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Status
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="activo">Active</option>
            <option value="inactivo">Inactive</option>
            <option value="pendiente">Pending</option>
          </select>
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
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

