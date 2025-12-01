import api from './api'

export interface Producto {
  id: string | number
  nombre: string
  descripcion?: string | null
  codigo_base?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface InventarioItem {
  id: string | number
  cantidad: number
  created_at?: string | null
  updated_at?: string | null
  producto_id?: string | number | null
  laboratorio_id?: string | number | null
  producto?: Producto | null
  laboratorio?: {
    id: string | number
    nombre: string
  } | null
}

export interface CreateInventoryDto {
  nombre: string
  descripcion?: string
  codigo_base?: string
  cantidad: number
  laboratorio_id?: string
}

export interface UpdateInventoryDto {
  cantidad: number
}

export const inventoryService = {
  getAll: async (laboratorioId?: string): Promise<InventarioItem[]> => {
    try {
      const params = laboratorioId ? { laboratorio_id: laboratorioId } : {}
      const { data } = await api.get<InventarioItem[]>('/inventory', { params })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener el inventario'
      )
    }
  },

  searchProduct: async (query: string): Promise<Producto[]> => {
    try {
      const { data } = await api.get<Producto[]>('/inventory/search-product', {
        params: { q: query },
      })
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al buscar productos'
      )
    }
  },

  create: async (dto: CreateInventoryDto): Promise<InventarioItem> => {
    try {
      const { data } = await api.post<InventarioItem>('/inventory', dto)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al crear el inventario'
      )
    }
  },

  update: async (id: string | number, dto: UpdateInventoryDto): Promise<InventarioItem> => {
    try {
      const { data } = await api.patch<InventarioItem>(`/inventory/${id}`, dto)
      return data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al actualizar el inventario'
      )
    }
  },

  remove: async (id: string | number): Promise<void> => {
    try {
      await api.delete(`/inventory/${id}`)
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error al eliminar el inventario'
      )
    }
  },
}

