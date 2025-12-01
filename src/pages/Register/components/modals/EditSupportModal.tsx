import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import type { SoporteMateriaItem, SoporteTecnicoItem } from '@/services/soporteService'

interface EditSupportModalProps {
  isOpen: boolean
  onClose: () => void
  support: SoporteMateriaItem | SoporteTecnicoItem
  type: 'materia' | 'tecnico'
  onSubmit: (data: {
    tipo: string
    problema: string
    solucion?: string
    fecha_hora?: string
    persona_solicitante_id?: string
  }) => Promise<void>
}

export function EditSupportModal({
  isOpen,
  onClose,
  support,
  type,
  onSubmit,
}: EditSupportModalProps) {
  const [problema, setProblema] = useState(support.problema || '')
  const [solucion, setSolucion] = useState(support.solucion || '')
  const [fechaHora, setFechaHora] = useState(
    support.fecha_hora ? new Date(support.fecha_hora).toISOString().slice(0, 16) : ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (support) {
      setProblema(support.problema || '')
      setSolucion(support.solucion || '')
      setFechaHora(
        support.fecha_hora ? new Date(support.fecha_hora).toISOString().slice(0, 16) : ''
      )
    }
  }, [support])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!problema.trim()) return

    setIsSubmitting(true)
    try {
      const data: any = {
        tipo: type === 'materia' ? 'Soporte de Materia' : 'Soporte Técnico',
        problema: problema.trim(),
        solucion: solucion.trim() || undefined,
        fecha_hora: fechaHora || undefined,
      }

      if (type === 'tecnico' && 'persona' in support && support.persona) {
        data.persona_solicitante_id = String(support.persona.id)
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
            value={problema}
            onChange={(e) => setProblema(e.target.value)}
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
            value={solucion}
            onChange={(e) => setSolucion(e.target.value)}
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
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
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
            disabled={!problema.trim() || isSubmitting}
          />
        </div>
      </form>
    </Modal>
  )
}

