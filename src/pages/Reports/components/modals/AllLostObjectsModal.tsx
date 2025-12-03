import { useState, useMemo, FormEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { type LostObjectItem, LostObjectState } from '@/services/lostObjectService'
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

  // Sort objects: first Lost, then Reception, then Delivered
  const sortedLostObjects = useMemo(() => {
    const order = { [LostObjectState.Perdido]: 1, [LostObjectState.Porteria]: 2, [LostObjectState.Entregado]: 3 }
    return [...lostObjects].sort((a, b) => {
      const orderA = order[a.state as keyof typeof order] || 99
      const orderB = order[b.state as keyof typeof order] || 99
      if (orderA !== orderB) {
        return orderA - orderB
      }
      // If same state, sort by date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }, [lostObjects])

  // Aplicar filtros
  const filteredLostObjects = useMemo(() => {
    let filtered = sortedLostObjects

    // Filter by name
    if (searchName.trim()) {
      const searchLower = searchName.toLowerCase().trim()
      filtered = filtered.filter(obj =>
        obj.object.toLowerCase().includes(searchLower)
      )
    }

    // Filter by schedule
    if (selectedSchedule) {
      const schedule = SCHEDULE_TIMES.find(s => s.id === selectedSchedule)
      if (schedule) {
        filtered = filtered.filter(obj => {
          if (!obj.found_schedule) return false
          // Compare with full label or parts of schedule
          const horario = obj.found_schedule.trim()
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
    if (filterState === 'Perdido') return 'Lost Objects'
    if (filterState === 'Porteria') return 'Objects in Reception'
    if (filterState === 'Entregado') return 'Delivered Objects'
    return 'All Lost Objects'
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
            <h3 className="text-sm font-semibold text-charcoal-700">Filters</h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Name Filter */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Search by name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Object name..."
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
              />
            </div>

            {/* Schedule Filter */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Filter by schedule
              </label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
              >
                <option value="">All schedules</option>
                {SCHEDULE_TIMES.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Start Date
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
                End Date
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

        {/* Objects List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredLostObjects.length === 0 ? (
            <p className="text-sm text-charcoal-500 text-center py-8">
              {hasActiveFilters
                ? 'No objects found with applied filters.'
                : 'No lost objects registered.'}
            </p>
          ) : (
            <ul className="space-y-4">
              {filteredLostObjects.map((lost) => (
                <article key={lost.id} className="rounded-2xl border border-charcoal-100 bg-white p-4 min-h-[140px] flex flex-col">
                  <header className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-charcoal-900 mb-1">{lost.object}</h4>
                      <small className="text-xs text-charcoal-400 block">
                        {lost.found_date
                          ? `Found on ${new Date(lost.found_date).toLocaleDateString()}`
                          : 'Found date not registered'}
                        {lost.found_schedule && ` at ${lost.found_schedule}`}
                      </small>
                    </div>
                    <StatusBadge label={lost.state} />
                  </header>
                  <div className="mt-auto flex items-end justify-between gap-2">
                    {lost.classroom?.name && (
                      <p className="text-sm text-charcoal-600 py-1">Classroom: {lost.classroom.name}</p>
                    )}
                    <div className="flex gap-2">
                      {/* View Button - show object photo or delivery photo */}
                      {onView && (
                        <>
                          {((lost.state === LostObjectState.Perdido || lost.state === LostObjectState.Porteria) && lost.multimedia?.path) ||
                            (lost.state === LostObjectState.Entregado && lost.object_delivery?.[0]?.multimedia?.path) ? (
                            <Button
                              label="View"
                              variant="ghost"
                              onClick={() => onView(lost)}
                              className="text-xs px-2 py-1"
                            />
                          ) : null}
                        </>
                      )}
                      {/* Deliver Button - only if Lost */}
                      {lost.state === LostObjectState.Perdido && (
                        <Button
                          label="Deliver"
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

        {/* Footer with counter */}
        <div className="flex items-center justify-between pt-4 border-t border-charcoal-100">
          <p className="text-sm text-charcoal-500">
            Showing {filteredLostObjects.length} of {lostObjects.length} objects
          </p>
          <Button
            type="button"
            variant="ghost"
            label="Close"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  )
}

