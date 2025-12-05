import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personService, type Person } from '@/services/personService'

interface TeacherRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    person_id?: string | number
    state?: string
  }) => Promise<void>
}

export function TeacherRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}: TeacherRegistrationModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [state, setState] = useState<string>('active')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timer = setTimeout(async () => {
        try {
          const results = await personService.search(searchQuery, 1, 20)
          setSearchResults(results)
        } catch (error) {
          setSearchResults([])
        }
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedPerson) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        person_id: selectedPerson.id,
        state: state || undefined,
      })
      resetForm()
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedPerson(null)
    setState('active')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Register Teacher" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Person <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or ID"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
          />
          {searchResults.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-charcoal-200 bg-white">
              {searchResults.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => {
                    setSelectedPerson(person)
                    setSearchQuery(`${person.first_name} ${person.last_name}`)
                    setSearchResults([])
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-charcoal-50"
                >
                  {person.first_name} {person.last_name} {person.identity_card && `(${person.identity_card})`}
                </button>
              ))}
            </div>
          )}
          {selectedPerson && (
            <p className="mt-2 text-sm text-charcoal-600">
              Selected: {selectedPerson.first_name} {selectedPerson.last_name}
            </p>
          )}
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
            onClick={handleClose}
          />
          <Button
            type="submit"
            label="Register"
            variant="primary"
            disabled={!selectedPerson || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

