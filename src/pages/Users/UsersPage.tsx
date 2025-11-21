import { useState } from 'react'
import Button from '../../components/Button/Button'
import { AssignIcon } from '../../components/icons/Icons'
import { Panel } from '../../components/dashboard/Panel'
import { ROLE_DETAILS, type RoleKey } from '../../config'
import type { LabUserRole } from '../../mocks/labs'
import { useDashboard } from '../Dashboard/useDashboard'

const allowedAssignRolesFor = (currentRole: RoleKey): LabUserRole[] => {
  if (currentRole === 'super_admin') return ['encargado', 'administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'encargado') return ['administrativo', 'auxiliar', 'docente', 'alumno']
  if (currentRole === 'administrativo') return ['administrativo', 'auxiliar', 'docente', 'alumno']
  return ['docente', 'alumno']
}

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

function UsersPage() {
  const { user, groupedUsers, dataset, simulateAssignUser, simulateAssignTask } = useDashboard()
  const [newUserName, setNewUserName] = useState('')
  const [newUserRole, setNewUserRole] = useState<LabUserRole>('auxiliar')

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver usuarios.
      </section>
    )
  }

  const handleAssignUser = () => {
    if (!newUserName.trim()) return
    simulateAssignUser(newUserName.trim(), newUserRole)
    setNewUserName('')
  }

  return (
    <Panel title="Roles y permisos">
      <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(groupedUsers).map(([role, users]) => (
            <article key={role} className="rounded-2xl border border-charcoal-100 bg-surface p-4">
              <header className="mb-3 flex items-center justify-between">
                <h4 className="text-base font-semibold text-charcoal-900">{formatRoleLabel(role)}</h4>
                <span className="text-xs text-charcoal-500">{users.length} usuarios</span>
              </header>
              <ul className="space-y-2 text-sm text-charcoal-600">
                {users.map((member) => {
                  const canAssignTask =
                    user && (user.role === 'super_admin' || (user.role === 'encargado' && ['administrativo', 'auxiliar'].includes(member.role)) || (user.role === 'administrativo' && member.role === 'auxiliar'))
                  return (
                    <li key={member.id} className="flex items-center justify-between border-b border-charcoal-100 pb-1">
                      <div className="flex items-center gap-3">
                        <span>{member.name}</span>
                        <small className="text-xs text-charcoal-400">{formatRoleLabel(member.role)}</small>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={member.status === 'activo' ? 'text-emerald-600' : 'text-amber-600'}>
                          {member.status}
                        </span>
                        {canAssignTask && (
                          <Button
                            label="Designar tarea"
                            variant="ghost"
                            Icon={AssignIcon}
                            onClick={() => {
                              const title = window.prompt(`Descripción de la tarea para ${member.name}:`)
                              if (!title || !title.trim()) return
                              simulateAssignTask(member.id, title.trim())
                            }}
                          />
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </article>
          ))}
        </div>
        <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 p-4 text-sm text-charcoal-600">
          <h4 className="text-lg font-semibold text-charcoal-900">Asignar a un laboratorio</h4>
          <p className="mt-2 text-charcoal-500">
            Los encargados pueden sumar administrativos, auxiliares o promover alumnos para cubrir turnos.
          </p>
          <div className="mt-4 grid gap-3">
            <input
              placeholder="Nombre completo"
              value={newUserName}
              onChange={(event) => setNewUserName(event.target.value)}
              className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
            />
            <select
              className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
              value={newUserRole}
              onChange={(event) => setNewUserRole(event.target.value as LabUserRole)}
            >
              {allowedAssignRolesFor(user.role).map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {formatRoleLabel(roleOption)}
                </option>
              ))}
            </select>
            <Button
              label="Crear invitación"
              onClick={handleAssignUser}
              disabled={!newUserName.trim()}
            />
          </div>
        </div>
      </div>
    </Panel>
  )
}

export default UsersPage
