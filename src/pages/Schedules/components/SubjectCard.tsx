import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { SubjectTeacher } from '../useSubjects'

interface SubjectCardProps {
  subject: SubjectTeacher
  onEdit: (subject: SubjectTeacher) => void
  onToggle: (id: string | number) => void
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
          <p className="text-sm text-charcoal-600 mt-1">{subject.teacher.person?.first_name} {subject.teacher.person?.last_name}</p>
        </div>
        <StatusBadge label={subject.state === 'active' ? 'Active' : 'Inactive'} />
      </header>
      <div className="space-y-2 text-sm text-charcoal-600">
        <p>
          <span className="font-medium">Classroom:</span> {subject.classroom.name}
        </p>
        <p>
          <span className="font-medium">Schedule:</span> {subject.schedule}
        </p>
        <p>
          <span className="font-medium">Days:</span> {subject.daysType}
        </p>
        <p>
          <span className="font-medium">Period:</span>{' '}
          {new Date(subject.startDate).toLocaleDateString()} -{' '}
          {new Date(subject.endDate).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          label="Edit"
          variant="ghost"
          onClick={() => onEdit(subject)}
          className="text-xs"
        />
        <Button
          label={subject.state === 'active' ? 'Disable' : 'Enable'}
          variant="ghost"
          onClick={() => onToggle(subject.id)}
          className="text-xs"
        />
      </div>
    </article>
  )
}

