import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personaService, type Persona } from '@/services/personaService'

interface TeacherRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    persona_id?: string | number
    estado?: string
  }) => Promise<void>
}

export function TeacherRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}: TeacherRegistrationModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [estado, setEstado] = useState<string>('activo')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timer = setTimeout(async () => {
        try {
          const results = await personaService.search(searchQuery)
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
    if (!selectedPersona) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        persona_id: selectedPersona.id,
        estado: estado || undefined,
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
    setSelectedPersona(null)
    setEstado('activo')
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
              {searchResults.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => {
                    setSelectedPersona(persona)
                    setSearchQuery(`${persona.nombre} ${persona.apellido}`)
                    setSearchResults([])
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-charcoal-50"
                >
                  {persona.nombre} {persona.apellido} {persona.carnet && `(${persona.carnet})`}
                </button>
              ))}
            </div>
          )}
          {selectedPersona && (
            <p className="mt-2 text-sm text-charcoal-600">
              Selected: {selectedPersona.nombre} {selectedPersona.apellido}
            </p>
          )}
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
            onClick={handleClose}
          />
          <Button
            type="submit"
            label="Register"
            variant="primary"
            disabled={!selectedPersona || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

