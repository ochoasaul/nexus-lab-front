import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary' | 'warning'
    isLoading?: boolean
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'primary',
    isLoading = false,
}: ConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-4">
                <p className="text-charcoal-600">{message}</p>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        label={cancelLabel}
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                    />
                    <Button
                        label={confirmLabel}
                        variant={variant === 'danger' ? 'danger' : variant === 'warning' ? 'secondary' : 'primary'}
                        onClick={onConfirm}
                        loading={isLoading}
                    />
                </div>
            </div>
        </Modal>
    )
}
