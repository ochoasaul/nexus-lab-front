interface SubjectsFiltersProps {
  filterBy: 'schedule' | 'daysType'
  filterValue: string
  onFilterByChange: (filterBy: 'schedule' | 'daysType') => void
  onFilterValueChange: (value: string) => void
}

export function SubjectsFilters({
  filterBy,
  filterValue,
  onFilterByChange,
  onFilterValueChange,
}: SubjectsFiltersProps) {
  return (
    <div className="mb-6 rounded-2xl border border-charcoal-200 bg-charcoal-50 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-charcoal-700">Filter by:</label>
          <select
            value={filterBy}
            onChange={(e) => onFilterByChange(e.target.value as 'schedule' | 'daysType')}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="schedule">Schedule</option>
            <option value="daysType">Days Type</option>
          </select>
        </div>
        {filterBy === 'schedule' && (
          <select
            value={filterValue}
            onChange={(e) => onFilterValueChange(e.target.value)}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="">All schedules</option>
            <option value="7:15 - 10:00">7:15 - 10:00</option>
            <option value="10:15 - 13:00">10:15 - 13:00</option>
            <option value="13:00 - 16:00">13:00 - 16:00</option>
            <option value="16:00 - 19:00">16:00 - 19:00</option>
            <option value="19:15 - 21:45">19:15 - 21:45</option>
          </select>
        )}
        {filterBy === 'daysType' && (
          <select
            value={filterValue}
            onChange={(e) => onFilterValueChange(e.target.value)}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="">All types</option>
            <option value="Modular">Modular</option>
            <option value="Viernes-Sábado">Friday-Saturday</option>
            <option value="Martes-Jueves">Tuesday-Thursday</option>
            <option value="Lunes-Miércoles">Monday-Wednesday</option>
            <option value="Sábado">Saturday</option>
          </select>
        )}
      </div>
    </div>
  )
}

