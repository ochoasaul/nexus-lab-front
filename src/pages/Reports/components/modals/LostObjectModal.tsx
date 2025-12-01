import { useState, FormEvent, ChangeEvent, useRef } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import { ImagePreviewModal } from './ImagePreviewModal'
import Button from '@/components/ui/Button/Button'
import { ImageIcon } from '@/components/icons/Icons'
import { SCHEDULE_TIMES } from '@/constants/scheduleTimes'

interface LostObjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LostObjectFormData) => void | Promise<void>
  aulas?: Array<{ id: string | number; nombre: string }>
  isLoadingAulas?: boolean
  aulasError?: string | null
}

export interface LostObjectFormData {
  objeto: string
  fecha_encontrado: string
  horario_encontrado: string
  aula_id: string
  multimedia?: File | null
}

export function LostObjectModal({
  isOpen,
  onClose,
  onSubmit,
  aulas = [],
  isLoadingAulas = false,
  aulasError = null,
}: LostObjectModalProps) {
  const [formData, setFormData] = useState<LostObjectFormData>({
    objeto: '',
    fecha_encontrado: new Date().toISOString().split('T')[0],
    horario_encontrado: '',
    aula_id: '',
    multimedia: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof LostObjectFormData, string>>>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof LostObjectFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, multimedia: file }))
    
    // Crear preview de la imagen
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      if (errors.multimedia) {
        setErrors((prev) => ({ ...prev, multimedia: undefined }))
      }
    } else {
      setPreviewImage(null)
    }
  }

  const handleImageClick = () => {
    if (previewImage) {
      setIsPreviewOpen(true)
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, multimedia: null }))
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LostObjectFormData, string>> = {}

    if (!formData.objeto.trim()) {
      newErrors.objeto = 'El objeto es requerido'
    }

    if (!formData.multimedia) {
      newErrors.multimedia = 'La imagen es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      // Reset form
      setFormData({
        objeto: '',
        fecha_encontrado: new Date().toISOString().split('T')[0],
        horario_encontrado: '',
        aula_id: '',
        multimedia: null,
      })
      setPreviewImage(null)
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error al registrar objeto perdido:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        objeto: '',
        fecha_encontrado: new Date().toISOString().split('T')[0],
        horario_encontrado: '',
        aula_id: '',
        multimedia: null,
      })
      setPreviewImage(null)
      setErrors({})
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrar Objeto Perdido" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1">
            Objeto <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            name="objeto"
            value={formData.objeto}
            onChange={handleChange}
            className={`w-full rounded-2xl border ${
              errors.objeto ? 'border-red-300' : 'border-charcoal-200'
            } bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none`}
            placeholder="Ej: Tarjeta de acceso, Laptop, etc."
            required
          />
          {errors.objeto && (
            <p className="mt-1 text-sm text-red-600">{errors.objeto}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Fecha encontrado
            </label>
            <input
              type="date"
              name="fecha_encontrado"
              value={formData.fecha_encontrado}
              onChange={handleChange}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-1">
              Horario encontrado
            </label>
            <select
              name="horario_encontrado"
              value={formData.horario_encontrado}
              onChange={handleChange}
              className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            >
              <option value="">Seleccionar horario</option>
              {SCHEDULE_TIMES.map((schedule) => (
                <option key={schedule.id} value={schedule.label}>
                  {schedule.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1">
            Aula
          </label>
            <select
              name="aula_id"
              value={formData.aula_id}
              onChange={handleChange}
              disabled={isLoadingAulas}
              className={`w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none ${
                isLoadingAulas ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="">
                {isLoadingAulas ? 'Cargando aulas...' : 'Seleccionar aula'}
              </option>
              {aulasError ? (
                <option value="" disabled>
                  Error al cargar aulas
                </option>
              ) : (
                aulas.map((aula) => (
                  <option key={aula.id} value={aula.id}>
                    {aula.nombre}
                  </option>
                ))
              )}
            </select>
            {aulasError && (
              <p className="mt-1 text-sm text-red-600">{aulasError}</p>
            )}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-1">
            Imagen del objeto <span className="text-primary-600">*</span>
          </label>
          <p className="text-xs text-charcoal-500 mb-2">Solo se puede subir una imagen</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full rounded-2xl border ${
              errors.multimedia ? 'border-red-300' : 'border-charcoal-200'
            } bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-600 hover:file:bg-primary-100`}
            required
          />
          {errors.multimedia && (
            <p className="mt-1 text-sm text-red-600">{errors.multimedia}</p>
          )}
          
          {formData.multimedia && (
            <div className="mt-3">
              <div className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-4">
                <div 
                  className="flex items-center gap-4 cursor-pointer group"
                  onClick={handleImageClick}
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <ImageIcon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal-900 truncate">
                      {formData.multimedia.name}
                    </p>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      Click para ver la imagen
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage()
                    }}
                    className="ml-2 text-sm text-red-600 hover:text-red-700 font-medium flex-shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            label="Cancelar"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label="Registrar"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Registrando..."
          />
        </div>
      </form>
      
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrl={previewImage || ''}
        imageName={formData.multimedia?.name}
      />
    </Modal>
  )
}

