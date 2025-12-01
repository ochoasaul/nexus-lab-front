interface MateriasFiltersProps {
  filterBy: 'horario' | 'tipoDias'
  filterValue: string
  onFilterByChange: (filterBy: 'horario' | 'tipoDias') => void
  onFilterValueChange: (value: string) => void
}

export function MateriasFilters({
  filterBy,
  filterValue,
  onFilterByChange,
  onFilterValueChange,
}: MateriasFiltersProps) {
  return (
    <div className="mb-6 rounded-2xl border border-charcoal-200 bg-charcoal-50 p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-charcoal-700">Filtrar por:</label>
          <select
            value={filterBy}
            onChange={(e) => onFilterByChange(e.target.value as 'horario' | 'tipoDias')}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="horario">Horario</option>
            <option value="tipoDias">Tipo de días</option>
          </select>
        </div>
        {filterBy === 'horario' && (
          <select
            value={filterValue}
            onChange={(e) => onFilterValueChange(e.target.value)}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="">Todos los horarios</option>
            <option value="7:15 - 10:00">7:15 - 10:00</option>
            <option value="10:15 - 13:00">10:15 - 13:00</option>
            <option value="13:00 - 16:00">13:00 - 16:00</option>
            <option value="16:00 - 19:00">16:00 - 19:00</option>
            <option value="19:15 - 21:45">19:15 - 21:45</option>
          </select>
        )}
        {filterBy === 'tipoDias' && (
          <select
            value={filterValue}
            onChange={(e) => onFilterValueChange(e.target.value)}
            className="rounded-xl border border-charcoal-200 bg-white px-3 py-1.5 text-sm text-charcoal-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="">Todos los tipos</option>
            <option value="Modular">Modular</option>
            <option value="Viernes-Sábado">Viernes-Sábado</option>
            <option value="Martes-Jueves">Martes-Jueves</option>
            <option value="Lunes-Miércoles">Lunes-Miércoles</option>
            <option value="Sábado">Sábado</option>
          </select>
        )}
      </div>
    </div>
  )
}

