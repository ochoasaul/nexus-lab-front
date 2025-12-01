import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EnterIcon } from '@/components/icons/Icons'
import type { Laboratory } from '@/mocks/labs'

interface LabCardProps {
  lab: Laboratory
  isSelected: boolean
  onEnter: (labId: string) => void
}

export function LabCard({ lab, isSelected, onEnter }: LabCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 transition hover:border-primary-400 ${
        isSelected ? 'border-primary-500 shadow-glow' : 'border-charcoal-100'
      }`}
    >
      <header className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">{lab.code}</p>
          <h4 className="text-xl font-semibold text-charcoal-900">{lab.name}</h4>
        </div>
        <StatusBadge label={lab.status} />
      </header>
      <p className="text-sm text-charcoal-500">{lab.location}</p>
      <p className="text-sm text-charcoal-500">Encargado: {lab.lead}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button 
          label="Entrar" 
          variant="secondary" 
          onClick={() => onEnter(lab.id)} 
          Icon={EnterIcon} 
        />
        <Button label="Inventario" variant="ghost" />
        <div>
          {lab.managerId ? (
            <Button label="Cambiar encargado" variant="ghost" />
          ) : (
            <Button label="Asignar encargado" variant="secondary" />
          )}
        </div>
      </div>
    </article>
  )
}

