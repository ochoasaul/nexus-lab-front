import Button from '../../components/Button/Button'
import { Panel } from '../../components/dashboard/Panel'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { ROLE_DETAILS, type RoleKey } from '../../config'
import { useDashboard } from './useDashboard'

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

function TasksPage() {
  const { user, dataset, assignedTasks, simulateAssignTask, simulateStartTask, simulateCompleteTask } = useDashboard()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver tareas.
      </section>
    )
  }

  const handleCreateTask = () => {
    const sel = document.getElementById('assignee-select') as HTMLSelectElement | null
    const input = document.getElementById('task-title') as HTMLInputElement | null
    const assigneeId = sel?.value ?? ''
    const title = input?.value ?? ''
    if (!assigneeId || !title.trim()) return alert('Selecciona destinatario y describe la tarea')
    simulateAssignTask(assigneeId, title.trim())
    if (input) input.value = ''
    if (sel) sel.value = ''
  }

  return (
    <Panel title="Tareas asignadas">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">Tareas</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Gestión de tareas</h3>
          <p className="text-sm text-charcoal-500">Visualiza y administra las tareas asignadas según tu rol.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="col-span-2">
          <div className="space-y-3">
            {(assignedTasks.length === 0 && <p className="text-sm text-charcoal-500">No hay tareas asignadas.</p>) || null}
            {assignedTasks.map((task) => {
              const assignee = dataset.users.find((u) => u.id === task.assigneeId)
              const assigner = dataset.users.find((u) => u.id === task.assignerId)
              
              const canViewTask = (() => {
                if (!user) return false
                if (user.role === 'super_admin') return true
                if (user.role === 'encargado') return assignee?.role === 'administrativo' || assignee?.role === 'auxiliar'
                if (user.role === 'administrativo') return assignee?.id === user.id || assignee?.role === 'auxiliar'
                if (user.role === 'auxiliar') return assignee?.id === user.id
                return false
              })()

              if (!canViewTask) return null

              const isAssignee = user && user.id === task.assigneeId

              return (
                <article key={task.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                  <header className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-charcoal-900">{task.title}</h4>
                      <p className="text-xs text-charcoal-500">Asignado a {assignee?.name ?? '—'}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-charcoal-500">{task.timestamp}</p>
                      <StatusBadge label={task.status === 'pendiente' ? 'pendiente' : task.status === 'en_progreso' ? 'en progreso' : 'completada'} />
                    </div>
                  </header>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm text-charcoal-600">Asignador: {assigner?.name ?? 'Sistema'}</div>
                    <div className="flex items-center gap-2">
                      {isAssignee && task.status === 'pendiente' && (
                        <Button label="Iniciar" variant="primary" onClick={() => simulateStartTask(task.id)} />
                      )}
                      {isAssignee && task.status === 'en_progreso' && (
                        <Button label="Finalizar" variant="secondary" onClick={() => simulateCompleteTask(task.id)} />
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <aside className="col-span-1 rounded-2xl border border-charcoal-100 bg-surface p-4">
          <h4 className="text-lg font-semibold text-charcoal-900">Crear tarea</h4>
          <p className="text-sm text-charcoal-500 mt-1">Designa nuevas tareas a administrativos o auxiliares según tu rol.</p>
          <div className="mt-3 grid gap-3">
            <select id="assignee-select" className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2 text-charcoal-900">
              <option value="">Selecciona destinatario</option>
              {dataset.users
                .filter((u) => {
                  if (!user) return false
                  const allowed = user.role === 'super_admin' ? ['administrativo', 'auxiliar'] : user.role === 'encargado' ? ['administrativo', 'auxiliar'] : user.role === 'administrativo' ? ['auxiliar'] : []
                  return allowed.includes(u.role)
                })
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {formatRoleLabel(u.role)}
                  </option>
                ))}
            </select>
            <input id="task-title" placeholder="Descripción de la tarea" className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2 text-charcoal-900" />
            <Button
              label="Asignar"
              variant="primary"
              onClick={handleCreateTask}
            />
          </div>
        </aside>
      </div>
    </Panel>
  )
}

export default TasksPage
