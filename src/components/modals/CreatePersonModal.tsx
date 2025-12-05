import { useState } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { personService, PersonType } from '@/services/personService'

interface CreatePersonModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (person: any) => void
}

export function CreatePersonModal({ isOpen, onClose, onSuccess }: CreatePersonModalProps) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        identity_card: '',
        gender: 'Masculino',
        birth_date: '',
        type: PersonType.STUDENT,
        registration: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name || !formData.birth_date) {
            setError('Por favor completa los campos requeridos')
            return
        }
        if (formData.type === PersonType.STUDENT && !formData.registration) {
            setError('La matrícula es requerida para estudiantes')
            return
        }

        setIsLoading(true)
        setError('')
        try {
            const newPerson = await personService.create(formData)
            onSuccess(newPerson)
            onClose()
        } catch (err: any) {
            setError(err.message || 'Error al crear persona')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Crear Nueva Persona"
            size="md"
        >
            <div className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Nombre *</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Apellido *</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">CI</label>
                        <input
                            type="text"
                            name="identity_card"
                            value={formData.identity_card}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Género *</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        >
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Fecha Nacimiento *</label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-1">Tipo *</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                    >
                        <option value={PersonType.STUDENT}>Estudiante</option>
                        <option value={PersonType.TEACHER}>Docente</option>
                        <option value={PersonType.NONE}>Ninguno</option>
                    </select>
                </div>

                {formData.type === PersonType.STUDENT && (
                    <div>
                        <label className="block text-sm font-medium text-charcoal-700 mb-1">Matrícula *</label>
                        <input
                            type="text"
                            name="registration"
                            value={formData.registration}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-charcoal-200 p-2.5 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
                    <Button label="Cancelar" variant="ghost" onClick={onClose} />
                    <Button
                        label={isLoading ? "Guardando..." : "Guardar"}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </Modal>
    )
}
