import { create } from 'zustand'
import type { LostObjectItem } from '@/services/lostObjectService'

type LostObjectsState = {
  lostObjects: LostObjectItem[]
  isLoading: boolean
  error: string | null
  setLostObjects: (lostObjects: LostObjectItem[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  addLostObject: (lostObject: LostObjectItem) => void
  updateLostObject: (id: string | number, updates: Partial<LostObjectItem>) => void
  removeLostObject: (id: string | number) => void
  clearLostObjects: () => void
  getLostObjectById: (id: string | number) => LostObjectItem | undefined
}

export const useLostObjectsStore = create<LostObjectsState>((set, get) => ({
  lostObjects: [],
  isLoading: false,
  error: null,
  setLostObjects: (lostObjects) => set({ lostObjects }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  addLostObject: (lostObject) => set((state) => ({ 
    lostObjects: [...state.lostObjects, lostObject] 
  })),
  updateLostObject: (id, updates) => set((state) => ({
    lostObjects: state.lostObjects.map((obj) =>
      obj.id.toString() === id.toString() ? { ...obj, ...updates } : obj
    ),
  })),
  removeLostObject: (id) => set((state) => ({
    lostObjects: state.lostObjects.filter((obj) => obj.id.toString() !== id.toString()),
  })),
  clearLostObjects: () => set({ lostObjects: [], isLoading: false, error: null }),
  getLostObjectById: (id) => {
    const state = get()
    return state.lostObjects.find((obj) => obj.id.toString() === id.toString())
  },
}))

