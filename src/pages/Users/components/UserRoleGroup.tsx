import Button from '@/components/ui/Button/Button'
import { AssignIcon } from '@/components/icons/Icons'
import { ROLE_DETAILS, type RoleKey } from '@/config'
import type { LabUser } from '@/mocks/labs'

interface UserRoleGroupProps {
  role: string
  users: LabUser[]
  onAssignTask: (userId: string, userName: string) => void
}

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

export function UserRoleGroup({ role, users, onAssignTask }: UserRoleGroupProps) {
  const handleAssignTask = (member: LabUser) => {
    const title = window.prompt(`Descripción de la tarea para ${member.name}:`)
    if (!title || !title.trim()) return
    onAssignTask(member.id, title.trim())
  }

  return (
    <article className="rounded-2xl border border-charcoal-100 bg-surface p-4">
      <header className="mb-3 flex items-center justify-between">
        <h4 className="text-base font-semibold text-charcoal-900">{formatRoleLabel(role)}</h4>
        <span className="text-xs text-charcoal-500">{users.length} usuarios</span>
      </header>
      <ul className="space-y-2 text-sm text-charcoal-600">
        {users.map((member) => (
          <li key={member.id} className="flex items-center justify-between border-b border-charcoal-100 pb-1">
            <div className="flex items-center gap-3">
              <span>{member.name}</span>
              <small className="text-xs text-charcoal-400">{formatRoleLabel(member.role)}</small>
            </div>
            <div className="flex items-center gap-3">
              <span className={member.status === 'activo' ? 'text-emerald-600' : 'text-amber-600'}>
                {member.status}
              </span>
              <Button
                label="Designar tarea"
                variant="ghost"
                Icon={AssignIcon}
                onClick={() => handleAssignTask(member)}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}

