import { useState, FormEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useClassrooms } from '@/hooks/useClassrooms'

interface ClassroomRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    classroom_id?: string | number
    student_capacity: number
    computer_count?: number
    projector_installed: boolean
    air_conditioning: boolean
  }) => Promise<void>
}

export function ClassroomRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}: ClassroomRegistrationModalProps) {
  const { classrooms, isLoading: isLoadingClassrooms } = useClassrooms()
  const [classroomId, setClassroomId] = useState<string>('')
  const [studentCapacity, setStudentCapacity] = useState<number>(0)
  const [computerCount, setComputerCount] = useState<number | undefined>(undefined)
  const [projectorInstalled, setProjectorInstalled] = useState(false)
  const [airConditioning, setAirConditioning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (studentCapacity <= 0) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        classroom_id: classroomId || undefined,
        student_capacity: studentCapacity,
        computer_count: computerCount || undefined,
        projector_installed: projectorInstalled,
        air_conditioning: airConditioning,
      })
      resetForm()
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setClassroomId('')
    setStudentCapacity(0)
    setComputerCount(undefined)
    setProjectorInstalled(false)
    setAirConditioning(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Register Classroom" size="md">
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
            placeholder="Enter student capacity"
            required
            min="1"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
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
            placeholder="Enter number of computers (optional)"
            min="0"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
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
            onClick={handleClose}
          />
          <Button
            type="submit"
            label="Register"
            variant="primary"
            disabled={studentCapacity <= 0 || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

