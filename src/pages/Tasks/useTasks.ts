import { useCallback } from 'react'
import { useDashboard } from '@/pages/Dashboard/useDashboard'

export function useTasks() {
  const { user, dataset, assignedTasks, simulateAssignTask, simulateStartTask, simulateCompleteTask } = useDashboard()

  const handleCreateTask = useCallback((assigneeId: string, title: string) => {
    if (!assigneeId || !title.trim()) {
      alert('Selecciona destinatario y describe la tarea')
      return
    }
    simulateAssignTask(assigneeId, title.trim())
  }, [simulateAssignTask])

  const handleStartTask = useCallback((taskId: string) => {
    simulateStartTask(taskId)
  }, [simulateStartTask])

  const handleCompleteTask = useCallback((taskId: string) => {
    simulateCompleteTask(taskId)
  }, [simulateCompleteTask])

  return {
    user,
    dataset,
    assignedTasks,
    handleCreateTask,
    handleStartTask,
    handleCompleteTask,
  }
}

