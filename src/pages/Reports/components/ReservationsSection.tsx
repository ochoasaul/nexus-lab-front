import { useMemo } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { LabReservation } from '@/mocks/labs'

interface ReservationsSectionProps {
  reservations: LabReservation[]
  onNewReservation: () => void
  onViewAll: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

export function ReservationsSection({ 
  reservations, 
  onNewReservation, 
  onViewAll, 
  isExpanded, 
  onToggleExpand 
}: ReservationsSectionProps) {
  const displayedReservations = useMemo(() => reservations.slice(0, 5), [reservations])

  return (
    <section className="rounded-2xl border border-charcoal-100 bg-white p-4 md:border-0 md:bg-transparent md:p-0">
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Reservas de aulas</p>
        <div className="flex gap-2">
          <Button label="Registrar reserva" variant="ghost" onClick={onNewReservation} className="text-xs" />
          {reservations.length > 5 && (
            <Button
              label={`Ver todos (${reservations.length})`}
              variant="ghost"
              onClick={onViewAll}
              className="text-xs"
            />
          )}
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
        <ul className="space-y-4">
          {displayedReservations.map((reservation) => (
            <article key={reservation.id} className="rounded-2xl border border-charcoal-100 bg-white p-4 min-h-[140px] flex flex-col">
              <header className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-lg font-semibold text-charcoal-900 break-words">{reservation.requester}</h4>
                <StatusBadge label={reservation.status} />
              </header>
              <div className="mt-auto">
                <p className="text-sm text-charcoal-600 break-words">{reservation.room}</p>
                <small className="text-xs text-charcoal-400">{reservation.date}</small>
              </div>
            </article>
          ))}
        </ul>
      </div>
    </section>
  )
}

