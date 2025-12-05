import { useMemo, useState } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { type ReservationItem } from '@/services/reservationService'
import { ReservationDetailModal } from './modals/ReservationDetailModal'
import { EyeIcon } from '@/components/icons/Icons'

interface ReservationsSectionProps {
  reservations: ReservationItem[]
  onNewReservation: () => void
  onViewAll: () => void
  isExpanded: boolean
  onToggleExpand: () => void
  onRefresh?: () => void
}

export function ReservationsSection({
  reservations,
  onNewReservation,
  onViewAll,
  isExpanded,
  onToggleExpand,
  onRefresh
}: ReservationsSectionProps) {
  const [selectedReservation, setSelectedReservation] = useState<ReservationItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayedReservations = useMemo(() => reservations.slice(0, 5), [reservations])

  const getDisplayDate = (datesStr: any) => {
    try {
      const dates = typeof datesStr === 'string' ? JSON.parse(datesStr) : datesStr;
      if (Array.isArray(dates) && dates.length > 0) {
        if (dates.length === 1) return dates[0];
        return `${dates[0]} - ${dates[dates.length - 1]}`;
      }
      return 'Fechas variadas';
    } catch { return 'Fecha inválida'; }
  }

  const handleReservationClick = (reservation: ReservationItem) => {
    setSelectedReservation(reservation)
    setIsModalOpen(true)
  }

  const handleReservationUpdated = () => {
    if (onRefresh) onRefresh()
    // Optionally update selectedReservation if needed, but refetch should handle list
  }

  return (
    <>
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
              <article
                key={reservation.id}
                className="rounded-2xl border border-charcoal-100 bg-white p-4 min-h-[140px] flex flex-col hover:border-primary-200 transition-colors"
              >
                <header className="mb-2 flex items-center justify-between gap-2">
                  <h4 className="text-lg font-semibold text-charcoal-900 break-words">
                    {reservation.person ? `${reservation.person.first_name} ${reservation.person.last_name}` : `ID: ${reservation.requester_person_id}`}
                  </h4>
                  <StatusBadge label={reservation.state || 'Pending'} />
                </header>
                <div className="mt-auto flex items-end justify-between gap-2">
                  <div>
                    <p className="text-sm text-charcoal-600 break-words">{reservation.classroom?.name || 'Sin aula'}</p>
                    <small className="text-xs text-charcoal-400">{getDisplayDate(reservation.dates)}</small>
                  </div>
                  <Button
                    label=""
                    Icon={EyeIcon}
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReservationClick(reservation);
                    }}
                    className="text-xs px-2 py-1 text-charcoal-400 hover:text-primary-500"
                  />
                </div>
              </article>
            ))}
          </ul>
        </div>
      </section>

      <ReservationDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservation={selectedReservation}
        onReservationUpdated={handleReservationUpdated}
      />
    </>
  )
}

