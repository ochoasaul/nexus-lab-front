import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { CreateClassroomModal } from '../components/modals/CreateClassroomModal'
import { EditClassroomModal } from '../components/modals/EditClassroomModal' // Assuming this exists and works for details
import { useClassroom } from '@/hooks/useClassroom'
import { classroomService } from '@/services/classroomService'

export function ClassroomTab() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedClassroom, setSelectedClassroom] = useState<any>(null)
    const [classrooms, setClassrooms] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchClassrooms = async () => {
        setIsLoading(true)
        try {
            const data = await classroomService.getAllWithDetails()
            setClassrooms(data)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchClassrooms()
    }, [])

    const handleEdit = (classroom: any) => {
        // Map classroom to the format expected by EditClassroomModal if needed
        // Assuming classroom has classroom_detail array or object
        const detail = classroom.classroom_detail?.[0] || {}
        setSelectedClassroom({
            ...detail,
            id: detail.id || classroom.id, // Fallback
            classroom_id: classroom.id,
            student_capacity: detail.student_capacity || 0,
            computer_count: detail.computer_count,
            projector_installed: detail.projector_installed || false,
            air_conditioning: detail.air_conditioning || false,
            name: classroom.name // Pass name for display if needed
        })
        setIsEditModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-charcoal-900">
                    Classrooms
                </h3>
                <Button
                    variant="primary"
                    label="New Classroom"
                    onClick={() => setIsCreateModalOpen(true)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-charcoal-500">
                    Loading classrooms...
                </div>
            ) : classrooms.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50">
                    <p className="text-charcoal-500">No classrooms found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-charcoal-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-charcoal-50 text-charcoal-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Block</th>
                                <th className="px-6 py-3 font-medium">State</th>
                                <th className="px-6 py-3 font-medium">Capacity</th>
                                <th className="px-6 py-3 font-medium">Computers</th>
                                {/* <th className="px-6 py-3 font-medium">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-100">
                            {classrooms.map((classroom: any) => {
                                const detail = classroom.classroom_detail?.[0]
                                return (
                                    <tr key={classroom.id} className="hover:bg-charcoal-25">
                                        <td className="px-6 py-4 text-charcoal-900 font-medium">
                                            {classroom.name}
                                        </td>
                                        <td className="px-6 py-4 text-charcoal-600">
                                            {classroom.block || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classroom.state === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {classroom.state || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal-600">
                                            {detail?.student_capacity || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-charcoal-600">
                                            {detail?.computer_count || '-'}
                                        </td>
                                        {/* <td className="px-6 py-4">
                    <button 
                      onClick={() => handleEdit(classroom)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Edit Details
                    </button>
                  </td> */}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <CreateClassroomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    fetchClassrooms()
                    setIsCreateModalOpen(false)
                }}
            />

            {/* Edit Modal integration would go here if we enable editing details */}
        </div>
    )
}
