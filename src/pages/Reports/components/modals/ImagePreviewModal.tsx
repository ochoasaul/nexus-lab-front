import { Modal } from '@/components/modals/BaseModal'

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string | null
  imageName?: string
  title?: string
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  imageName,
  title = 'Vista previa de imagen',
}: ImagePreviewModalProps) {
  if (!imageUrl) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-full max-h-[70vh] overflow-hidden rounded-2xl border border-charcoal-200 bg-charcoal-50">
          <img
            src={imageUrl}
            alt={imageName || title}
            className="w-full h-auto object-contain max-h-[70vh]"
          />
        </div>
        {imageName && (
          <p className="mt-4 text-sm text-charcoal-600">{imageName}</p>
        )}
      </div>
    </Modal>
  )
}

