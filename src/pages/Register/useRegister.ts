import { useState } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'

export type RegisterTabType = 'support' | 'classroom' | 'events' | 'teachers'

export function useRegister() {
  const { user } = useDashboard()
  const [activeTab, setActiveTab] = useState<RegisterTabType>('support')

  return {
    user,
    activeTab,
    setActiveTab,
  }
}

