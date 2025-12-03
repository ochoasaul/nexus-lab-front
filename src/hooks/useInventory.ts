import { useState, useEffect, useCallback } from 'react'
import { inventoryService, type InventoryItem } from '@/services/inventoryService'

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

  return {
    inventory,
    isLoading,
    error,
    refetch: fetchInventory,
  }
}

