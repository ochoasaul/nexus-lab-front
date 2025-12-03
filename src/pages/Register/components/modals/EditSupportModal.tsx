import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import type { SupportSubjectItem, SupportTechnicalItem } from '@/services/supportService'

interface EditSupportModalProps {
  isOpen: boolean
  onClose: () => void
  support: SupportSubjectItem | SupportTechnicalItem
  type: 'subject' | 'technical'
  onSubmit: (data: {
    type: string
    problem: string
    solution?: string
    date_time?: string
    requester_person_id?: string
  }) => Promise<void>
}

export function EditSupportModal({
  isOpen,
  onClose,
  support,
  type,
  onSubmit,
}: EditSupportModalProps) {
  const [problem, setProblem] = useState(support.problem || '')
  const [solution, setSolution] = useState(support.solution || '')
  const [dateTime, setDateTime] = useState(
    support.date_time ? new Date(support.date_time).toISOString().slice(0, 16) : ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (support) {
      setProblem(support.problem || '')
      setSolution(support.solution || '')
      setDateTime(
        support.date_time ? new Date(support.date_time).toISOString().slice(0, 16) : ''
      )
    }
  }, [support])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!problem.trim()) return

    setIsSubmitting(true)
    try {
      const data: any = {
        type: type === 'subject' ? 'Subject Support' : 'Technical Support',
        problem: problem.trim(),
        solution: solution.trim() || undefined,
        date_time: dateTime || undefined,
      }

      if (type === 'technical' && 'person' in support && support.person) {
        data.requester_person_id = String(support.person.id)
      }

      await onSubmit(data)
      onClose()
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Support" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Problem <span className="text-primary-600">*</span>
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Describe the problem"
            required
            rows={4}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Solution
          </label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Describe the solution (optional)"
            rows={4}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
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
            disabled={!problem.trim() || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

