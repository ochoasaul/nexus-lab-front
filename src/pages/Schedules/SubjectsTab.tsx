import Button from '@/components/ui/Button/Button'
import { SubjectModal } from './components/modals/SubjectModal'
import { useSubjects } from './useSubjects'
import { SubjectsFilters } from './components/SubjectsFilters'
import { SubjectCard } from './components/SubjectCard'

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
  } = useSubjects()

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Subject Management</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Monthly Subjects</h3>
          <p className="text-sm text-charcoal-500">
            Manage subjects, schedules, and assigned teachers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            label="Import Excel"
            variant="ghost"
            onClick={() => {
              // TODO: Implement Excel import
              alert('Excel import functionality coming soon')
            }}
          />
          <Button label="Add Subject" variant="secondary" onClick={handleAddSubject} />
        </div>
      </div>

      <SubjectsFilters
        filterBy={filterBy}
        filterValue={filterValue}
        onFilterByChange={handleFilterChange}
        onFilterValueChange={setFilterValue}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onEdit={handleEditSubject}
            onToggle={handleToggleSubject}
          />
        ))}
      </div>

      {subjects.length === 0 && (
        <p className="text-center text-sm text-charcoal-500 py-8">
          No subjects registered.
        </p>
      )}

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubjectSubmit}
        subject={selectedSubject}
        classrooms={classroomsFormatted}
        isLoadingClassrooms={isLoadingClassrooms}
      />
    </>
  )
}

