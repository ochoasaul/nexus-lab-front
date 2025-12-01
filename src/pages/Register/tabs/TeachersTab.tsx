import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { teacherService, type TeacherItem } from '@/services/teacherService'
import { useToastStore } from '@/store/toastStore'
import { TeacherRegistrationModal } from '../components/modals/TeacherRegistrationModal'
import { EditTeacherModal } from '../components/modals/EditTeacherModal'

export function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null)
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = async () => {
    setIsLoading(true)
    try {
      const data = await teacherService.getAll()
      setTeachers(data)
    } catch (error: any) {
      addToast(error.message || 'Error loading teachers', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      await teacherService.create(data)
      await loadTeachers()
      setIsCreateModalOpen(false)
      addToast('Teacher registered successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error registering teacher', 'error')
      throw error
    }
  }

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      await teacherService.update(id, data)
      await loadTeachers()
      setIsEditModalOpen(false)
      setSelectedTeacher(null)
      addToast('Teacher updated successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error updating teacher', 'error')
      throw error
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) {
      return
    }

    try {
      await teacherService.remove(id)
      await loadTeachers()
      addToast('Teacher deleted successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error deleting teacher', 'error')
    }
  }

  const handleEdit = (teacher: TeacherItem) => {
    setSelectedTeacher(teacher)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Teacher Management</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Teacher Registrations</h3>
        </div>
        <Button
          label="Register Teacher"
          variant="secondary"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">No teacher registrations found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher) => (
            <article
              key={teacher.id}
              className="rounded-2xl border border-charcoal-100 bg-white p-4"
            >
              <header className="mb-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-charcoal-900">
                    {teacher.persona
                      ? `${teacher.persona.nombre} ${teacher.persona.apellido || ''}`.trim()
                      : 'Unassigned Teacher'}
                  </h4>
                  {teacher.persona?.carnet && (
                    <p className="text-xs text-charcoal-500 mt-1">ID: {teacher.persona.carnet}</p>
                  )}
                </div>
                {teacher.estado && <StatusBadge label={teacher.estado} />}
              </header>
              <div className="space-y-2 text-sm text-charcoal-600">
                {teacher.created_at && (
                  <p>
                    <span className="font-medium">Registered:</span>{' '}
                    {new Date(teacher.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  label="Edit"
                  variant="ghost"
                  onClick={() => handleEdit(teacher)}
                  className="text-xs"
                />
                <Button
                  label="Delete"
                  variant="ghost"
                  onClick={() => handleDelete(teacher.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <TeacherRegistrationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      {selectedTeacher && (
        <EditTeacherModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedTeacher(null)
          }}
          teacher={selectedTeacher}
          onSubmit={handleUpdate}
        />
      )}
    </>
  )
}

