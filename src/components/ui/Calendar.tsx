import { useState } from 'react'

interface CalendarProps {
    selectedDates: string[]
    existingDates?: string[]
    onDateSelect: (date: Date) => void
    isDateSelectable: (date: Date) => boolean
}

export function Calendar({ selectedDates, existingDates = [], onDateSelect, isDateSelectable }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay() // 0 = Sun
        return { days, firstDay, year, month }
    }

    const generateCalendarDays = (date: Date) => {
        const { days, firstDay, year, month } = getDaysInMonth(date)
        const calendarDays = []

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(null)
        }

        // Days of month
        for (let i = 1; i <= days; i++) {
            calendarDays.push(new Date(year, month, i))
        }

        return calendarDays
    }

    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

    const calendars = [
        { date: currentMonth, days: generateCalendarDays(currentMonth) },
        { date: nextMonth, days: generateCalendarDays(nextMonth) }
    ]

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-charcoal-900">Seleccionar Fechas ({selectedDates.length})</h3>
                <div className="flex gap-2 md:hidden">
                    <button onClick={goToPreviousMonth} className="p-1 hover:bg-charcoal-100 rounded">←</button>
                    <button onClick={goToNextMonth} className="p-1 hover:bg-charcoal-100 rounded">→</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {calendars.map((calendar, idx) => (
                    <div key={idx} className={`border border-charcoal-100 rounded-xl p-4 ${idx === 1 ? 'hidden md:block' : ''}`}>
                        <div className="text-center font-medium mb-3 capitalize">
                            {calendar.date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-charcoal-500">
                            <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendar.days.map((date, dIdx) => {
                                if (!date) return <div key={dIdx} />

                                const dateStr = date.toISOString().split('T')[0]
                                const isSelectable = isDateSelectable(date)
                                const isSelected = selectedDates.includes(dateStr)
                                const isExisting = existingDates.includes(dateStr)

                                return (
                                    <button
                                        key={dIdx}
                                        onClick={() => onDateSelect(date)}
                                        disabled={!isSelectable || isExisting}
                                        className={`
                                            h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-xs md:text-sm transition-colors mx-auto
                                            ${isExisting
                                                ? 'bg-primary-100 text-primary-700 font-medium cursor-not-allowed'
                                                : isSelected
                                                    ? 'bg-primary-600 text-white'
                                                    : ''
                                            }
                                            ${!isSelected && !isExisting && isSelectable ? 'hover:bg-primary-50 text-charcoal-900' : ''}
                                            ${!isSelectable && !isExisting ? 'text-charcoal-300 cursor-not-allowed' : ''}
                                        `}
                                        title={isExisting ? 'Fecha ya reservada' : ''}
                                    >
                                        {date.getDate()}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
