import { useState, FormEvent, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { type Product, type CreateInventoryDto } from '@/services/inventoryService'
import { useInventory } from '@/hooks/useInventory'

interface CreateInventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateInventoryDto) => Promise<void>
  laboratoryId?: string
}

export function CreateInventoryModal({
  isOpen,
  onClose,
  onSubmit,
  laboratoryId,
}: CreateInventoryModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [baseCode, setBaseCode] = useState('')
  const [quantity, setQuantity] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingInventory, setExistingInventory] = useState<{ quantity: number } | null>(null)

  // Hooks
  const { searchProduct, inventory } = useInventory(laboratoryId)

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
        const results = await searchProduct(searchQuery.trim())
        setSearchResults(results)
      } catch (err: any) {
        console.error('Error searching products:', err)
      } finally {
        setIsSearching(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchQuery, searchProduct])

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product)
    setName(product.name)
    setDescription(product.description || '')
    setBaseCode(product.base_code || '')
    setSearchResults([])
    setSearchQuery('')

    // Check if inventory already exists for this product
    if (inventory) {
      const existing = inventory.find(
        inv => inv.product_id?.toString() === product.id.toString()
      )
      if (existing) {
        setExistingInventory({ quantity: existing.quantity })
      } else {
        setExistingInventory(null)
      }
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setBaseCode('')
    setQuantity(1)
    setSearchQuery('')
    setSearchResults([])
    setSelectedProduct(null)
    setError(null)
    setExistingInventory(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Product name is required')
      return
    }

    if (quantity <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        base_code: baseCode.trim() || undefined,
        quantity,
        laboratory_id: laboratoryId,
      })
      resetForm()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error creating inventory')
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
      title="Add to Inventory"
      size="lg"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Search existing product */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Search existing product (optional)
          </label>
          {!selectedProduct ? (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                placeholder="Search by name or code..."
              />
              {isSearching && (
                <p className="mt-2 text-sm text-charcoal-500">Searching...</p>
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
                      <span className="font-medium">{product.name}</span>
                      {product.base_code && (
                        <span className="ml-2 text-xs text-charcoal-500">
                          Code: {product.base_code}
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
                <p className="text-sm font-semibold text-primary-700">{selectedProduct.name}</p>
                {selectedProduct.base_code && (
                  <p className="text-xs text-primary-600">Code: {selectedProduct.base_code}</p>
                )}
                {existingInventory && (
                  <p className="text-xs text-primary-600 mt-1">
                    Current quantity in inventory: {existingInventory.quantity}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                label="Change"
                onClick={() => {
                  setSelectedProduct(null)
                  setExistingInventory(null)
                }}
              />
            </div>
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Product Name <span className="text-primary-600">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ex: Dell Laptop"
            required
            disabled={!!selectedProduct}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none resize-none"
            placeholder="Product description..."
            disabled={!!selectedProduct}
          />
        </div>

        {/* Base Code */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Base Code (optional)
          </label>
          <input
            type="text"
            value={baseCode}
            onChange={(e) => setBaseCode(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            placeholder="Ex: LAP-DELL-001"
            disabled={!!selectedProduct}
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Quantity <span className="text-primary-600">*</span>
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            min="1"
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
            required
          />
        </div>

        {existingInventory && (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
            <p className="text-sm text-sky-700">
              <strong>Note:</strong> This product already exists in the inventory. The specified quantity
              will be added to the current quantity ({existingInventory.quantity}).
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="ghost"
            label="Cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            label="Add to Inventory"
            variant="primary"
            loading={isSubmitting}
            isLoadingText="Saving..."
          />
        </div>
      </form>
    </Modal>
  )
}

