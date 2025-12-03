import api from './api'

export interface Product {
  id: string | number
  name: string
  description?: string | null
  base_code?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface InventoryItem {
  id: string | number
  quantity: number
  created_at?: string | null
  updated_at?: string | null
  product_id?: string | number | null
  laboratory_id?: string | number | null
  product?: Product | null
  laboratory?: {
    id: string | number
    name: string
  } | null
}

export interface CreateInventoryDto {
  name: string
  description?: string
  base_code?: string
  quantity: number
  laboratory_id?: string
}

export interface UpdateInventoryDto {
  quantity: number
}

export const inventoryService = {
  getAll: async (laboratoryId?: string): Promise<InventoryItem[]> => {
    try {
      const params = laboratoryId ? { laboratory_id: laboratoryId } : {}
      const { data } = await api.get<InventoryItem[]>('/inventory', { params })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error getting inventory'
      )
    }
  },

  searchProduct: async (query: string): Promise<Product[]> => {
    try {
      const { data } = await api.get<Product[]>('/inventory/search-product', {
        params: { q: query },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error searching products'
      )
    }
  },

  create: async (dto: CreateInventoryDto): Promise<InventoryItem> => {
    try {
      const { data } = await api.post<InventoryItem>('/inventory', dto)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error creating inventory'
      )
    }
  },

  update: async (id: string | number, dto: UpdateInventoryDto): Promise<InventoryItem> => {
    try {
      const { data } = await api.patch<InventoryItem>(`/inventory/${id}`, dto)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error updating inventory'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/inventory/${id}`)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error deleting inventory'
      )
    }
  },
}

