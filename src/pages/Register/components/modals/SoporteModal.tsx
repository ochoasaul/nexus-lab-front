import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import { Modal } from '../../../../components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personaService, type Persona } from '@/services/personaService'

export type SoporteType = 'materia' | 'tecnico'

interface SoporteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    tipo: SoporteType
    problema: string
    solucion?: string
    fecha_hora?: string
    persona_solicitante_id?: string
  }) => Promise<void>
}

export function SoporteModal({
  isOpen,
  onClose,
  onSubmit,
}: SoporteModalProps) {
  const [soporteType, setSoporteType] = useState<SoporteType>('materia')
  const [problema, setProblema] = useState('')
  const [solucion, setSolucion] = useState('')
  const [fechaHora, setFechaHora] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await personaService.search(searchQuery.trim())
        setSearchResults(results)
      } catch (err: any) {
        console.error('Error al buscar personas:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!problema.trim()) {
      setError('El problema es requerido')
      return
    }

    if (soporteType === 'tecnico' && !selectedPersona) {
      setError('Debes seleccionar una persona solicitante para soporte técnico')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        tipo: soporteType,
        problema: problema.trim(),
        solucion: solucion.trim() || undefined,
        fecha_hora: fechaHora || undefined,
        persona_solicitante_id: selectedPersona ? String(selectedPersona.id) : undefined,
      })
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al registrar el soporte')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSoporteType('materia')
    setProblema('')
    setSolucion('')
    setFechaHora('')
    setSearchQuery('')
    setSearchResults([])
    setSelectedPersona(null)
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
      title="Registrar Soporte"
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Tipo de soporte */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Tipo de soporte <span className="text-primary-600">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSoporteType('materia')
                setSelectedPersona(null)
                setSearchQuery('')
                setSearchResults([])
              }}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                soporteType === 'materia'
                  ? 'border-primary-400 bg-primary-50 text-primary-700'
                  : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-primary-200'
              }`}
            >
              Soporte de Materia
            </button>
            <button
              type="button"
              onClick={() => {
                setSoporteType('tecnico')
              }}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                soporteType === 'tecnico'
                  ? 'border-primary-400 bg-primary-50 text-primary-700'
                  : 'border-charcoal-200 bg-white text-charcoal-700 hover:border-primary-200'
              }`}
            >
              Soporte Técnico
            </button>
          </div>
        </div>

        {/* Problema */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Problema <span className="text-primary-600">*</span>
          </label>
          <textarea
            value={problema}
            onChange={(e) => setProblema(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none resize-none"
            placeholder="Describe el problema..."
            required
          />
        </div>

        {/* Solución (opcional) */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Solución (opcional)
          </label>
          <textarea
            value={solucion}
            onChange={(e) => setSolucion(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none resize-none"
            placeholder="Describe la solución aplicada..."
          />
        </div>

        {/* Fecha y hora (opcional) */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Fecha y hora (opcional)
          </label>
          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
        </div>

        {/* Persona solicitante (solo para soporte técnico) */}
        {soporteType === 'tecnico' && (
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Persona solicitante <span className="text-primary-600">*</span>
            </label>
            {!selectedPersona ? (
              <>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                  placeholder="Buscar persona (nombre, apellido o carnet)..."
                />
                {isSearching && (
                  <p className="mt-2 text-sm text-charcoal-500">Buscando...</p>
                )}
                {searchResults.length > 0 && (
                  <div className="mt-2 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-3 space-y-2 max-h-48 overflow-y-auto">
                    {searchResults.map((persona) => (
                      <button
                        type="button"
                        key={persona.id}
                        className="w-full rounded-xl border border-transparent bg-white px-4 py-2 text-left text-sm text-charcoal-800 hover:border-primary-200 hover:bg-primary-25"
                        onClick={() => {
                          setSelectedPersona(persona)
                          setSearchResults([])
                          setSearchQuery(`${persona.nombre} ${persona.apellido}`)
                        }}
                      >
                        <span className="font-medium">{persona.nombre} {persona.apellido}</span>
                        {persona.carnet && (
                          <span className="ml-2 text-xs text-charcoal-500">CI: {persona.carnet}</span>
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
                    {selectedPersona.nombre} {selectedPersona.apellido}
                  </p>
                  {selectedPersona.carnet && (
                    <p className="text-xs text-primary-600">CI: {selectedPersona.carnet}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  label="Cambiar"
                  onClick={() => {
                    setSelectedPersona(null)
                    setSearchQuery('')
                  }}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancelar"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label="Registrar soporte"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Guardando..."
          />
        </div>
      </form>
    </Modal>
  )
}

