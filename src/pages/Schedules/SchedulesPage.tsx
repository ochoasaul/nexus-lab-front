import { Panel } from '@/components/dashboard/Panel'
import { useSchedules } from './useSchedules'
import { MateriasTab } from './MateriasTab'
import { EntradaSalidaTab } from './EntradaSalidaTab'
import { QuickActions } from '@/components/dashboard/QuickActions'

function SchedulesPage() {
  const { user, activeTab, setActiveTab } = useSchedules()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver horarios.
      </section>
    )
  }

  return (
    <section className="grid gap-6">
    <QuickActions />
    <Panel title="Horarios y docentes">
      {/* Tabs */}
      <div className="mb-6 border-b border-charcoal-200">
        <nav className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('materias')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'materias'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
            }`}
          >
            Materias del mes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('entrada-salida')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'entrada-salida'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
            }`}
          >
            Registrar entrada y salida
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'materias' && <MateriasTab />}
      {activeTab === 'entrada-salida' && <EntradaSalidaTab />}
      </Panel>
      </section>
  )
}

export default SchedulesPage
