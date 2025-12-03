import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personService, type Person } from '@/services/personService'
import { ImagePreviewModal } from './ImagePreviewModal'

interface DeliverLostObjectModalProps {
  isOpen: boolean
  onClose: () => void
  lostObject?: {
    id: string | number
    object: string
    multimedia?: {
      id: string | number
      path: string
      name?: string | null
    } | null
  } | null
  onSubmit: (params: { person_id: string; evidence: File }) => Promise<void>
}

export function DeliverLostObjectModal({
  isOpen,
  onClose,
  lostObject,
  onSubmit,
}: DeliverLostObjectModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Person[]>([])
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [evidence, setEvidence] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true)
      setSearchError(null)
      try {
        const results = await personService.search(searchQuery.trim())
        setSearchResults(results)
      } catch (error: any) {
        setSearchError(error.message || 'Error searching for people')
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleEvidenceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setEvidence(file)
    setFormError(null)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreviewImage(null)
    }
  }

  const resetEvidence = () => {
    setEvidence(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selectedPerson) {
      setFormError('Select the person picking up the object')
      return
    }
    if (!evidence) {
      setFormError('Evidence (image) is required')
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    try {
      await onSubmit({ person_id: String(selectedPerson.id), evidence })
      onClose()
      resetForm()
    } catch (error: any) {
      setFormError(error.message || 'Could not register delivery')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedPerson(null)
    setEvidence(null)
    setPreviewImage(null)
    setIsSubmitting(false)
    setFormError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Deliver object${lostObject ? `: ${lostObject.object}` : ''}`}
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {lostObject?.multimedia?.path && (
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Found Object Photo
            </label>
            <div className="relative w-full rounded-2xl border border-charcoal-200 bg-charcoal-50 overflow-hidden">
              <img
                src={lostObject.multimedia.path}
                alt={lostObject.object}
                className="w-full h-auto max-h-64 object-contain cursor-pointer"
                onClick={() => setIsPreviewOpen(true)}
              />
            </div>
            <button
              type="button"
              className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              onClick={() => setIsPreviewOpen(true)}
            >
              View full image
            </button>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Search person (name, last name or ID)
          </label>
          <input
            type="text"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ex: John, Doe, 123456"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchError && (
            <p className="mt-2 text-sm text-red-600">{searchError}</p>
          )}
        </div>

        {isSearching && (
          <p className="text-sm text-charcoal-500">Searching people...</p>
        )}

        {!selectedPerson && searchResults.length > 0 && (
          <div className="rounded-2xl border border-charcoal-100 bg-charcoal-50 p-3 space-y-2 max-h-48 overflow-y-auto">
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
                  <span className="ml-2 text-xs text-charcoal-500">CI: {person.identity_card}</span>
                )}
              </button>
            ))}
          </div>
        )}

        {selectedPerson && (
          <div className="rounded-2xl border border-primary-100 bg-primary-25 p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary-700">
                {selectedPerson.first_name} {selectedPerson.last_name}
              </p>
              {selectedPerson.identity_card && (
                <p className="text-xs text-primary-600">CI: {selectedPerson.identity_card}</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              label="Change"
              onClick={() => setSelectedPerson(null)}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1">
            Delivery Evidence (image) <span className="text-primary-600">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleEvidenceChange}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100"
            required
          />
          {evidence && (
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-charcoal-200 bg-charcoal-50 px-4 py-2">
              <p className="text-sm text-charcoal-700 truncate">{evidence.name}</p>
              <div className="space-x-2">
                <button
                  type="button"
                  className="text-sm text-primary-600 hover:text-primary-700"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  View
                </button>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:text-red-700"
                  onClick={resetEvidence}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {formError && (
          <p className="text-sm text-red-600">{formError}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancel"
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label="Register Delivery"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Saving..."
          />
        </div>
      </form>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewImage || lostObject?.multimedia?.path || ''}
        imageName={evidence?.name || lostObject?.multimedia?.name || lostObject?.object}
      />
    </Modal>
  )
}



