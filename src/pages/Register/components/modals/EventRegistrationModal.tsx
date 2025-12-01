import { useState, FormEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useAulas } from '@/hooks/useAulas'

interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    nombre: string
    aula_ids: (string | number)[]
    fecha_evento: string
    hora_inicio: string
    hora_fin: string
  }) => Promise<void>
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}: EventRegistrationModalProps) {
  const { aulas, isLoading: isLoadingAulas } = useAulas()
  const [nombre, setNombre] = useState('')
  const [selectedAulaIds, setSelectedAulaIds] = useState<string[]>([])
  const [fechaEvento, setFechaEvento] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || selectedAulaIds.length === 0 || !fechaEvento || !horaInicio || !horaFin) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        nombre: nombre.trim(),
        aula_ids: selectedAulaIds.map(id => Number(id)),
        fecha_evento: fechaEvento,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      })
      resetForm()
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setNombre('')
    setSelectedAulaIds([])
    setFechaEvento('')
    setHoraInicio('')
    setHoraFin('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const toggleAula = (aulaId: string) => {
    setSelectedAulaIds(prev =>
      prev.includes(aulaId)
        ? prev.filter(id => id !== aulaId)
        : [...prev, aulaId]
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Register Event" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Event Name <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Enter event name"
            required
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Event Date <span className="text-primary-600">*</span>
          </label>
          <input
            type="date"
            value={fechaEvento}
            onChange={(e) => setFechaEvento(e.target.value)}
            required
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Start Time <span className="text-primary-600">*</span>
            </label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              End Time <span className="text-primary-600">*</span>
            </label>
            <input
              type="time"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Occupied Classrooms <span className="text-primary-600">*</span>
          </label>
          {isLoadingAulas ? (
            <p className="text-sm text-charcoal-500">Loading classrooms...</p>
          ) : (
            <div className="max-h-40 overflow-y-auto rounded-xl border border-charcoal-200 bg-white p-2">
              {aulas.map((aula) => (
                <label
                  key={aula.id}
                  className="flex items-center gap-3 p-2 hover:bg-charcoal-50 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAulaIds.includes(String(aula.id))}
                    onChange={() => toggleAula(String(aula.id))}
                    className="w-5 h-5 rounded border-charcoal-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-charcoal-700">{aula.nombre}</span>
                </label>
              ))}
            </div>
          )}
          {selectedAulaIds.length > 0 && (
            <p className="mt-2 text-sm text-charcoal-600">
              {selectedAulaIds.length} classroom(s) selected
            </p>
          )}
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
            disabled={!nombre.trim() || selectedAulaIds.length === 0 || !fechaEvento || !horaInicio || !horaFin || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

