import Button from '@/components/ui/Button/Button'
import { Panel } from '@/components/dashboard/Panel'
import { CreateInventoryModal } from './components/modals/CreateInventoryModal'
import { EditInventoryModal } from './components/modals/EditInventoryModal'
import { useInventoryPage } from './useInventoryPage'
import { LaboratorySelector } from './components/LaboratorySelector'
import { InventoryList } from './components/InventoryList'
import { QuickActions } from '@/components/dashboard/QuickActions'
function InventoryPage() {
  const {
    user,
    isSuperAdmin,
    laboratories,
    isLoadingLabs,
    selectedLaboratoryId,
    setSelectedLaboratoryId,
    selectedLaboratory,
    inventory,
    isLoading,
    error,
    laboratoryIdToUse,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    selectedInventoryItem,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleEdit,
    handleCloseEdit,
  } = useInventoryPage()

  if (!user) {
    return (
      <section className="rounded-3xl border border-dashed border-charcoal-200 bg-surface p-12 text-center text-charcoal-500">
        Please log in to view inventory.
      </section>
    )
  }

  if (isSuperAdmin && !selectedLaboratoryId && !isLoadingLabs) {
    return (
      <Panel title="Inventory">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-charcoal-600 mb-4">
              Select a laboratory to view its inventory:
            </p>
            <LaboratorySelector
              laboratories={laboratories}
              isLoading={isLoadingLabs}
              onSelect={(id) => setSelectedLaboratoryId(id)}
            />
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <>
      <section className="grid gap-6">
        <QuickActions />
        <Panel
          title="Inventory"
          actions={
            <div className="flex gap-2">
              {isSuperAdmin && selectedLaboratoryId && (
                <Button
                  label="Change Laboratory"
                  variant="ghost"
                  onClick={() => setSelectedLaboratoryId(undefined)}
                  className="text-xs"
                />
              )}
              <Button
                label="Add Product"
                variant="secondary"
                onClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          }
        >
          {isSuperAdmin && selectedLaboratoryId && selectedLaboratory && (
            <div className="mb-4 rounded-2xl border border-primary-200 bg-primary-50 p-3">
              <p className="text-sm text-primary-700">
                <strong>Selected Laboratory:</strong> {selectedLaboratory.name}
              </p>
            </div>
          )}

          {isLoading && (
            <p className="text-sm text-charcoal-500 py-8 text-center">Loading inventory...</p>
          )}

          {error && (
            <p className="text-sm text-red-600 py-8 text-center">{error}</p>
          )}

          {!isLoading && !error && (
            <InventoryList
              inventory={inventory}
              isSuperAdmin={isSuperAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Panel>

        <CreateInventoryModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
          laboratoryId={laboratoryIdToUse}
        />

        <EditInventoryModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          onSubmit={handleUpdate}
          inventoryItem={selectedInventoryItem}
        />
      </section>
    </>
  )
}

export default InventoryPage
