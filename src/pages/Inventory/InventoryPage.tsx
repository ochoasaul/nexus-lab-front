import Button from '@/components/ui/Button/Button'
import { Panel } from '@/components/dashboard/Panel'
import { CreateInventoryModal } from './components/modals/CreateInventoryModal'
import { EditInventoryModal } from './components/modals/EditInventoryModal'
import { useInventoryPage } from './useInventoryPage'
import { LaboratorioSelector } from './components/LaboratorioSelector'
import { InventoryList } from './components/InventoryList'
import { QuickActions } from '@/components/dashboard/QuickActions'
function InventoryPage() {
  const {
    user,
    isSuperAdmin,
    laboratorios,
    isLoadingLabs,
    selectedLaboratorioId,
    setSelectedLaboratorioId,
    selectedLaboratorio,
    inventory,
    isLoading,
    error,
    laboratorioIdToUse,
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
        Inicia sesión para ver el inventario.
      </section>
    )
  }

  if (isSuperAdmin && !selectedLaboratorioId && !isLoadingLabs) {
    return (
      <Panel title="Inventario">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-charcoal-600 mb-4">
              Selecciona un laboratorio para ver su inventario:
            </p>
            <LaboratorioSelector
              laboratorios={laboratorios}
              isLoading={isLoadingLabs}
              onSelect={(id) => setSelectedLaboratorioId(id)}
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
          title="Inventario"
          actions={
            <div className="flex gap-2">
              {isSuperAdmin && selectedLaboratorioId && (
                <Button
                  label="Cambiar laboratorio"
                  variant="ghost"
                  onClick={() => setSelectedLaboratorioId(undefined)}
                  className="text-xs"
                />
              )}
              <Button
                label="Agregar producto"
                variant="secondary"
                onClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          }
        >
          {isSuperAdmin && selectedLaboratorioId && selectedLaboratorio && (
            <div className="mb-4 rounded-2xl border border-primary-200 bg-primary-50 p-3">
              <p className="text-sm text-primary-700">
                <strong>Laboratorio seleccionado:</strong> {selectedLaboratorio.nombre}
              </p>
            </div>
          )}

          {isLoading && (
            <p className="text-sm text-charcoal-500 py-8 text-center">Cargando inventario...</p>
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
          laboratorioId={laboratorioIdToUse}
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
