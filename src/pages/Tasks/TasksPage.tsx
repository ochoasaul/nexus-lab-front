import { Panel } from '@/components/dashboard/Panel'
import { useTasks } from './useTasks'
import { TaskList } from './components/TaskList'
import { CreateTaskForm } from './components/CreateTaskForm'
import { QuickActions } from '@/components/dashboard/QuickActions'

function TasksPage() {
  const {
    user,
    dataset,
    assignedTasks,
    handleCreateTask,
    handleStartTask,
    handleCompleteTask,
  } = useTasks()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver tareas.
      </section>
    )
  }

  return (
    <section className="grid gap-6">
    <QuickActions />
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
          <TaskList
            tasks={assignedTasks}
            users={dataset.users}
            currentUserId={user.id ? String(user.id) : undefined}
            onStartTask={handleStartTask}
            onCompleteTask={handleCompleteTask}
          />
        </section>

        <CreateTaskForm
          users={dataset.users}
          onCreateTask={handleCreateTask}
        />
      </div>
    </Panel>
    </section>
  )
}

export default TasksPage
