import { Panel } from '@/components/dashboard/Panel'
import { LostObjectModal } from './components/modals/LostObjectModal'
import { DeliverLostObjectModal } from './components/modals/DeliverLostObjectModal'
import { AllLostObjectsModal } from './components/modals/AllLostObjectsModal'
import { ImagePreviewModal } from './components/modals/ImagePreviewModal'
import { ConfirmMoveToPorteriaModal } from './components/modals/ConfirmMoveToPorteriaModal'
import { useReports } from './useReports'
import { useDashboard } from '@/pages/Dashboard/useDashboard'
import { ReportsSection } from './components/ReportsSection'
import { ReservationsSection } from './components/ReservationsSection'
import { LostObjectsSection } from './components/LostObjectsSection'
import { QuickActions } from '@/components/dashboard/QuickActions'

function ReportsPage() {
  const { dataset } = useDashboard()
  const {
    user,
    perdidos,
    totalPerdidos,
    totalLostObjects,
    lostObjects,
    isLoadingLostObjects,
    lostObjectsError,
    aulasFormatted,
    isLoadingAulas,
    aulasError,
    filteredObjectsForModal,
    currentMonth,
    isLostObjectModalOpen,
    setIsLostObjectModalOpen,
    isDeliverModalOpen,
    setIsDeliverModalOpen,
    isAllLostObjectsModalOpen,
    setIsAllLostObjectsModalOpen,
    isViewImageModalOpen,
    setIsViewImageModalOpen,
    isConfirmMoveModalOpen,
    setIsConfirmMoveModalOpen,
    selectedLostObject,
    setSelectedLostObject,
    modalFilterState,
    isMovingToPorteria,
    expandedSections,
    handleLostObjectSubmit,
    handleDeliverLostObject,
    handleMoveAllToPorteria,
    confirmMoveAllToPorteria,
    getImageUrl,
    handleOpenAllModal,
    handleDeliverFromModal,
    toggleSection,
    simulateReservation,
    simulateLostObject,
  } = useReports()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Inicia sesión para ver reportes.
      </section>
    )
  }

  return (
    <>
    <section className="grid gap-6">
    <QuickActions />
      <Panel title="Reportes y registros">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ReportsSection
            reports={dataset.reports}
            onNewReport={simulateLostObject}
            onViewAll={() => handleOpenAllModal('all')}
            isExpanded={expandedSections.reports}
            onToggleExpand={() => toggleSection('reports')}
          />

          <ReservationsSection
            reservations={dataset.reservations}
            onNewReservation={simulateReservation}
            onViewAll={() => handleOpenAllModal('all')}
            isExpanded={expandedSections.reservations}
            onToggleExpand={() => toggleSection('reservations')}
          />

          <LostObjectsSection
            perdidos={perdidos}
            totalPerdidos={totalPerdidos}
            currentMonth={currentMonth}
            isLoading={isLoadingLostObjects}
            error={lostObjectsError}
            onRegister={() => setIsLostObjectModalOpen(true)}
            onViewAll={() => handleOpenAllModal('all')}
            onView={(lostObject) => {
              setSelectedLostObject(lostObject)
              setIsViewImageModalOpen(true)
            }}
            onDeliver={(lostObject) => {
              setSelectedLostObject(lostObject)
              setIsDeliverModalOpen(true)
            }}
            onMoveAllToPorteria={handleMoveAllToPorteria}
            isMovingToPorteria={isMovingToPorteria}
            isExpanded={expandedSections.lostObjects}
            onToggleExpand={() => toggleSection('lostObjects')}
          />
        </div>
      </Panel>

      <LostObjectModal
        isOpen={isLostObjectModalOpen}
        onClose={() => setIsLostObjectModalOpen(false)}
        onSubmit={handleLostObjectSubmit}
        aulas={aulasFormatted}
        isLoadingAulas={isLoadingAulas}
        aulasError={aulasError}
      />

      <DeliverLostObjectModal
        isOpen={isDeliverModalOpen}
        onClose={() => {
          setIsDeliverModalOpen(false)
          setSelectedLostObject(null)
        }}
        lostObject={selectedLostObject}
        onSubmit={handleDeliverLostObject}
      />

      <AllLostObjectsModal
        isOpen={isAllLostObjectsModalOpen}
        onClose={() => setIsAllLostObjectsModalOpen(false)}
        lostObjects={filteredObjectsForModal}
        onDeliver={handleDeliverFromModal}
        onView={(lostObject) => {
          setSelectedLostObject(lostObject)
          setIsViewImageModalOpen(true)
        }}
        filterState={modalFilterState}
      />

      <ImagePreviewModal
        isOpen={isViewImageModalOpen}
        onClose={() => {
          setIsViewImageModalOpen(false)
          setSelectedLostObject(null)
        }}
        imageUrl={getImageUrl(selectedLostObject)}
        title={selectedLostObject?.objeto || 'Vista previa'}
      />

      <ConfirmMoveToPorteriaModal
        isOpen={isConfirmMoveModalOpen}
        onClose={() => setIsConfirmMoveModalOpen(false)}
        onConfirm={confirmMoveAllToPorteria}
        lostObjects={lostObjects}
        isLoading={isMovingToPorteria}
      />
    </section>
    </>
  )
}

export default ReportsPage
