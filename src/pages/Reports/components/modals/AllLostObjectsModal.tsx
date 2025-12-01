import { useState, useMemo, FormEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { type LostObjectItem } from '@/services/lostObjectService'
import { SCHEDULE_TIMES } from '@/constants/scheduleTimes'

interface AllLostObjectsModalProps {
  isOpen: boolean
  onClose: () => void
  lostObjects: LostObjectItem[]
  onDeliver: (lostObject: LostObjectItem) => void
  onView?: (lostObject: LostObjectItem) => void
  filterState?: 'all' | 'Perdido' | 'Porteria' | 'Entregado'
}

export function AllLostObjectsModal({
  isOpen,
  onClose,
  lostObjects,
  onDeliver,
  onView,
  filterState = 'all',
}: AllLostObjectsModalProps) {
  const [searchName, setSearchName] = useState('')
  const [selectedSchedule, setSelectedSchedule] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Ordenar objetos: primero Perdido, luego Porteria, luego Entregado
  const sortedLostObjects = useMemo(() => {
    const order = { 'Perdido': 1, 'Porteria': 2, 'Entregado': 3 }
    return [...lostObjects].sort((a, b) => {
      const orderA = order[a.estado as keyof typeof order] || 99
      const orderB = order[b.estado as keyof typeof order] || 99
      if (orderA !== orderB) {
        return orderA - orderB
      }
      // Si tienen el mismo estado, ordenar por fecha (más recientes primero)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [lostObjects])

  // Aplicar filtros
  const filteredLostObjects = useMemo(() => {
    let filtered = sortedLostObjects

    // Filtro por nombre
    if (searchName.trim()) {
      const searchLower = searchName.toLowerCase().trim()
      filtered = filtered.filter(obj =>
        obj.objeto.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por horario
    if (selectedSchedule) {
      const schedule = SCHEDULE_TIMES.find(s => s.id === selectedSchedule)
      if (schedule) {
        filtered = filtered.filter(obj => {
          if (!obj.horario_encontrado) return false
          // Comparar con el label completo o partes del horario
          const horario = obj.horario_encontrado.trim()
          return horario === schedule.label ||
                 horario.includes(schedule.startTime) ||
                 horario.includes(schedule.endTime) ||
                 horario.includes(schedule.id.replace('-', ' - '))
        })
      }
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      filtered = filtered.filter(obj => {
        const objDate = new Date(obj.created_at).toISOString().split('T')[0]
        if (startDate && endDate) {
          return objDate >= startDate && objDate <= endDate
        }
        if (startDate) {
          return objDate >= startDate
        }
        if (endDate) {
          return objDate <= endDate
        }
        return true
      })
    }

    return filtered
  }, [sortedLostObjects, searchName, selectedSchedule, startDate, endDate])

  const handleClearFilters = () => {
    setSearchName('')
    setSelectedSchedule('')
    setStartDate('')
    setEndDate('')
  }

  const hasActiveFilters = searchName.trim() || selectedSchedule || startDate || endDate

  const getTitle = () => {
    if (filterState === 'Perdido') return 'Objetos Perdidos'
    if (filterState === 'Porteria') return 'Objetos en Portería'
    if (filterState === 'Entregado') return 'Objetos Entregados'
    return 'Todos los objetos perdidos'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="xl"
    >
      <div className="space-y-5">
        {/* Filtros */}
        <div className="rounded-2xl border border-charcoal-200 bg-charcoal-50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal-700">Filtros</h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro por nombre */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Buscar por nombre
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Nombre del objeto..."
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
              />
            </div>

            {/* Filtro por horario */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Filtrar por horario
              </label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
              >
                <option value="">Todos los horarios</option>
                {SCHEDULE_TIMES.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por rango de fechas */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Fecha inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Fecha fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Lista de objetos */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredLostObjects.length === 0 ? (
            <p className="text-sm text-charcoal-500 text-center py-8">
              {hasActiveFilters
                ? 'No se encontraron objetos con los filtros aplicados.'
                : 'No hay objetos perdidos registrados.'}
            </p>
          ) : (
            <ul className="space-y-4">
              {filteredLostObjects.map((lost) => (
                <article key={lost.id} className="rounded-2xl border border-charcoal-100 bg-white p-4 min-h-[140px] flex flex-col">
                  <header className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-charcoal-900 mb-1">{lost.objeto}</h4>
                      <small className="text-xs text-charcoal-400 block">
                        {lost.fecha_encontrado
                          ? `Encontrado el ${new Date(lost.fecha_encontrado).toLocaleDateString()}`
                          : 'Fecha encontrada no registrada'}
                        {lost.horario_encontrado && ` a las ${lost.horario_encontrado}`}
                      </small>
                    </div>
                    <StatusBadge label={lost.estado} />
                  </header>
                  <div className="mt-auto flex items-end justify-between gap-2">
                    {lost.aula?.nombre && (
                      <p className="text-sm text-charcoal-600 py-1">Aula: {lost.aula.nombre}</p>
                    )}
                    <div className="flex gap-2">
                      {/* Botón Ver - mostrar foto del objeto o entrega */}
                      {onView && (
                        <>
                          {((lost.estado === 'Perdido' || lost.estado === 'Porteria') && lost.multimedia?.ruta) || 
                           (lost.estado === 'Entregado' && lost.entrega_objeto?.[0]?.multimedia?.ruta) ? (
                            <Button
                              label="Ver"
                              variant="ghost"
                              onClick={() => onView(lost)}
                              className="text-xs px-2 py-1"
                            />
                          ) : null}
                        </>
                      )}
                      {/* Botón Entregar - solo si está Perdido */}
                      {lost.estado === 'Perdido' && (
                        <Button
                          label="Entregar"
                          variant="ghost"
                          onClick={() => onDeliver(lost)}
                          className="text-xs px-2 py-1"
                        />
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con contador */}
        <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
          <p className="text-sm text-charcoal-500">
            Mostrando {filteredLostObjects.length} de {lostObjects.length} objetos
          </p>
          <Button
            type="button"
            variant="ghost"
            label="Cerrar"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  )
}

