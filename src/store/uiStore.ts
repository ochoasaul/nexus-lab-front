import { create } from 'zustand'

const createId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random()}`
}

type Notification = {
  id: string
  message: string
}

type UIState = {
  isSidebarOpen: boolean
  notifications: Notification[]
  toggleSidebar: () => void
  addNotification: (message: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  notifications: [],
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  addNotification: (message) =>
    set((state) => ({ notifications: [...state.notifications, { id: createId(), message }] })),
  clearNotifications: () => set({ notifications: [] }),
}))
