import { Panel } from '@/components/dashboard/Panel'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { useRegister } from './useRegister'
import { SupportTab } from './tabs/SupportTab'
import { ClassroomTab } from './tabs/ClassroomTab'
import { TeachersTab } from './tabs/TeachersTab'

function RegisterPage() {
  const { user, activeTab, setActiveTab } = useRegister()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Please log in to view registrations.
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <QuickActions />
      <Panel title="Registrations">
        {/* Tabs */}
        <div className="mb-6 border-b border-charcoal-200">
          <nav className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'support'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
            >
              Support Registration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('classroom')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'classroom'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
            >
              Classroom Registration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'reservations'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
            >
              Reservations Registration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teachers')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'teachers'
                ? 'border-primary-500 text-primary-700'
                : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
                }`}
            >
              Teachers Registration
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'support' && <SupportTab />}
        {activeTab === 'classroom' && <ClassroomTab />}
        {activeTab === 'teachers' && <TeachersTab />}
      </Panel>
    </section>
  )
}

export default RegisterPage

