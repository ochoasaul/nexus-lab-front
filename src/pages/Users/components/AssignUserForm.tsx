import Button from '@/components/ui/Button/Button'
import { ROLE_DETAILS, type RoleKey } from '@/config'
import type { LabUserRole } from '@/mocks/labs'

interface AssignUserFormProps {
  userName: string
  userRole: LabUserRole
  onUserNameChange: (name: string) => void
  onUserRoleChange: (role: LabUserRole) => void
  onSubmit: () => void
}

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

export function AssignUserForm({
  userName,
  userRole,
  onUserNameChange,
  onUserRoleChange,
  onSubmit,
}: AssignUserFormProps) {
  return (
    <div className="rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50 p-4 text-sm text-charcoal-600">
      <h4 className="text-lg font-semibold text-charcoal-900">Asignar a un laboratorio</h4>
      <p className="mt-2 text-charcoal-500">
        Asigna usuarios a laboratorios con cualquier rol.
      </p>
      <div className="mt-4 grid gap-3">
        <input
          placeholder="Nombre completo"
          value={userName}
          onChange={(event) => onUserNameChange(event.target.value)}
          className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
        />
        <select
          className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
          value={userRole}
          onChange={(event) => onUserRoleChange(event.target.value as LabUserRole)}
        >
          {['encargado', 'administrativo', 'auxiliar', 'docente', 'alumno'].map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {formatRoleLabel(roleOption)}
            </option>
          ))}
        </select>
        <Button
          label="Crear invitación"
          onClick={onSubmit}
          disabled={!userName.trim()}
        />
      </div>
    </div>
  )
}

