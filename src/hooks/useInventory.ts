import { useState, useEffect, useCallback } from 'react'
import { inventoryService, type InventoryItem, type CreateInventoryDto, type UpdateInventoryDto, type Product } from '@/services/inventoryService'

export function useInventory(laboratorioId?: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await inventoryService.getAll(laboratorioId)
      setInventory(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Error loading inventory'
      setError(errorMessage)
      console.error('Error loading inventory:', err)
    } finally {
      setIsLoading(false)
    }
  }, [laboratorioId])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  const searchProduct = useCallback(async (query: string): Promise<Product[]> => {
    try {
      return await inventoryService.searchProduct(query)
    } catch (err: any) {
      throw new Error(err.message || 'Error searching products')
    }
  }, [])

  const createInventory = useCallback(async (data: CreateInventoryDto) => {
    try {
      await inventoryService.create(data)
      await fetchInventory()
    } catch (err: any) {
      throw new Error(err.message || 'Error creating inventory')
    }
  }, [fetchInventory])

  const updateInventory = useCallback(async (id: string | number, data: UpdateInventoryDto) => {
    try {
      await inventoryService.update(id, data)
      await fetchInventory()
    } catch (err: any) {
      throw new Error(err.message || 'Error updating inventory')
    }
  }, [fetchInventory])

  return {
    inventory,
    isLoading,
    error,
    refetch: fetchInventory,
    searchProduct,
    createInventory,
    updateInventory
  }
}

