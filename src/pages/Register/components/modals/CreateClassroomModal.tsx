import { useState, FormEvent } from 'react'
import { Modal } from '@/components/modals/BaseModal'
import Button from '@/components/ui/Button/Button'
import { useCreateClassroom } from '@/hooks/useClassroom'

interface CreateClassroomModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function CreateClassroomModal({
    isOpen,
    onClose,
    onSuccess,
}: CreateClassroomModalProps) {
    const [name, setName] = useState('')
    const [block, setBlock] = useState('')
    const [state, setState] = useState('Active')

    const { mutate: createClassroom, isPending } = useCreateClassroom()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        createClassroom(
            {
                name: name.trim(),
                block: block.trim() || undefined,
                state: state,
            },
            {
                onSuccess: () => {
                    resetForm()
                    onClose()
                    onSuccess?.()
                },
            }
        )
    }

    const resetForm = () => {
        setName('')
        setBlock('')
        setState('Active')
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create Classroom" size="md">
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Name <span className="text-primary-600">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Lab 1, Room 101"
                        required
                        className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        Block
                    </label>
                    <input
                        type="text"
                        value={block}
                        onChange={(e) => setBlock(e.target.value)}
                        placeholder="e.g. Block A"
                        className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">
                        State
                    </label>
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-2.5 text-charcoal-900 focus:border-primary-400 focus:outline-none"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-charcoal-100">
                    <Button
                        type="button"
                        variant="ghost"
                        label="Cancel"
                        onClick={handleClose}
                        disabled={isPending}
                    />
                    <Button
                        type="submit"
                        label="Create"
                        variant="primary"
                        loading={isPending}
                        disabled={!name.trim()}
                    />
                </div>
            </form>
        </Modal>
    )
}
