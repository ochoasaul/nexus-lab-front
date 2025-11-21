import Button from '../../components/Button/Button'
import { EnterIcon } from '../../components/icons/Icons'
import { Panel } from '../../components/dashboard/Panel'
import { StatusBadge } from '../../components/dashboard/StatusBadge'
import { SummaryCard } from '../../components/dashboard/SummaryCard'
import { QuickActions } from '../../components/dashboard/QuickActions'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from './useDashboard'

function OverviewPage() {
  const navigate = useNavigate()
  const { user, summaryCards, labs, selectedLabId, setSelectedLabId, selectedLab } = useDashboard()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para explorar el panel.
      </section>
    )
  }

  const handleLabQuickSelect = (labId: string) => {
    setSelectedLabId(labId)
    navigate(`/dashboard/inventory?labId=${labId}`)
  }

  const handleExitLab = () => {
    setSelectedLabId('all')
  }

  // Show full labs panel only to super_admin; other roles see a focused summary
  if (user.role === 'super_admin') {
    return (
      <section className="grid gap-6">
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
              <article
                key={lab.id}
                className={`rounded-2xl border p-5 transition hover:border-primary-400 ${
                  selectedLabId === lab.id ? 'border-primary-500 shadow-glow' : 'border-charcoal-100'
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
                    onClick={() => handleLabQuickSelect(lab.id)} 
                    Icon={EnterIcon} 
                  />
                  <Button label="Inventario" variant="ghost" />
                  {user.role === 'super_admin' && (
                    <div>
                      {lab.managerId ? (
                        <Button label="Cambiar encargado" variant="ghost" />
                      ) : (
                        <Button label="Asignar encargado" variant="secondary" />
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Panel>

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
                onClick={handleExitLab}
              />
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} label={card.label} value={card.value} description={card.description} />
            ))}
          </div>
        </Panel>

        <QuickActions />
      </section>
    )
  }

  // Non-admin: show a compact information panel about the assigned laboratory
  return (
    <section className="grid gap-6">
      <Panel title="Información del laboratorio">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Resumen</p>
            <h3 className="text-2xl font-semibold text-charcoal-900">{selectedLab?.name ?? '—'}</h3>
            <p className="text-sm text-charcoal-500">{selectedLab?.location ?? ''}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border p-5 bg-white">
            <h4 className="text-sm text-charcoal-400">Estado</h4>
            <div className="mt-2 flex items-center justify-between">
              <StatusBadge label={selectedLab?.status ?? 'operativo'} />
              <p className="text-lg font-semibold text-charcoal-900">Capacidad: {selectedLab?.capacity ?? '—'}</p>
            </div>
            <p className="mt-2 text-sm text-charcoal-500">Encargado: {selectedLab?.lead ?? '—'}</p>
          </article>

          <article className="rounded-2xl border p-5 bg-white">
            <h4 className="text-sm text-charcoal-400">Inventario</h4>
            <p className="mt-2 text-lg font-semibold text-charcoal-900">{selectedLab?.inventory.length ?? 0} items</p>
            <p className="mt-2 text-sm text-charcoal-500">Disponibles: {selectedLab ? selectedLab.inventory.reduce((s, i) => s + i.available, 0) : 0}</p>
          </article>

          <article className="rounded-2xl border p-5 bg-white">
            <h4 className="text-sm text-charcoal-400">Usuarios activos</h4>
            <p className="mt-2 text-lg font-semibold text-charcoal-900">{selectedLab ? selectedLab.users.filter((u) => u.status === 'activo').length : 0}</p>
            <p className="mt-2 text-sm text-charcoal-500">Total usuarios: {selectedLab?.users.length ?? 0}</p>
          </article>

          <article className="rounded-2xl border p-5 bg-white">
            <h4 className="text-sm text-charcoal-400">Horarios</h4>
            <p className="mt-2 text-lg font-semibold text-charcoal-900">{selectedLab?.schedules.length ?? 0}</p>
            <p className="mt-2 text-sm text-charcoal-500">Reservas: {selectedLab?.reservations.length ?? 0}</p>
          </article>
        </div>
      </Panel>

      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">Visión general</p>
            <h1 className="text-3xl font-semibold text-charcoal-900">{selectedLab?.name ?? '—'}</h1>
            <p className="text-sm text-charcoal-500">
              Explora inventario, usuarios, reportes y registros dinámicos de este laboratorio.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} label={card.label} value={card.value} description={card.description} />
          ))}
        </div>
      </Panel>
    </section>
  )
}

export default OverviewPage
