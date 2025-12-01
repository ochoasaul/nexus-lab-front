import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useAulas } from '@/hooks/useAulas'
import type { EventItem } from '@/services/eventService'

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  event: EventItem
  onSubmit: (id: string | number, data: {
    nombre?: string
    aula_ids?: (string | number)[]
    fecha_evento?: string
    hora_inicio?: string
    hora_fin?: string
  }) => Promise<void>
}

export function EditEventModal({
  isOpen,
  onClose,
  event,
  onSubmit,
}: EditEventModalProps) {
  const { aulas, isLoading: isLoadingAulas } = useAulas()
  const [nombre, setNombre] = useState(event.nombre)
  const [selectedAulaIds, setSelectedAulaIds] = useState<string[]>(
    event.aulas ? event.aulas.map(a => String(a.id)) : []
  )
  const [fechaEvento, setFechaEvento] = useState(
    event.fecha_evento ? new Date(event.fecha_evento).toISOString().split('T')[0] : ''
  )
  const [horaInicio, setHoraInicio] = useState(event.hora_inicio)
  const [horaFin, setHoraFin] = useState(event.hora_fin)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (event) {
      setNombre(event.nombre)
      setSelectedAulaIds(event.aulas ? event.aulas.map(a => String(a.id)) : [])
      setFechaEvento(event.fecha_evento ? new Date(event.fecha_evento).toISOString().split('T')[0] : '')
      setHoraInicio(event.hora_inicio)
      setHoraFin(event.hora_fin)
    }
  }, [event])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || selectedAulaIds.length === 0 || !fechaEvento || !horaInicio || !horaFin) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(event.id, {
        nombre: nombre.trim(),
        aula_ids: selectedAulaIds.map(id => Number(id)),
        fecha_evento: fechaEvento,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
      })
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleAula = (aulaId: string) => {
    setSelectedAulaIds(prev =>
      prev.includes(aulaId)
        ? prev.filter(id => id !== aulaId)
        : [...prev, aulaId]
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Event" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Event Name <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
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
            onClick={onClose}
          />
          <Button
            type="submit"
            label="Update"
            variant="primary"
            disabled={!nombre.trim() || selectedAulaIds.length === 0 || !fechaEvento || !horaInicio || !horaFin || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

