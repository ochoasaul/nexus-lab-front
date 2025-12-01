import { useState, useCallback } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import type { LabUserRole } from '@/mocks/labs'

export function useUsers() {
  const { user, groupedUsers, simulateAssignUser, simulateAssignTask } = useDashboard()
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState<LabUserRole>('auxiliar')

  const handleAssignUser = useCallback(() => {
    if (!newUserName.trim()) return
    simulateAssignUser(newUserName.trim(), newUserRole)
    setNewUserName('')
  }, [newUserName, newUserRole, simulateAssignUser])

  const handleAssignTask = useCallback((assigneeId: string, title: string) => {
    simulateAssignTask(assigneeId, title)
  }, [simulateAssignTask])

  return {
    user,
    groupedUsers,
    newUserName,
    setNewUserName,
    newUserRole,
    setNewUserRole,
    handleAssignUser,
    handleAssignTask,
  }
}

