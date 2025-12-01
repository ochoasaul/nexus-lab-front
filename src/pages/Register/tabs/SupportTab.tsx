import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { soporteService, type SoporteMateriaItem, type SoporteTecnicoItem } from '@/services/soporteService'
import { useToastStore } from '@/store/toastStore'
import { SoporteModal } from '../components/modals/SoporteModal'
import { EditSupportModal } from '../components/modals/EditSupportModal'

type SupportItem = SoporteMateriaItem | SoporteTecnicoItem
type SupportType = 'materia' | 'tecnico'

export function SupportTab() {
  const [supportMateria, setSupportMateria] = useState<SoporteMateriaItem[]>([])
  const [supportTecnico, setSupportTecnico] = useState<SoporteTecnicoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSupport, setSelectedSupport] = useState<SupportItem | null>(null)
  const [selectedType, setSelectedType] = useState<SupportType>('materia')
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    loadSupports()
  }, [])

  const loadSupports = async () => {
    setIsLoading(true)
    try {
      const [materia, tecnico] = await Promise.all([
        soporteService.getAllMateria(),
        soporteService.getAllTecnico(),
      ])
      setSupportMateria(materia)
      setSupportTecnico(tecnico)
    } catch (error: any) {
      addToast(error.message || 'Error loading supports', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      if (data.tipo === 'materia') {
        await soporteService.createMateria(data)
      } else {
        await soporteService.createTecnico(data)
      }
      await loadSupports()
      setIsCreateModalOpen(false)
      addToast('Support registered successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error registering support', 'error')
      throw error
    }
  }

  const handleUpdate = async (id: string | number, data: any, type: SupportType) => {
    try {
      if (type === 'materia') {
        await soporteService.updateMateria(id, data)
      } else {
        await soporteService.updateTecnico(id, data)
      }
      await loadSupports()
      setIsEditModalOpen(false)
      setSelectedSupport(null)
      addToast('Support updated successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error updating support', 'error')
      throw error
    }
  }

  const handleDelete = async (id: string | number, type: SupportType) => {
    if (!confirm('Are you sure you want to delete this support?')) {
      return
    }

    try {
      if (type === 'materia') {
        await soporteService.removeMateria(id)
      } else {
        await soporteService.removeTecnico(id)
      }
      await loadSupports()
      addToast('Support deleted successfully', 'success')
    } catch (error: any) {
      addToast(error.message || 'Error deleting support', 'error')
    }
  }

  const handleEdit = (support: SupportItem, type: SupportType) => {
    setSelectedSupport(support)
    setSelectedType(type)
    setIsEditModalOpen(true)
  }

  const allSupports: Array<{ item: SupportItem; type: SupportType }> = [
    ...supportMateria.map(item => ({ item, type: 'materia' as SupportType })),
    ...supportTecnico.map(item => ({ item, type: 'tecnico' as SupportType })),
  ].sort((a, b) => {
    const dateA = new Date(a.item.created_at).getTime()
    const dateB = new Date(b.item.created_at).getTime()
    return dateB - dateA
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Support Management</p>
          <h3 className="text-2xl font-semibold text-charcoal-900">Support Registrations</h3>
        </div>
        <Button
          label="Register Support"
          variant="secondary"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">Loading supports...</p>
      ) : allSupports.length === 0 ? (
        <p className="text-sm text-charcoal-500 py-8 text-center">No support registrations found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {allSupports.map(({ item, type }) => (
            <article
              key={`${type}-${item.id}`}
              className="rounded-2xl border border-charcoal-100 bg-white p-4"
            >
              <header className="mb-3 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-charcoal-900">{item.tipo}</h4>
                  <p className="text-sm text-charcoal-600 mt-1">{item.problema || 'No problem description'}</p>
                </div>
                <StatusBadge label={type === 'materia' ? 'Materia' : 'Tecnico'} />
              </header>
              <div className="space-y-2 text-sm text-charcoal-600">
                {item.solucion && (
                  <p>
                    <span className="font-medium">Solution:</span> {item.solucion}
                  </p>
                )}
                {item.fecha_hora && (
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(item.fecha_hora).toLocaleString()}
                  </p>
                )}
                {item.laboratorio && (
                  <p>
                    <span className="font-medium">Laboratory:</span> {item.laboratorio.nombre}
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  label="Edit"
                  variant="ghost"
                  onClick={() => handleEdit(item, type)}
                  className="text-xs"
                />
                <Button
                  label="Delete"
                  variant="ghost"
                  onClick={() => handleDelete(item.id, type)}
                  className="text-xs text-red-600 hover:text-red-700"
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <SoporteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      {selectedSupport && (
        <EditSupportModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedSupport(null)
          }}
          support={selectedSupport}
          type={selectedType}
          onSubmit={(data) => handleUpdate(selectedSupport.id, data, selectedType)}
        />
      )}
    </>
  )
}

