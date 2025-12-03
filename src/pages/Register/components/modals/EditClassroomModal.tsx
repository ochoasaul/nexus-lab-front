import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useClassrooms } from '@/hooks/useClassrooms'
import type { ClassroomDetailItem } from '@/services/classroomDetailService'

interface EditClassroomModalProps {
  isOpen: boolean
  onClose: () => void
  classroom: ClassroomDetailItem
  onSubmit: (id: string | number, data: {
    classroom_id?: string | number
    student_capacity?: number
    computer_count?: number
    projector_installed?: boolean
    air_conditioning?: boolean
  }) => Promise<void>
}

export function EditClassroomModal({
  isOpen,
  onClose,
  classroom,
  onSubmit,
}: EditClassroomModalProps) {
  const { classrooms, isLoading: isLoadingClassrooms } = useClassrooms()
  const [classroomId, setClassroomId] = useState<string>(classroom.classroom_id ? String(classroom.classroom_id) : '')
  const [studentCapacity, setStudentCapacity] = useState<number>(classroom.student_capacity)
  const [computerCount, setComputerCount] = useState<number | undefined>(classroom.computer_count || undefined)
  const [projectorInstalled, setProjectorInstalled] = useState(classroom.projector_installed)
  const [airConditioning, setAirConditioning] = useState(classroom.air_conditioning)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (classroom) {
      setClassroomId(classroom.classroom_id ? String(classroom.classroom_id) : '')
      setStudentCapacity(classroom.student_capacity)
      setComputerCount(classroom.computer_count || undefined)
      setProjectorInstalled(classroom.projector_installed)
      setAirConditioning(classroom.air_conditioning)
    }
  }, [classroom])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (studentCapacity <= 0) return

    setIsSubmitting(true)
    try {
      await onSubmit(classroom.id, {
        classroom_id: classroomId || undefined,
        student_capacity: studentCapacity,
        computer_count: computerCount || undefined,
        projector_installed: projectorInstalled,
        air_conditioning: airConditioning,
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
          {isLoadingClassrooms ? (
            <p className="text-sm text-charcoal-500">Loading classrooms...</p>
          ) : (
            <select
              value={classroomId}
              onChange={(e) => setClassroomId(e.target.value)}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            >
              <option value="">Select classroom (optional)</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={String(classroom.id)}>
                  {classroom.name}
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
            value={studentCapacity}
            onChange={(e) => setStudentCapacity(parseInt(e.target.value) || 0)}
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
            value={computerCount || ''}
            onChange={(e) => setComputerCount(e.target.value ? parseInt(e.target.value) : undefined)}
            min="0"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={projectorInstalled}
              onChange={(e) => setProjectorInstalled(e.target.checked)}
              className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-charcoal-700">Projector Installed</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={airConditioning}
              onChange={(e) => setAirConditioning(e.target.checked)}
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
            disabled={studentCapacity <= 0 || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

