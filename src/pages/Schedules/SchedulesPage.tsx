import { Panel } from '@/components/dashboard/Panel'
import { useState } from 'react'
import { SubjectsTab } from './tabs/SubjectsTab'
import { EntryExitTab } from './tabs/EntryExitTab'
import { QuickActions } from '@/components/dashboard/QuickActions'

function SchedulesPage() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'entry-exit'>('subjects')

  return (
    <section className="grid gap-6">

      <QuickActions />

      <Panel
        title="Horarios y Materias"
      >
        {/* Tabs */}
        <div className="mb-6 flex border-b border-charcoal-100">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'subjects'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
              }`}
          >
            Materias Asignadas
          </button>
          <button
            onClick={() => setActiveTab('entry-exit')}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'entry-exit'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
              }`}
          >
            Registro Entrada/Salida
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'subjects' ? (
          <SubjectsTab />
        ) : (
          <EntryExitTab />
        )}
      </Panel>
    </section>
  )
}

export default SchedulesPage
