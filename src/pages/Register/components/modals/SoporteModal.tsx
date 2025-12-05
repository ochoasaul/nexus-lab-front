import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Modal } from '../../../../components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personService, type Person } from '@/services/personService'
import { useCreateSupport } from '@/hooks/useSupport'

interface SupportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SupportModal({
  isOpen,
  onClose,
  onSuccess,
}: SupportModalProps) {
  const [problem, setProblem] = useState('')
  const [solution, setSolution] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { mutate: createSupport, isPending: isSubmitting } = useCreateSupport()

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await personService.search(searchQuery.trim(), 1, 20)
        setSearchResults(results)
      } catch (err: any) {
        console.error('Error searching persons:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!problem.trim()) {
      setError('Problem is required')
      return
    }

    if (!selectedPerson) {
      setError('You must select a requester')
      return
    }

    createSupport(
      {
        problem: problem.trim(),
        solution: solution.trim() || undefined,
        date_time: dateTime || undefined,
        requester_person_id: String(selectedPerson.id),
      },
      {
        onSuccess: () => {
          resetForm()
          onClose()
          onSuccess?.()
        },
      }
    )
  }

  const resetForm = () => {
    setProblem('')
    setSolution('')
    setDateTime('')
    setSearchQuery('')
    setSearchResults([])
    setSelectedPerson(null)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Register Support"
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Date and Time
          </label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
        </div>

        {/* Problem */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Problem <span className="text-primary-600">*</span>
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none resize-none"
            placeholder="Describe the problem..."
            required
          />
        </div>

        {/* Solution */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Solution
          </label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none resize-none"
            placeholder="Describe the applied solution..."
          />
        </div>

        {/* Requester */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Requester <span className="text-primary-600">*</span>
          </label>
          {!selectedPerson ? (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                placeholder="Search person (name, last name or ID)..."
              />
              {isSearching && (
                <p className="mt-2 text-sm text-charcoal-500">Searching...</p>
              )}
              {searchResults.length > 0 && (
                <div className="mt-2 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-3 space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((person) => (
                    <button
                      type="button"
                      key={person.id}
                      className="w-full rounded-xl border border-transparent bg-white px-4 py-2 text-left text-sm text-charcoal-800 hover:border-primary-200 hover:bg-primary-25"
                      onClick={() => {
                        setSelectedPerson(person)
                        setSearchResults([])
                        setSearchQuery(`${person.first_name} ${person.last_name}`)
                      }}
                    >
                      <span className="font-medium">{person.first_name} {person.last_name}</span>
                      {person.identity_card && (
                        <span className="ml-2 text-xs text-charcoal-500">ID: {person.identity_card}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-primary-100 bg-primary-25 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-700">
                  {selectedPerson.first_name} {selectedPerson.last_name}
                </p>
                {selectedPerson.identity_card && (
                  <p className="text-xs text-primary-600">ID: {selectedPerson.identity_card}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                label="Change"
                onClick={() => {
                  setSelectedPerson(null)
                  setSearchQuery('')
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label="Register Support"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Saving..."
          />
        </div>
      </form>
    </Modal>
  )
}

