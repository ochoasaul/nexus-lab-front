import { useState } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'

export type TabType = 'materias' | 'entrada-salida'

export function useSchedules() {
  const { user } = useDashboard()
  const [activeTab, setActiveTab] = useState<TabType>('materias')

  return {
    user,
    activeTab,
    setActiveTab,
  }
}

