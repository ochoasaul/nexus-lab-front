import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import type { TeacherItem } from '@/services/teacherService'

interface EditTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  teacher: TeacherItem
  onSubmit: (id: string | number, data: {
    person_id?: string | number
    state?: string
  }) => Promise<void>
}

export function EditTeacherModal({
  isOpen,
  onClose,
  teacher,
  onSubmit,
}: EditTeacherModalProps) {
  const [state, setState] = useState<string>(teacher.state || 'active')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (teacher) {
      setState(teacher.state || 'active')
    }
  }, [teacher])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    try {
      await onSubmit(teacher.id, {
        person_id: teacher.person_id || undefined,
        state: state || undefined,
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
              {teacher.person
                ? `${teacher.person.first_name} ${teacher.person.last_name || ''}`.trim()
                : 'Unassigned Teacher'}
            </p>
            {teacher.person?.identity_card && (
              <p className="text-xs text-charcoal-500 mt-1">ID: {teacher.person.identity_card}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Status
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
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

