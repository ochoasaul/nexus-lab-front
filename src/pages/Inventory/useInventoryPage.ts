import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLaboratories } from '@/hooks/useLaboratories'
import { useInventory } from '@/hooks/useInventory'
import { inventoryService, type CreateInventoryDto, type UpdateInventoryDto, type InventoryItem } from '@/services/inventoryService'
import { useToastStore } from '@/store/toastStore'

export function useInventoryPage() {
  const { user } = useAuth()
  const { laboratories, isLoading: isLoadingLabs } = useLaboratories()
  const [selectedLaboratoryId, setSelectedLaboratoryId] = useState<string | undefined>(undefined)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const addToast = useToastStore((state) => state.addToast)

  // Determinar si es super_admin
  const isSuperAdmin = useMemo(() => {
    if (!user?.role) return false
    const roleArray = Array.isArray(user.role) ? user.role : [user.role]
    return roleArray.some(r => r.name === 'super_admin')
  }, [user])

  // Determinar el laboratorio_id a usar
  const laboratoryIdToUse = useMemo(() => {
    if (isSuperAdmin) {
      return selectedLaboratoryId
    }
    return user?.laboratory_id ? String(user.laboratory_id) : undefined
  }, [isSuperAdmin, selectedLaboratoryId, user])

  const { inventory, isLoading, error, refetch } = useInventory(laboratoryIdToUse)

  const handleCreate = useCallback(async (data: CreateInventoryDto) => {
    try {
      await inventoryService.create({
        ...data,
        laboratory_id: laboratoryIdToUse,
      })
      await refetch()
      addToast('Product added successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error adding product', 'error')
      throw error
    }
  }, [laboratoryIdToUse, refetch, addToast])

  const handleUpdate = useCallback(async (id: string | number, data: UpdateInventoryDto) => {
    try {
      await inventoryService.update(id, data)
      await refetch()
      addToast('Inventory updated successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error updating inventory', 'error')
      throw error
    }
  }, [refetch, addToast])

  const handleDelete = useCallback(async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return
    }

    try {
      await inventoryService.remove(id)
      await refetch()
      addToast('Item deleted successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error deleting item', 'error')
    }
  }, [refetch, addToast])

  const handleEdit = useCallback((item: InventoryItem) => {
    setSelectedInventoryItem(item)
    setIsEditModalOpen(true)
  }, [])

  const handleCloseEdit = useCallback(() => {
    setIsEditModalOpen(false)
    setSelectedInventoryItem(null)
  }, [])

  const selectedLaboratory = useMemo(() => {
    if (!selectedLaboratoryId) return null
    return laboratories.find(l => String(l.id) === selectedLaboratoryId) || null
  }, [selectedLaboratoryId, laboratories])

  return {
    user,
    isSuperAdmin,
    laboratories,
    isLoadingLabs,
    selectedLaboratoryId,
    setSelectedLaboratoryId,
    selectedLaboratory,
    inventory,
    isLoading,
    error,
    laboratoryIdToUse,
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

