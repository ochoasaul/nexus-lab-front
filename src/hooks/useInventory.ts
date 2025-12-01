import { useState, useEffect, useCallback } from 'react'
import { inventoryService, type InventarioItem } from '@/services/inventoryService'

export function useInventory(laboratorioId?: string) {
  const [inventory, setInventory] = useState<InventarioItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await inventoryService.getAll(laboratorioId)
      setInventory(data)
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar el inventario'
      setError(errorMessage)
      console.error('Error al cargar inventario:', err)
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

