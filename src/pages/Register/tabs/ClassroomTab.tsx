import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { classroomDetailService, type ClassroomDetailItem } from '@/services/classroomDetailService'
import { useToastStore } from '@/store/toastStore'
import { ClassroomRegistrationModal } from '../components/modals/ClassroomRegistrationModal'
import { EditClassroomModal } from '../components/modals/EditClassroomModal'

export function ClassroomTab() {
  const [classrooms, setClassrooms] = useState<ClassroomDetailItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomDetailItem | null>(null)
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    loadClassrooms()
  }, [])

  const loadClassrooms = async () => {
    setIsLoading(true)
    try {
      const data = await classroomDetailService.getAll()
      setClassrooms(data)
    } catch (error: any) {
      addToast(error.message || 'Error loading classrooms', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      await classroomDetailService.create(data)
      await loadClassrooms()
      setIsCreateModalOpen(false)
      addToast('Classroom registered successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error registering classroom', 'error')
      throw error
    }
  }

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      await classroomDetailService.update(id, data)
      await loadClassrooms()
      setIsEditModalOpen(false)
      setSelectedClassroom(null)
      addToast('Classroom updated successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error updating classroom', 'error')
      throw error
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this classroom detail?')) {
      return
    }

    try {
      await classroomDetailService.remove(id)
      await loadClassrooms()
      addToast('Classroom deleted successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error deleting classroom', 'error')
    }
  }

  const handleEdit = (classroom: ClassroomDetailItem) => {
    setSelectedClassroom(classroom)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Classroom Management</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Classroom Registrations</h3>
        </div>
        <Button
          label="Register Classroom"
          variant="secondary"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">Loading classrooms...</p>
      ) : classrooms.length === 0 ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">No classroom registrations found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classrooms.map((classroom) => (
            <article
              key={classroom.id}
              className="rounded-2xl border border-charcoal-100 bg-white p-4"
            >
              <header className="mb-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-charcoal-900">
                    {classroom.aula?.nombre || 'Unassigned Classroom'}
                  </h4>
                </div>
              </header>
              <div className="space-y-2 text-sm text-charcoal-600">
                <p>
                  <span className="font-medium">Student Capacity:</span> {classroom.capacidad_alumnos}
                </p>
                {classroom.num_computadoras !== null && (
                  <p>
                    <span className="font-medium">Computers:</span> {classroom.num_computadoras}
                  </p>
                )}
                <p>
                  <span className="font-medium">Projector:</span>{' '}
                  {classroom.proyector_instalado ? 'Yes' : 'No'}
                </p>
                <p>
                  <span className="font-medium">Air Conditioning:</span>{' '}
                  {classroom.aire_acondicionado ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  label="Edit"
                  variant="ghost"
                  onClick={() => handleEdit(classroom)}
                  className="text-xs"
                />
                <Button
                  label="Delete"
                  variant="ghost"
                  onClick={() => handleDelete(classroom.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <ClassroomRegistrationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      {selectedClassroom && (
        <EditClassroomModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedClassroom(null)
          }}
          classroom={selectedClassroom}
          onSubmit={handleUpdate}
        />
      )}
    </>
  )
}

