import { Panel } from '@/components/dashboard/Panel'
import { LostObjectModal } from './components/modals/LostObjectModal'
import { DeliverLostObjectModal } from './components/modals/DeliverLostObjectModal'
import { AllLostObjectsModal } from './components/modals/AllLostObjectsModal'
import { ImagePreviewModal } from './components/modals/ImagePreviewModal'
import { ConfirmMoveToReceptionModal } from './components/modals/ConfirmMoveToReceptionModal'
import { CreateReservationModal } from './components/modals/CreateReservationModal'
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
    lostItems,
    totalLostItems,
    totalLostObjects,
    lostObjects,
    isLoadingLostObjects,
    lostObjectsError,
    classroomsFormatted,
    isLoadingClassrooms,
    classroomsError,
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
    isReservationModalOpen,
    setIsReservationModalOpen,
    selectedLostObject,
    setSelectedLostObject,
    modalFilterState,
    isMovingToPorteria,
    expandedSections,
    handleLostObjectSubmit,
    handleReservationSubmit,
    handleDeliverLostObject,
    handleMoveAllToReception,
    confirmMoveAllToReception,
    getImageUrl,
    handleOpenAllModal,
    handleDeliverFromModal,
    toggleSection,
    simulateReservation,
    simulateLostObject,
    formattedReservations,
    reservations,
    refetchReservations,
  } = useReports()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Please log in to view reports.
      </section>
    )
  }

  return (
    <>
      <section className="grid gap-6">
        <QuickActions />
        <Panel title="Reports and Records">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <ReportsSection
              reports={dataset.reports}
              onNewReport={simulateLostObject}
              onViewAll={() => handleOpenAllModal('all')}
              isExpanded={expandedSections.reports}
              onToggleExpand={() => toggleSection('reports')}
              onView={(report) => alert(`Reporte: ${report.title}\nDetalles: ${report.details}\nEstado: ${report.status}`)}
            />

            <ReservationsSection
              reservations={reservations}
              onNewReservation={() => setIsReservationModalOpen(true)}
              onViewAll={() => handleOpenAllModal('all')}
              isExpanded={expandedSections.reservations}
              onToggleExpand={() => toggleSection('reservations')}
              onRefresh={refetchReservations}
            />

            <LostObjectsSection
              lostItems={lostItems}
              totalLostItems={totalLostItems}
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
              onMoveAllToPorteria={handleMoveAllToReception}
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
          classrooms={classroomsFormatted}
          isLoadingClassrooms={isLoadingClassrooms}
          classroomsError={classroomsError}
        />

        <CreateReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          onSubmit={handleReservationSubmit}
          classrooms={classroomsFormatted}
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
          title={selectedLostObject?.object || 'Preview'}
        />

        <ConfirmMoveToReceptionModal
          isOpen={isConfirmMoveModalOpen}
          onClose={() => setIsConfirmMoveModalOpen(false)}
          onConfirm={confirmMoveAllToReception}
          lostObjects={lostObjects}
          isLoading={isMovingToPorteria}
        />
      </section>
    </>
  )
}

export default ReportsPage
