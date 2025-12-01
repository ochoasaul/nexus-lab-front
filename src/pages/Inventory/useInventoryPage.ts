import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLaboratorios } from '@/hooks/useLaboratorios'
import { useInventory } from '@/hooks/useInventory'
import { inventoryService, type CreateInventoryDto, type UpdateInventoryDto, type InventarioItem } from '@/services/inventoryService'
import { useToastStore } from '@/store/toastStore'

export function useInventoryPage() {
  const { user } = useAuth()
  const { laboratorios, isLoading: isLoadingLabs } = useLaboratorios()
  const [selectedLaboratorioId, setSelectedLaboratorioId] = useState<string | undefined>(undefined)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventarioItem | null>(null)
  const addToast = useToastStore((state) => state.addToast)

  // Determinar si es super_admin
  const isSuperAdmin = useMemo(() => {
    if (!user?.rol) return false
    const rolArray = Array.isArray(user.rol) ? user.rol : [user.rol]
    return rolArray.some(r => r.nombre === 'super_admin')
  }, [user])

  // Determinar el laboratorio_id a usar
  const laboratorioIdToUse = useMemo(() => {
    if (isSuperAdmin) {
      return selectedLaboratorioId
    }
    return user?.laboratorio_id ? String(user.laboratorio_id) : undefined
  }, [isSuperAdmin, selectedLaboratorioId, user])

  const { inventory, isLoading, error, refetch } = useInventory(laboratorioIdToUse)

  const handleCreate = useCallback(async (data: CreateInventoryDto) => {
    try {
      await inventoryService.create({
        ...data,
        laboratorio_id: laboratorioIdToUse,
      })
      await refetch()
      addToast('Producto agregado al inventario exitosamente', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error al agregar el producto', 'error')
      throw error
    }
  }, [laboratorioIdToUse, refetch, addToast])

  const handleUpdate = useCallback(async (id: string | number, data: UpdateInventoryDto) => {
    try {
      await inventoryService.update(id, data)
      await refetch()
      addToast('Inventario actualizado exitosamente', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error al actualizar el inventario', 'error')
      throw error
    }
  }, [refetch, addToast])

  const handleDelete = useCallback(async (id: string | number) => {
    if (!confirm('¿Estás seguro de eliminar este item del inventario?')) {
      return
    }

    try {
      await inventoryService.remove(id)
      await refetch()
      addToast('Item eliminado del inventario exitosamente', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error al eliminar el item', 'error')
    }
  }, [refetch, addToast])

  const handleEdit = useCallback((item: InventarioItem) => {
    setSelectedInventoryItem(item)
    setIsEditModalOpen(true)
  }, [])

  const handleCloseEdit = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedInventoryItem(null)
  }, [])

  const selectedLaboratorio = useMemo(() => {
    if (!selectedLaboratorioId) return null
    return laboratorios.find(l => String(l.id) === selectedLaboratorioId) || null
  }, [selectedLaboratorioId, laboratorios])

  return {
    user,
    isSuperAdmin,
    laboratorios,
    isLoadingLabs,
    selectedLaboratorioId,
    setSelectedLaboratorioId,
    selectedLaboratorio,
    inventory,
    isLoading,
    error,
    laboratorioIdToUse,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedInventoryItem,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCloseEdit,
  }
}

