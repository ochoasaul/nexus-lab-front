import type { Laboratorio } from '@/services/laboratorioService'

interface LaboratorioSelectorProps {
  laboratorios: Laboratorio[]
  isLoading: boolean
  onSelect: (laboratorioId: string) => void
}

export function LaboratorioSelector({ laboratorios, isLoading, onSelect }: LaboratorioSelectorProps) {
  if (isLoading) {
    return <p className="text-sm text-charcoal-500">Cargando laboratorios...</p>
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {laboratorios.map((lab) => (
        <button
          key={lab.id}
          onClick={() => onSelect(String(lab.id))}
          className="rounded-2xl border border-charcoal-200 bg-white p-4 text-left hover:border-primary-400 hover:bg-primary-50 transition-colors"
        >
          <h4 className="font-semibold text-charcoal-900">{lab.nombre}</h4>
          {lab.descripcion && (
            <p className="text-sm text-charcoal-600 mt-1">{lab.descripcion}</p>
          )}
        </button>
      ))}
    </div>
  )
}

