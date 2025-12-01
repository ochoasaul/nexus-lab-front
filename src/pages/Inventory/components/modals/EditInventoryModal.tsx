import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { type InventarioItem, type UpdateInventoryDto } from '@/services/inventoryService'

interface EditInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (id: string | number, data: UpdateInventoryDto) => Promise<void>
  inventoryItem: InventarioItem | null
}

export function EditInventoryModal({
  isOpen,
  onClose,
  onSubmit,
  inventoryItem,
}: EditInventoryModalProps) {
  const [cantidad, setCantidad] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (inventoryItem) {
      setCantidad(inventoryItem.cantidad)
    }
  }, [inventoryItem, isOpen])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!inventoryItem) return

    if (cantidad < 0) {
      setError('La cantidad no puede ser negativa')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(inventoryItem.id, { cantidad })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el inventario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setError(null)
    onClose()
  }

  if (!inventoryItem) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar inventario"
      size="md"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-4">
          <p className="text-sm font-medium text-charcoal-700 mb-1">Producto</p>
          <p className="text-lg font-semibold text-charcoal-900">
            {inventoryItem.producto?.nombre || 'Sin nombre'}
          </p>
          {inventoryItem.producto?.codigo_base && (
            <p className="text-xs text-charcoal-500 mt-1">
              Código: {inventoryItem.producto.codigo_base}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Cantidad <span className="text-primary-600">*</span>
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
            min="0"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

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
            label="Guardar cambios"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Guardando..."
          />
        </div>
      </form>
    </Modal>
  )
}

