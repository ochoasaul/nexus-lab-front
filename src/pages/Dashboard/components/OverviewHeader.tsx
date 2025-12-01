import Button from '@/components/ui/Button/Button'
import { Panel } from '@/components/dashboard/Panel'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import type { Laboratory } from '@/mocks/labs'

interface SummaryCardData {
  label: string
  value: number
  description: string
}

interface OverviewHeaderProps {
  selectedLab: Laboratory | null
  selectedLabId: string
  summaryCards: SummaryCardData[]
  onExitLab: () => void
}

export function OverviewHeader({ selectedLab, selectedLabId, summaryCards, onExitLab }: OverviewHeaderProps) {
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">Visión general</p>
          <h1 className="text-3xl font-semibold text-charcoal-900">
            {selectedLab ? selectedLab.name : 'Todos los laboratorios'}
          </h1>
          <p className="text-sm text-charcoal-500">
            {selectedLab
              ? 'Explora inventario, usuarios, reportes y registros dinámicos de este laboratorio.'
              : 'Navega entre todos los laboratorios y filtra la información por módulo.'}
          </p>
        </div>
        {selectedLabId !== 'all' && (
          <Button
            label="Salir del laboratorio"
            variant="ghost"
            onClick={onExitLab}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} label={card.label} value={card.value} description={card.description} />
        ))}
      </div>
    </Panel>
  )
}

