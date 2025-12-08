import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { SubjectTeacher } from '@/hooks/useSubjects'

interface SubjectCardProps {
  subject: SubjectTeacher
  onEdit: (subject: SubjectTeacher) => void
  onToggle: (subject: SubjectTeacher) => void
}

export function SubjectCard({ subject, onEdit, onToggle }: SubjectCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 ${subject.state === 'inactive'
        ? 'border-charcoal-200 bg-charcoal-50 opacity-60'
        : 'border-charcoal-100 bg-white'
        }`}
    >
      <header className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-charcoal-900">{subject.name}</h4>
          <p className="text-sm text-charcoal-600 mt-1">
            <span className="font-medium">Docente:</span> {subject.teacher.person?.first_name} {subject.teacher.person?.last_name}
          </p>
        </div>
        <StatusBadge label={subject.state === 'active' ? 'Activo' : 'Inactivo'} />
      </header>
      <div className="space-y-2 text-sm text-charcoal-600">
        <p>
          <span className="font-medium">Aula:</span> {subject.classroom.name}
        </p>
        <p>
          <span className="font-medium">Horario:</span> {subject.schedule}
        </p>
        <p>
          <span className="font-medium">Días:</span> {subject.daysType}
        </p>
        <p>
          <span className="font-medium">Fecha Inicio:</span>{' '}
          {new Date(subject.startDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Periodo:</span>{' '}
          {new Date(subject.startDate).toLocaleDateString()} -{' '}
          {new Date(subject.endDate).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex gap-2 justify-end">
        <Button
          label="Edit"
          variant="ghost"
          onClick={() => onEdit(subject)}
          className="text-xs"
        />
        <Button
          label={subject.state === 'active' ? 'Inactivar' : 'Activar'}
          variant="ghost"
          onClick={() => onToggle(subject)}
          className="text-xs"
        />
      </div>
    </article>
  )
}

