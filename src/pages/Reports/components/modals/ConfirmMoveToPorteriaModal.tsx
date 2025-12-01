import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { type LostObjectItem } from '@/services/lostObjectService'

interface ConfirmMoveToPorteriaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  lostObjects: LostObjectItem[]
  isLoading?: boolean
}

export function ConfirmMoveToPorteriaModal({
  isOpen,
  onClose,
  onConfirm,
  lostObjects,
  isLoading = false,
}: ConfirmMoveToPorteriaModalProps) {
  const perdidos = lostObjects.filter(obj => obj.estado === 'Perdido')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar movimiento a Portería"
      size="md"
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm text-charcoal-700 mb-4">
            ¿Estás seguro de mover todos los objetos perdidos a portería?
          </p>
          <p className="text-sm font-semibold text-charcoal-900 mb-3">
            Se moverán {perdidos.length} objeto{perdidos.length !== 1 ? 's' : ''}:
          </p>
          <div className="max-h-64 overflow-y-auto rounded-2xl border border-charcoal-200 bg-charcoal-50 p-4">
            <ul className="space-y-2">
              {perdidos.map((obj) => (
                <li key={obj.id} className="text-sm text-charcoal-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-charcoal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{obj.objeto}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancelar"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            type="button"
            label="Confirmar"
            variant="primary"
            onClick={onConfirm}
            loading={isLoading}
            isLoadingText="Moviendo..."
          />
        </div>
      </div>
    </Modal>
  )
}

