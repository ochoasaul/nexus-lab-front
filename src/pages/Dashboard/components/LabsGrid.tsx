import Button from '@/components/ui/Button/Button'
import { Panel } from '@/components/dashboard/Panel'
import type { Laboratory } from '@/mocks/labs'
import { LabCard } from './LabCard'

interface LabsGridProps {
  labs: Laboratory[]
  selectedLabId: string
  onLabEnter: (labId: string) => void
}

export function LabsGrid({ labs, selectedLabId, onLabEnter }: LabsGridProps) {
  return (
    <Panel title="Laboratorios">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Panel</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Acceso rápido</h3>
        </div>
        <Button label="Crear laboratorio" variant="secondary" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <LabCard
            key={lab.id}
            lab={lab}
            isSelected={selectedLabId === lab.id}
            onEnter={onLabEnter}
          />
        ))}
      </div>
    </Panel>
  )
}

