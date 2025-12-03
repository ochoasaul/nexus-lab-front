import type { Laboratory } from '@/services/laboratoryService'

interface LaboratorySelectorProps {
  laboratories: Laboratory[]
  isLoading: boolean
  onSelect: (laboratoryId: string) => void
}

export function LaboratorySelector({ laboratories, isLoading, onSelect }: LaboratorySelectorProps) {
  if (isLoading) {
    return <p className="text-sm text-charcoal-500">Loading laboratories...</p>
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {laboratories.map((lab) => (
        <button
          key={lab.id}
          onClick={() => onSelect(String(lab.id))}
          className="rounded-2xl border border-charcoal-200 bg-white p-4 text-left hover:border-primary-400 hover:bg-primary-50 transition-colors"
        >
          <h4 className="font-semibold text-charcoal-900">{lab.name}</h4>
          {lab.description && (
            <p className="text-sm text-charcoal-600 mt-1">{lab.description}</p>
          )}
        </button>
      ))}
    </div>
  )
}

