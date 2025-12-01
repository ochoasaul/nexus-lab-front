import { QuickActions } from '@/components/dashboard/QuickActions'
import { useOverview } from './useOverview'
import { LabsGrid } from './components/LabsGrid'
import { OverviewHeader } from './components/OverviewHeader'

function OverviewPage() {
  const {
    user,
    summaryCards,
    labs,
    selectedLabId,
    selectedLab,
    handleLabQuickSelect,
    handleExitLab,
  } = useOverview()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para explorar el panel.
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <QuickActions />
      <LabsGrid
        labs={labs}
        selectedLabId={selectedLabId}
        onLabEnter={handleLabQuickSelect}
      />

      <OverviewHeader
        selectedLab={selectedLab}
        selectedLabId={selectedLabId}
        summaryCards={summaryCards}
        onExitLab={handleExitLab}
      />

      <QuickActions />
    </section>
  )
}

export default OverviewPage
