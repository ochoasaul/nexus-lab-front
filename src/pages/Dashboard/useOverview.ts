import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from './useDashboard'

export function useOverview() {
  const navigate = useNavigate()
  const { user, summaryCards, labs, selectedLabId, setSelectedLabId, selectedLab } = useDashboard()

  const handleLabQuickSelect = useCallback((labId: string) => {
    setSelectedLabId(labId)
    navigate(`/dashboard/inventory?labId=${labId}`)
  }, [setSelectedLabId, navigate])

  const handleExitLab = useCallback(() => {
    setSelectedLabId('all')
  }, [setSelectedLabId])

  return {
    user,
    summaryCards,
    labs,
    selectedLabId,
    selectedLab,
    handleLabQuickSelect,
    handleExitLab,
  }
}

