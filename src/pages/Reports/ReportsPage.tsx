import Button from '../../components/Button/Button'
import { Panel } from '../../components/dashboard/Panel'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { useDashboard } from '../Dashboard/useDashboard'

function ReportsPage() {
  const { user, dataset, simulateReservation, simulateLostObject } = useDashboard()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver reportes.
      </section>
    )
  }

  return (
    <Panel title="Reportes y registros">
      <div className="grid gap-6 lg:grid-cols-3">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Reportes abiertos</p>
            <Button label="Nuevo reporte" variant="ghost" onClick={simulateLostObject} />
          </div>
          <ul className="space-y-4">
            {dataset.reports.map((report) => (
              <article key={report.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                <header className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-charcoal-400">{report.type}</p>
                    <h4 className="text-lg font-semibold text-charcoal-900">{report.title}</h4>
                  </div>
                  <StatusBadge label={report.status} />
                </header>
                <p className="text-sm text-charcoal-600">{report.details}</p>
                <small className="text-xs text-charcoal-400">Actualizado {report.updatedAt}</small>
              </article>
            ))}
          </ul>
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Reservas de aulas</p>
            <Button label="Registrar reserva" variant="ghost" onClick={simulateReservation} />
          </div>
          <ul className="space-y-4">
            {dataset.reservations.map((reservation) => (
              <article key={reservation.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                <header className="mb-2 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-charcoal-900">{reservation.requester}</h4>
                  <StatusBadge label={reservation.status} />
                </header>
                <p className="text-sm text-charcoal-600">{reservation.room}</p>
                <small className="text-xs text-charcoal-400">{reservation.date}</small>
              </article>
            ))}
          </ul>
        </section>
        <section>
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-charcoal-400">Objetos perdidos</p>
          <ul className="space-y-4">
            {dataset.lostObjects.map((lost) => (
              <article key={lost.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
                <header className="mb-2 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-charcoal-900">{lost.item}</h4>
                  <StatusBadge label={lost.status} />
                </header>
                <p className="text-sm text-charcoal-600">Reportado por {lost.reportedBy}</p>
                <small className="text-xs text-charcoal-400">{lost.date}</small>
              </article>
            ))}
          </ul>
        </section>
      </div>
    </Panel>
  )
}

export default ReportsPage
