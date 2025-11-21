import Button from '../../components/Button/Button'
import { Panel } from '../../components/dashboard/Panel'
import { useDashboard } from '../Dashboard/useDashboard'

function SchedulesPage() {
  const { user, dataset, simulateSchedule } = useDashboard()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver horarios.
      </section>
    )
  }

  return (
    <Panel title="Horarios y docentes">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Registros dinámicos</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Entradas y salidas de docentes</h3>
          <p className="text-sm text-charcoal-500">
            Define múltiples horarios por materia y ajusta la duración cuando cambie el plan.
          </p>
        </div>
        <Button label="Agregar horario" variant="secondary" onClick={simulateSchedule} />
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dataset.schedules.map((schedule) => (
          <article key={schedule.id} className="rounded-2xl border border-charcoal-100 bg-white p-4">
            <header className="mb-2 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-charcoal-900">{schedule.subject}</h4>
              <span className="text-xs text-charcoal-500">{schedule.duration}</span>
            </header>
            <p className="text-sm text-charcoal-600">{schedule.teacher}</p>
            <small className="text-xs text-charcoal-400">
              {schedule.day} · {schedule.timeRange}
            </small>
          </article>
        ))}
      </div>
    </Panel>
  )
}

export default SchedulesPage
