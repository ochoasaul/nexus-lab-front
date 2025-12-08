import { useState, useEffect } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personService, type Person } from '@/services/personService'
import { reservationService } from '@/services/reservationService'
import { CreatePersonModal } from '@/components/modals/CreatePersonModal'
import { Calendar } from '@/components/ui/Calendar'

interface CreateReservationModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => Promise<void> | void
    classrooms: { id: string | number; name: string }[]
}

const SCHEDULE_OPTIONS = [
    "7:15 - 10:00",
    "10:15 - 13:00",
    "13:15 - 16:00",
    "16:15 - 19:00",
    "19:15 - 21:45",
    "Other"
]

const DAY_TYPE_OPTIONS = [
    { value: 'Modular', label: 'Modular (Lun-Vie)', days: [1, 2, 3, 4, 5] },
    { value: 'Martes y Jueves', label: 'Martes y Jueves', days: [2, 4] },
    { value: 'Lunes y Miercoles', label: 'Lunes y Miércoles', days: [1, 3] },
    { value: 'Viernes y Sabado', label: 'Viernes y Sábado', days: [5, 6] },
    { value: 'Variado', label: 'Variado', days: [] } // Empty means any
]

export function CreateReservationModal({ isOpen, onClose, onSubmit, classrooms }: CreateReservationModalProps) {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        subject: '',
        requester_person_id: '',
        classroom_id: '',
        student_count: '',
        schedule: '',
        day_type: '',
        observation: '',
        requirements: [] as { name: string; completed: boolean }[],
        dates: [] as string[]
    })

    const [newRequirement, setNewRequirement] = useState('')

    // Search state
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Person[]>([])
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
    const [isSearching, setIsSearching] = useState(false)

    // Available Classrooms State
    const [availableClassrooms, setAvailableClassrooms] = useState<{ id: string | number; name: string }[]>([])
    const [isLoadingClassrooms, setIsLoadingClassrooms] = useState(false)
    const [classroomError, setClassroomError] = useState<string | null>(null)
    const [isCreatePersonModalOpen, setIsCreatePersonModalOpen] = useState(false)

    const fetchAvailableClassrooms = async () => {
        if (formData.dates.length === 0) return

        setIsLoadingClassrooms(true)
        setClassroomError(null)
        setAvailableClassrooms([])
        try {
            const sortedDates = [...formData.dates].sort()
            const startDate = new Date(sortedDates[0]).toISOString()
            const endDate = new Date(sortedDates[sortedDates.length - 1]).toISOString()

            const payload = {
                dates: JSON.stringify(formData.dates),
                start_date: startDate,
                end_date: endDate,
                schedule: formData.schedule,
                day_type: formData.day_type,
                subject: formData.subject, // Optional but good to pass
                requester_person_id: formData.requester_person_id
            }

            const classrooms = await reservationService.getAvailableClassrooms(payload)
            setAvailableClassrooms(classrooms)
        } catch (error: any) {
            console.error('Error fetching available classrooms:', error)
            setClassroomError(error.message || 'Error al buscar aulas disponibles')
        } finally {
            setIsLoadingClassrooms(false)
        }
    }

    // Reset form on open
    useEffect(() => {
        if (isOpen) {
            setStep(1)
            setFormData({
                subject: '',
                requester_person_id: '',
                classroom_id: '',
                student_count: '',
                schedule: '',
                day_type: '',
                observation: '',
                requirements: [],
                dates: []
            })
            setFormData({
                subject: '',
                requester_person_id: '',
                classroom_id: '',
                student_count: '',
                schedule: '',
                day_type: '',
                observation: '',
                requirements: [],
                dates: []
            })
            setSearchQuery('')
            setSearchResults([])
            setSelectedPerson(null)
            setSelectedPerson(null)
            setAvailableClassrooms([])
            setClassroomError(null)
        }
    }, [isOpen])

    // Search effect
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            return
        }

        const timeout = setTimeout(async () => {
            setIsSearching(true)
            try {
                const results = await personService.search(searchQuery.trim(), 1, 20)
                setSearchResults(results)
            } catch (err) {
                console.error('Error searching persons:', err)
            } finally {
                setIsSearching(false)
            }
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchQuery])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Reset dates if day_type changes
        if (name === 'day_type') {
            setFormData(prev => ({ ...prev, dates: [], day_type: value }))
        }
    }

    const addRequirement = () => {
        if (newRequirement.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, { name: newRequirement.trim(), completed: false }]
            }))
            setNewRequirement('')
        }
    }

    const removeRequirement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }))
    }

    const isDateSelectable = (date: Date) => {
        if (!formData.day_type) return false
        if (formData.day_type === 'Variado') return true

        const selectedType = DAY_TYPE_OPTIONS.find(d => d.value === formData.day_type)
        if (!selectedType) return false

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return false;

        const dayOfWeek = date.getDay() // 0 = Sun
        return selectedType.days.includes(dayOfWeek)
    }

    const toggleDate = (date: Date) => {
        if (!isDateSelectable(date)) return

        const dateStr = date.toISOString().split('T')[0]
        setFormData(prev => {
            const exists = prev.dates.includes(dateStr)
            if (exists) {
                return { ...prev, dates: prev.dates.filter(d => d !== dateStr) }
            } else {
                return { ...prev, dates: [...prev.dates, dateStr].sort() }
            }
        })
    }

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const handleSubmit = async () => {
        // Calculate start and end date from selected dates
        if (formData.dates.length === 0) return

        setIsSubmitting(true)
        setSubmitError(null)

        const sortedDates = [...formData.dates].sort()
        // Create Date objects and convert to ISO string to satisfy backend validation
        const startDate = new Date(sortedDates[0]).toISOString()
        const endDate = new Date(sortedDates[sortedDates.length - 1]).toISOString()

        const payload = {
            ...formData,
            start_date: startDate,
            end_date: endDate,
            requirements: JSON.stringify(formData.requirements),
            dates: JSON.stringify(formData.dates)
        }

        try {
            await onSubmit(payload)
            onClose()
        } catch (error: any) {
            console.error('Error submitting reservation:', error)
            setSubmitError(error.message || 'Error al crear la reserva')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nueva Reserva"
            size="lg"
        >
            <div className="space-y-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Materia</label>
                                <input
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                    placeholder="Ej. Programación I"
                                />
                            </div>

                            {/* Person Search */}
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Solicitante</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={selectedPerson ? `${selectedPerson.first_name} ${selectedPerson.last_name}` : searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        readOnly={!!selectedPerson}
                                        className={`w-full rounded-xl border p-2.5 focus:outline-none ${selectedPerson
                                            ? 'border-primary-200 bg-primary-50 text-primary-900 pr-10'
                                            : 'border-charcoal-200 focus:border-primary-500'
                                            }`}
                                        placeholder="Buscar persona..."
                                    />

                                    {isSearching && !selectedPerson && (
                                        <div className="absolute right-3 top-3">
                                            <div className="animate-spin h-4 w-4 border-2 border-primary-500 rounded-full border-t-transparent"></div>
                                        </div>
                                    )}

                                    {selectedPerson && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedPerson(null)
                                                setFormData(prev => ({ ...prev, requester_person_id: '' }))
                                                setSearchQuery('')
                                            }}
                                            className="absolute right-3 top-2.5 text-charcoal-400 hover:text-red-500 p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Dropdown for results or create option */}
                                    {(searchResults.length > 0 || (searchQuery && !selectedPerson)) && (
                                        <div className="absolute z-10 mt-1 w-full bg-white border border-charcoal-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                            {searchResults.map((person) => (
                                                <button
                                                    key={person.id}
                                                    type="button"
                                                    className="w-full text-left px-4 py-2 hover:bg-charcoal-50 text-sm"
                                                    onClick={() => {
                                                        setSelectedPerson(person)
                                                        setFormData(prev => ({ ...prev, requester_person_id: String(person.id) }))
                                                        setSearchResults([])
                                                        setSearchQuery('')
                                                    }}
                                                >
                                                    <div className="font-medium">{person.first_name} {person.last_name}</div>
                                                    {person.identity_card && (
                                                        <div className="text-xs text-charcoal-500">CI: {person.identity_card}</div>
                                                    )}
                                                </button>
                                            ))}

                                            {/* Create Option */}
                                            <button
                                                className="w-full text-left px-4 py-2 text-primary-600 hover:bg-primary-50 font-medium border-t border-charcoal-100 flex items-center gap-2"
                                                onClick={() => {
                                                    setIsCreatePersonModalOpen(true)
                                                    setIsSearching(false)
                                                }}
                                            >
                                                <span>+</span>
                                                {searchResults.length === 0 && searchQuery ? (
                                                    <span>Crear persona: "{searchQuery}"</span>
                                                ) : (
                                                    <span>Crear Nueva Persona</span>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Classroom removed from here */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Cant. Estudiantes</label>
                                <input
                                    name="student_count"
                                    type="number"
                                    value={formData.student_count}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Horario</label>
                                <select
                                    name="schedule"
                                    value={formData.schedule}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                >
                                    <option value="">Seleccionar</option>
                                    {SCHEDULE_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-charcoal-700 mb-1">Tipo de Días</label>
                                <select
                                    name="day_type"
                                    value={formData.day_type}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                >
                                    <option value="">Seleccionar</option>
                                    {DAY_TYPE_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-medium text-charcoal-700 mb-2">Requerimientos</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    value={newRequirement}
                                    onChange={(e) => setNewRequirement(e.target.value)}
                                    className="flex-1 rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                    placeholder="Agregar requerimiento"
                                    onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
                                />
                                <Button label="Agregar" onClick={addRequirement} variant="secondary" disabled={!newRequirement.trim()} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.requirements.map((req, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1 rounded-lg bg-charcoal-100 px-2 py-1 text-sm text-charcoal-700">
                                        {req.name}
                                        <button onClick={() => removeRequirement(idx)} className="text-charcoal-400 hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-charcoal-700 mb-1">Observación</label>
                            <textarea
                                name="observation"
                                value={formData.observation}
                                onChange={handleInputChange}
                                className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                rows={2}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                label="Siguiente: Seleccionar Fechas"
                                onClick={() => setStep(2)}
                                disabled={!formData.subject || !formData.requester_person_id || !formData.schedule || !formData.day_type}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Date Selection & Classroom */}
                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-charcoal-900">Seleccionar Fechas ({formData.dates.length})</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <Calendar
                                selectedDates={formData.dates}
                                onDateSelect={toggleDate}
                                isDateSelectable={isDateSelectable}
                            />
                        </div>

                        {/* Available Classrooms Section */}
                        <div className="pt-4 border-t border-charcoal-100">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-charcoal-900">Seleccionar Aula Disponible</h3>
                                <Button
                                    label={isLoadingClassrooms ? "Buscando..." : "Buscar Aulas"}
                                    onClick={fetchAvailableClassrooms}
                                    disabled={formData.dates.length === 0 || isLoadingClassrooms}
                                    variant="secondary"
                                />
                            </div>


                            {classroomError && (
                                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {classroomError}
                                </div>
                            )}

                            {availableClassrooms.length > 0 ? (
                                <div>
                                    <select
                                        name="classroom_id"
                                        value={formData.classroom_id}
                                        onChange={handleInputChange}
                                        className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                                    >
                                        <option value="">Seleccionar Aula</option>
                                        {availableClassrooms.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="text-sm text-charcoal-500 italic">
                                    {formData.dates.length === 0
                                        ? "Selecciona fechas para buscar aulas."
                                        : "Haz clic en 'Buscar Aulas' para ver disponibilidad."}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 pt-4 border-t border-charcoal-100">
                            {submitError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                    {submitError}
                                </div>
                            )}
                            <div className="flex justify-between">
                                <Button label="Atrás" variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting} />
                                <Button
                                    label={isSubmitting ? "Guardando..." : "Guardar Reserva"}
                                    onClick={handleSubmit}
                                    disabled={formData.dates.length === 0 || !formData.classroom_id || isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <CreatePersonModal
                isOpen={isCreatePersonModalOpen}
                onClose={() => setIsCreatePersonModalOpen(false)}
                onSuccess={(person) => {
                    setSelectedPerson(person)
                    setFormData(prev => ({ ...prev, requester_person_id: String(person.id) }))
                    setSearchQuery(`${person.first_name} ${person.last_name}`)
                    setIsCreatePersonModalOpen(false)
                }}
            />
        </Modal >
    )
}
