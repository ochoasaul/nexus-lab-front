import { useState, useEffect, useRef } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { type Person } from '@/services/personService'
import { type LostObjectItem } from '@/services/lostObjectService'
import { CreatePersonModal } from '@/components/modals/CreatePersonModal'
import { usePersonSearch } from '@/hooks/usePersonSearch'

interface DeliverLostObjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { person_id: string; evidence: File }) => Promise<void> | void
  lostObject: LostObjectItem | null
}

export function DeliverLostObjectModal({ isOpen, onClose, onSubmit, lostObject }: DeliverLostObjectModalProps) {
  const [step, setStep] = useState(1)
  const [evidence, setEvidence] = useState<File | null>(null)
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    isSearching,
    clearSearch
  } = usePersonSearch()

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [isCreatePersonModalOpen, setIsCreatePersonModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setEvidence(null)
      setEvidencePreview(null)
      clearSearch()
      setSelectedPerson(null)
      setError(null)
    }
  }, [isOpen, clearSearch])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setEvidence(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEvidencePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!selectedPerson || !evidence) {
      setError('Por favor, selecciona una persona y sube una evidencia.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({
        person_id: String(selectedPerson.id),
        evidence: evidence
      })
      onClose()
    } catch (err: any) {
      console.error('Error delivering object:', err)
      setError(err.message || 'Error al entregar el objeto')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!lostObject) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Entregar Objeto Perdido"
      size="md"
    >
      <div className="space-y-6">
        {/* Object Summary */}
        <div className="bg-charcoal-50 p-4 rounded-xl border border-charcoal-100 flex gap-4 items-start">
          {lostObject.multimedia ? (
            <img
              src={lostObject.multimedia.path}
              alt={lostObject.object}
              className="w-16 h-16 rounded-lg object-cover border border-charcoal-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-charcoal-200 flex items-center justify-center text-charcoal-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div>
            <h4 className="font-medium text-charcoal-900">{lostObject.object}</h4>
            <div className="text-sm text-charcoal-500 mt-1">
              Encontrado: {lostObject.found_date || 'Fecha desconocida'}
            </div>
            <div className="text-sm text-charcoal-500">
              Aula: {lostObject.classroom?.name || 'Desconocida'}
            </div>
          </div>
        </div>

        {/* Step 1: Search Person */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1">
                ¿Quién retira el objeto?
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedPerson ? `${selectedPerson.first_name} ${selectedPerson.last_name}` : searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  readOnly={!!selectedPerson}
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${selectedPerson
                    ? 'border-primary-200 bg-primary-50 text-primary-900 pr-10'
                    : 'border-charcoal-200 focus:border-primary-500'
                    }`}
                  placeholder="Buscar por nombre o CI..."
                />

                {isSearching && !selectedPerson && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                  </div>
                )}

                {selectedPerson && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPerson(null)
                      clearSearch()
                    }}
                    className="absolute right-3 top-2.5 text-charcoal-400 hover:text-red-500 p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {/* Dropdown results */}
                {(searchResults.length > 0 || (searchQuery && !selectedPerson && !isSearching)) && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-charcoal-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {searchResults.map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-charcoal-50 text-sm"
                        onClick={() => {
                          setSelectedPerson(person)
                          setSearchResults([])
                          setSearchQuery('')
                        }}
                      >
                        <div className="font-medium">{person.first_name} {person.last_name}</div>
                        {person.identity_card && (
                          <div className="text-xs text-charcoal-500">CI: {person.identity_card}</div>
                        )}
                      </button>
                    ))}

                    {/* Create Option */}
                    <button
                      className="w-full text-left px-4 py-2 text-primary-600 hover:bg-primary-50 font-medium border-t border-charcoal-100 flex items-center gap-2"
                      onClick={() => {
                        setIsCreatePersonModalOpen(true)
                        setSearchResults([])
                      }}
                    >
                      <span>+</span>
                      {searchResults.length === 0 && searchQuery ? (
                        <span>Crear persona: "{searchQuery}"</span>
                      ) : (
                        <span>Crear Nueva Persona</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                label="Siguiente"
                onClick={() => setStep(2)}
                disabled={!selectedPerson}
              />
            </div>
          </div>
        )}

        {/* Step 2: Evidence */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Evidencia de Entrega (Foto)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                                    ${evidencePreview ? 'border-primary-300 bg-primary-50' : 'border-charcoal-200 hover:border-primary-300 hover:bg-charcoal-50'}
                                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {evidencePreview ? (
                  <div className="relative">
                    <img
                      src={evidencePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-sm"
                    />
                    <div className="mt-2 text-sm text-primary-700 font-medium">
                      Clic para cambiar imagen
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 text-charcoal-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-charcoal-500">
                      <span className="text-primary-600 font-medium">Subir una foto</span> o arrastrar y soltar
                    </div>
                    <p className="text-xs text-charcoal-400">PNG, JPG hasta 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                label="Atrás"
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              />
              <Button
                label={isSubmitting ? "Entregando..." : "Confirmar Entrega"}
                onClick={handleSubmit}
                disabled={!evidence || isSubmitting}
              />
            </div>
          </div>
        )}
      </div>

      <CreatePersonModal
        isOpen={isCreatePersonModalOpen}
        onClose={() => setIsCreatePersonModalOpen(false)}
        onSuccess={(person) => {
          setSelectedPerson(person)
          setSearchQuery(`${person.first_name} ${person.last_name}`)
          setIsCreatePersonModalOpen(false)
        }}
      />
    </Modal>
  )
}
