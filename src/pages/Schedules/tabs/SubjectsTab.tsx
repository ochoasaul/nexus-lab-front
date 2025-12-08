import Button from '@/components/ui/Button/Button'
import { SubjectModal } from '../components/modals/SubjectModal'
import { useSubjects } from '@/hooks/useSubjects'
import { SubjectsFilters } from '../components/SubjectsFilters'
import { SubjectCard } from '../components/SubjectCard'
import { Modal } from '@/components/modals/BaseModal'

import { ImportSubjectsModal } from '../components/modals/ImportSubjectsModal'
import { useState } from 'react'

export function SubjectsTab() {
  const {
    subjects,
    isSubjectModalOpen,
    selectedSubject,
    filterBy,
    filterValue,
    setFilterValue,
    classroomsFormatted,
    isLoadingClassrooms,
    handleAddSubject,
    handleEditSubject,
    handleToggleSubject,
    handleSubjectSubmit,
    handleCloseModal,
    handleFilterChange,
    isLoading,
    isConfirmModalOpen,
    subjectToToggle,
    confirmToggleSubject,
    handleCloseConfirmModal,
    isToggling
  } = useSubjects()

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  if (isLoading) {
    return <div className="p-8 text-center text-charcoal-500">Cargando materias...</div>
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Gestión de materias</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Materias asignadas</h3>
          <p className="text-sm text-charcoal-500">
            Visualiza y gestiona las materias asignadas a los docentes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            label="Importar Excel"
            variant="secondary"
            onClick={() => setIsImportModalOpen(true)}
          />
          <Button
            label="Asignar materia"
            variant="primary"
            onClick={handleAddSubject}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex rounded-2xl border border-charcoal-200 bg-white p-1">
          <button
            onClick={() => handleFilterChange('schedule')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${filterBy === 'schedule'
              ? 'bg-primary-50 text-primary-700'
              : 'text-charcoal-600 hover:bg-charcoal-50'
              }`}
          >
            Por Horario
          </button>
          <button
            onClick={() => handleFilterChange('daysType')}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${filterBy === 'daysType'
              ? 'bg-primary-50 text-primary-700'
              : 'text-charcoal-600 hover:bg-charcoal-50'
              }`}
          >
            Por Modalidad
          </button>
        </div>

        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder={filterBy === 'schedule' ? "Buscar por horario (ej. 7:00 - 9:00)" : "Buscar por modalidad"}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 pl-10 text-charcoal-900 placeholder-charcoal-400 focus:border-primary-400 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Grid de materias */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-charcoal-200 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal-50 text-charcoal-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-charcoal-900">No hay materias asignadas</h3>
          <p className="mt-1 text-sm text-charcoal-500">
            Comienza asignando una materia a un docente o importa desde Excel.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              label="Importar Excel"
              variant="secondary"
              onClick={() => setIsImportModalOpen(true)}
            />
            <Button
              label="Asignar materia"
              variant="primary"
              onClick={handleAddSubject}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onEdit={handleEditSubject}
              onToggle={handleToggleSubject}
            />
          ))}
        </div>
      )}

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubjectSubmit}
        subject={selectedSubject || null}
        classrooms={classroomsFormatted}
        isLoadingClassrooms={isLoadingClassrooms}
      />

      <ImportSubjectsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          // Refresh subjects list (we might need to expose fetchSubjects from hook or just reload page/wait for SWR if used)
          // For now, let's assume the user will see the toast and maybe refresh manually or we can trigger a refresh if we expose it.
          // Ideally, useSubjects should expose a refresh method.
          window.location.reload() // Simple brute force refresh for now or better expose refresh from hook
        }}
      />

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        title={subjectToToggle?.state === 'active' ? 'Deshabilitar materia' : 'Habilitar materia'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-charcoal-600">
            ¿Estás seguro que deseas {subjectToToggle?.state === 'active' ? 'deshabilitar' : 'habilitar'} la materia{' '}
            <span className="font-semibold text-charcoal-900">{subjectToToggle?.name}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              label="Cancelar"
              onClick={handleCloseConfirmModal}
            />
            <Button
              variant={subjectToToggle?.state === 'active' ? 'danger' : 'primary'}
              label={isToggling ? 'Procesando...' : (subjectToToggle?.state === 'active' ? 'Deshabilitar' : 'Habilitar')}
              onClick={confirmToggleSubject}
              disabled={isToggling}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}
