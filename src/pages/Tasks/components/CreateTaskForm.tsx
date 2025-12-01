import { useRef } from 'react'
import Button from '@/components/ui/Button/Button'
import { ROLE_DETAILS, type RoleKey } from '@/config'
import type { LabUser } from '@/mocks/labs'

interface CreateTaskFormProps {
  users: LabUser[]
  onCreateTask: (assigneeId: string, title: string) => void
}

const formatRoleLabel = (role: string) =>
  ROLE_DETAILS[role as RoleKey]?.label ?? role.charAt(0).toUpperCase() + role.slice(1)

export function CreateTaskForm({ users, onCreateTask }: CreateTaskFormProps) {
  const assigneeSelectRef = useRef<HTMLSelectElement>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    const assigneeId = assigneeSelectRef.current?.value ?? ''
    const title = titleInputRef.current?.value ?? ''
    
    if (!assigneeId || !title.trim()) {
      alert('Selecciona destinatario y describe la tarea')
      return
    }

    onCreateTask(assigneeId, title.trim())
    
    if (titleInputRef.current) titleInputRef.current.value = ''
    if (assigneeSelectRef.current) assigneeSelectRef.current.value = ''
  }

  return (
    <aside className="col-span-1 rounded-2xl border border-charcoal-100 bg-surface p-4">
      <h4 className="text-lg font-semibold text-charcoal-900">Crear tarea</h4>
      <p className="text-sm text-charcoal-500 mt-1">Designa nuevas tareas a cualquier usuario.</p>
      <div className="mt-3 grid gap-3">
        <select 
          ref={assigneeSelectRef}
          className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2 text-charcoal-900"
        >
          <option value="">Selecciona destinatario</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} — {formatRoleLabel(u.role)}
            </option>
          ))}
        </select>
        <input 
          ref={titleInputRef}
          placeholder="Descripción de la tarea" 
          className="rounded-2xl border border-charcoal-200 bg-white px-4 py-2 text-charcoal-900" 
        />
        <Button
          label="Asignar"
          variant="primary"
          onClick={handleSubmit}
        />
      </div>
    </aside>
  )
}

