import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ROLE_DETAILS, type RoleKey } from '@/config'
import type { LabUser } from '@/mocks/labs'

interface Task {
  id: string
  title: string
  assigneeId: string
  assignerId: string
  labId: string
  timestamp: string
  status: 'pendiente' | 'en_progreso' | 'completada'
}

interface TaskListProps {
  tasks: Task[]
  users: LabUser[]
  currentUserId: string | undefined
  onStartTask: (taskId: string) => void
  onCompleteTask: (taskId: string) => void
}

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

export function TaskList({ tasks, users, currentUserId, onStartTask, onCompleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-sm text-charcoal-500">No hay tareas asignadas.</p>
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const assignee = users.find((u) => u.id === task.assigneeId)
        const assigner = users.find((u) => u.id === task.assignerId)
        const isAssignee = currentUserId && currentUserId === task.assigneeId

        return (
          <article key={task.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
            <header className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-charcoal-900">{task.title}</h4>
                <p className="text-xs text-charcoal-500">Asignado a {assignee?.name ?? '—'}</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-charcoal-500">{task.timestamp}</p>
                <StatusBadge 
                  label={
                    task.status === 'pendiente' 
                      ? 'pendiente' 
                      : task.status === 'en_progreso' 
                      ? 'en progreso' 
                      : 'completada'
                  } 
                />
              </div>
            </header>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-charcoal-600">Asignador: {assigner?.name ?? 'Sistema'}</div>
              <div className="flex items-center gap-2">
                {isAssignee && task.status === 'pendiente' && (
                  <Button label="Iniciar" variant="primary" onClick={() => onStartTask(task.id)} />
                )}
                {isAssignee && task.status === 'en_progreso' && (
                  <Button label="Finalizar" variant="secondary" onClick={() => onCompleteTask(task.id)} />
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

