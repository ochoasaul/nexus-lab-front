import { useState, FormEvent, useEffect, ChangeEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { inventoryService, type Producto, type CreateInventoryDto } from '@/services/inventoryService'

interface CreateInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateInventoryDto) => Promise<void>
  laboratorioId?: string
}

export function CreateInventoryModal({
  isOpen,
  onClose,
  onSubmit,
  laboratorioId,
}: CreateInventoryModalProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [codigoBase, setCodigoBase] = useState('')
  const [cantidad, setCantidad] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Producto[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingInventory, setExistingInventory] = useState<{ cantidad: number } | null>(null)

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await inventoryService.searchProduct(searchQuery.trim())
        setSearchResults(results)
      } catch (err: any) {
        console.error('Error al buscar productos:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handleSelectProduct = async (product: Producto) => {
    setSelectedProduct(product)
    setNombre(product.nombre)
    setDescripcion(product.descripcion || '')
    setCodigoBase(product.codigo_base || '')
    setSearchResults([])
    setSearchQuery('')

    // Verificar si ya existe inventario para este producto
    try {
      const inventory = await inventoryService.getAll(laboratorioId)
      const existing = inventory.find(
        inv => inv.producto_id?.toString() === product.id.toString()
      )
      if (existing) {
        setExistingInventory({ cantidad: existing.cantidad })
      } else {
        setExistingInventory(null)
      }
    } catch (err) {
      console.error('Error al verificar inventario existente:', err)
    }
  }

  const resetForm = () => {
    setNombre('')
    setDescripcion('')
    setCodigoBase('')
    setCantidad(1)
    setSearchQuery('')
    setSearchResults([])
    setSelectedProduct(null)
    setError(null)
    setExistingInventory(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nombre.trim()) {
      setError('El nombre del producto es requerido')
      return
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        codigo_base: codigoBase.trim() || undefined,
        cantidad,
        laboratorio_id: laboratorioId,
      })
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al crear el inventario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar al inventario"
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Buscar producto existente */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Buscar producto existente (opcional)
          </label>
          {!selectedProduct ? (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                placeholder="Buscar por nombre o código..."
              />
              {isSearching && (
                <p className="mt-2 text-sm text-charcoal-500">Buscando...</p>
              )}
              {searchResults.length > 0 && (
                <div className="mt-2 rounded-2xl border border-charcoal-100 bg-charcoal-50 p-3 space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      className="w-full rounded-xl border border-transparent bg-white px-4 py-2 text-left text-sm text-charcoal-800 hover:border-primary-200 hover:bg-primary-25"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <span className="font-medium">{product.nombre}</span>
                      {product.codigo_base && (
                        <span className="ml-2 text-xs text-charcoal-500">
                          Código: {product.codigo_base}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-primary-100 bg-primary-25 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-700">{selectedProduct.nombre}</p>
                {selectedProduct.codigo_base && (
                  <p className="text-xs text-primary-600">Código: {selectedProduct.codigo_base}</p>
                )}
                {existingInventory && (
                  <p className="text-xs text-primary-600 mt-1">
                    Cantidad actual en inventario: {existingInventory.cantidad}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                label="Cambiar"
                onClick={() => {
                  setSelectedProduct(null)
                  setExistingInventory(null)
                }}
              />
            </div>
          )}
        </div>

        {/* Nombre del producto */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Nombre del producto <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ej: Laptop Dell"
            required
            disabled={!!selectedProduct}
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none resize-none"
            placeholder="Descripción del producto..."
            disabled={!!selectedProduct}
          />
        </div>

        {/* Código base */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Código base (opcional)
          </label>
          <input
            type="text"
            value={codigoBase}
            onChange={(e) => setCodigoBase(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ej: LAP-DELL-001"
            disabled={!!selectedProduct}
          />
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Cantidad <span className="text-primary-600">*</span>
          </label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
            min="1"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          />
        </div>

        {existingInventory && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm text-sky-700">
              <strong>Nota:</strong> Este producto ya existe en el inventario. Se agregará la cantidad
              especificada a la cantidad actual ({existingInventory.cantidad}).
            </p>
          </div>
        )}

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
            label="Agregar al inventario"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Guardando..."
          />
        </div>
      </form>
    </Modal>
  )
}

