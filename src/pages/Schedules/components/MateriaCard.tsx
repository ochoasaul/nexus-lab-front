import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { MateriaDocente } from '../useMaterias'

interface MateriaCardProps {
  materia: MateriaDocente
  onEdit: (materia: MateriaDocente) => void
  onToggle: (id: string | number) => void
}

export function MateriaCard({ materia, onEdit, onToggle }: MateriaCardProps) {
  return (
    <article
      className={`rounded-2xl border p-4 ${
        materia.estado === 'inactivo'
          ? 'border-charcoal-200 bg-charcoal-50 opacity-60'
          : 'border-charcoal-100 bg-white'
      }`}
    >
      <header className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-charcoal-900">{materia.nombre}</h4>
          <p className="text-sm text-charcoal-600 mt-1">{materia.docente}</p>
        </div>
        <StatusBadge label={materia.estado === 'activo' ? 'Activo' : 'Inactivo'} />
      </header>
      <div className="space-y-2 text-sm text-charcoal-600">
        <p>
          <span className="font-medium">Aula:</span> {materia.aula}
        </p>
        <p>
          <span className="font-medium">Horario:</span> {materia.horario}
        </p>
        <p>
          <span className="font-medium">Días:</span> {materia.tipoDias}
        </p>
        <p>
          <span className="font-medium">Período:</span>{' '}
          {new Date(materia.fechaInicio).toLocaleDateString()} -{' '}
          {new Date(materia.fechaFin).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          label="Editar"
          variant="ghost"
          onClick={() => onEdit(materia)}
          className="text-xs"
        />
        <Button
          label={materia.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
          variant="ghost"
          onClick={() => onToggle(materia.id)}
          className="text-xs"
        />
      </div>
    </article>
  )
}

