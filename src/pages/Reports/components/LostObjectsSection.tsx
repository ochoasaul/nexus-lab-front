import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { LostObjectItem } from '@/services/lostObjectService'

interface LostObjectsSectionProps {
  perdidos: LostObjectItem[]
  totalPerdidos: number
  currentMonth: string
  isLoading: boolean
  error: string | null
  onRegister: () => void
  onViewAll: () => void
  onView: (lostObject: LostObjectItem) => void
  onDeliver: (lostObject: LostObjectItem) => void
  onMoveAllToPorteria: () => void
  isMovingToPorteria: boolean
  isExpanded: boolean
  onToggleExpand: () => void
}

export function LostObjectsSection({
  perdidos,
  totalPerdidos,
  currentMonth,
  isLoading,
  error,
  onRegister,
  onViewAll,
  onView,
  onDeliver,
  onMoveAllToPorteria,
  isMovingToPorteria,
  isExpanded,
  onToggleExpand,
}: LostObjectsSectionProps) {
  const renderLostObjectsList = () => {
    if (isLoading) {
      return <p className="text-sm text-charcoal-500">Cargando objetos perdidos...</p>
    }

    if (error) {
      return <p className="text-sm text-red-600">{error}</p>
    }

    if (perdidos.length === 0) {
      return <p className="text-sm text-charcoal-500">No hay objetos perdidos.</p>
    }

    return (
      <>
        <ul className="space-y-4">
          {perdidos.map((lost) => (
            <article key={lost.id} className="rounded-2xl border border-charcoal-100 bg-white p-4 min-h-[140px] flex flex-col">
              <header className="mb-2 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-charcoal-900 mb-1">{lost.objeto}</h4>
                  <small className="text-xs text-charcoal-400 block">
                    {lost.fecha_encontrado
                      ? `Encontrado el ${new Date(lost.fecha_encontrado).toLocaleDateString()}`
                      : 'Fecha encontrada no registrada'}
                    {lost.horario_encontrado && ` a las ${lost.horario_encontrado}`}
                  </small>
                </div>
                <StatusBadge label={lost.estado} />
              </header>
              <div className="mt-auto flex items-end justify-between gap-2">
                {lost.aula?.nombre && (
                  <p className="text-sm text-charcoal-600 py-1">Aula: {lost.aula.nombre}</p>
                )}
                <div className="flex gap-2">
                  {((lost.estado === 'Perdido' || lost.estado === 'Porteria') && lost.multimedia?.ruta) || 
                   (lost.estado === 'Entregado' && lost.entrega_objeto?.[0]?.multimedia?.ruta) ? (
                    <Button
                      label="Ver"
                      variant="ghost"
                      onClick={() => onView(lost)}
                      className="text-xs px-2 py-1"
                    />
                  ) : null}
                  {lost.estado === 'Perdido' && (
                    <Button
                      label="Entregar"
                      variant="ghost"
                      onClick={() => onDeliver(lost)}
                      className="text-xs px-2 py-1"
                    />
                  )}
                </div>
              </div>
            </article>
          ))}
        </ul>
        {totalPerdidos > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={onMoveAllToPorteria}
              disabled={isMovingToPorteria}
              className="flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700 hover:border-sky-400 hover:bg-sky-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isMovingToPorteria ? 'Moviendo...' : 'Mover todos a Portería'}
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <section className="rounded-2xl border border-charcoal-100 bg-white p-4 md:border-0 md:bg-transparent md:p-0">
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Objetos perdidos</p>
          <p className="text-sm text-charcoal-500">Laboratorio asignado · {currentMonth}</p>
        </div>
        <div className="flex gap-2">
          <Button
            label="Registrar"
            variant="ghost"
            onClick={onRegister}
            className="text-xs whitespace-nowrap"
          />
            <Button
              label={`Ver todos (${totalPerdidos})`}
              variant="ghost"
              onClick={onViewAll}
              className="text-xs"
            />
          
          <button
            type="button"
            onClick={onToggleExpand}
            className="md:hidden p-1 rounded-lg hover:bg-charcoal-100"
            aria-label="Expandir sección"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`md:block ${isExpanded ? 'block' : 'hidden'}`}>
        <div>
          <h3 className="text-sm font-semibold text-charcoal-700 mb-3">Perdidos</h3>
          {renderLostObjectsList()}
        </div>
      </div>
    </section>
  )
}

