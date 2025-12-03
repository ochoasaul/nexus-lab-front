import { Panel } from '@/components/dashboard/Panel'
import { useSchedules } from './useSchedules'
import { SubjectsTab } from './SubjectsTab'
import { EntradaSalidaTab } from './EntradaSalidaTab'
import { QuickActions } from '@/components/dashboard/QuickActions'

function SchedulesPage() {
  const { user, activeTab, setActiveTab } = useSchedules()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Please log in to view schedules.
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <QuickActions />
      <Panel title="Schedules and Teachers">
        {/* Tabs */}
        <div className="mb-6 border-b border-charcoal-200">
          <nav className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'subjects'
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
            >
              Monthly Subjects
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('entry-exit')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'entry-exit'
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
            >
              Register Entry/Exit
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'subjects' && <SubjectsTab />}
        {activeTab === 'entry-exit' && <EntradaSalidaTab />}
      </Panel>
    </section>
  )
}

export default SchedulesPage
