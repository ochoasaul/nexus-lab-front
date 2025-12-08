import { useState } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'

export type TabType = 'subjects' | 'entry-exit'

export function useSchedules() {
  const { user } = useDashboard()
  const [activeTab, setActiveTab] = useState<TabType>('subjects')

  return {
    user,
    activeTab,
    setActiveTab,
  }
}

