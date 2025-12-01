import { Panel } from '@/components/dashboard/Panel'
import { useUsers } from './useUsers'
import { UserRoleGroup } from './components/UserRoleGroup'
import { AssignUserForm } from './components/AssignUserForm'

function UsersPage() {
  const {
    user,
    groupedUsers,
    newUserName,
    setNewUserName,
    newUserRole,
    setNewUserRole,
    handleAssignUser,
    handleAssignTask,
  } = useUsers()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver usuarios.
      </section>
    )
  }

  return (
    <Panel title="Roles y permisos">
      <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(groupedUsers).map(([role, users]) => (
            <UserRoleGroup
              key={role}
              role={role}
              users={users}
              onAssignTask={handleAssignTask}
            />
          ))}
        </div>
        <AssignUserForm
          userName={newUserName}
          userRole={newUserRole}
          onUserNameChange={setNewUserName}
          onUserRoleChange={setNewUserRole}
          onSubmit={handleAssignUser}
        />
      </div>
    </Panel>
  )
}

export default UsersPage
