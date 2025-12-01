import Button from '@/components/ui/Button/Button'
import { MateriaModal } from './components/modals/MateriaModal'
import { useMaterias } from './useMaterias'
import { MateriasFilters } from './components/MateriasFilters'
import { MateriaCard } from './components/MateriaCard'

export function MateriasTab() {
  const {
    materias,
    isMateriaModalOpen,
    selectedMateria,
    filterBy,
    filterValue,
    setFilterValue,
    aulasFormatted,
    isLoadingAulas,
    handleAddMateria,
    handleEditMateria,
    handleToggleMateria,
    handleMateriaSubmit,
    handleCloseModal,
    handleFilterChange,
  } = useMaterias()

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Gestión de materias</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Materias del mes</h3>
          <p className="text-sm text-charcoal-500">
            Administra las materias, horarios y docentes asignados.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            label="Importar Excel"
            variant="ghost"
            onClick={() => {
              // TODO: Implementar importación de Excel
              alert('Funcionalidad de importación de Excel próximamente')
            }}
          />
          <Button label="Agregar materia" variant="secondary" onClick={handleAddMateria} />
        </div>
      </div>

      <MateriasFilters
        filterBy={filterBy}
        filterValue={filterValue}
        onFilterByChange={handleFilterChange}
        onFilterValueChange={setFilterValue}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {materias.map((materia) => (
          <MateriaCard
            key={materia.id}
            materia={materia}
            onEdit={handleEditMateria}
            onToggle={handleToggleMateria}
          />
        ))}
      </div>

      {materias.length === 0 && (
        <p className="text-center text-sm text-charcoal-500 py-8">
          No hay materias registradas.
        </p>
      )}

      <MateriaModal
        isOpen={isMateriaModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleMateriaSubmit}
        materia={selectedMateria}
        aulas={aulasFormatted}
        isLoadingAulas={isLoadingAulas}
      />
    </>
  )
}

