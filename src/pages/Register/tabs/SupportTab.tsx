import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button/Button'
import { SupportModal } from '../components/modals/SoporteModal'
import { useSupports } from '@/hooks/useSupport'

export function SupportTab() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { supports, isLoading, fetchSupports } = useSupports()

    useEffect(() => {
        fetchSupports()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-charcoal-900">
                    Support Tickets
                </h3>
                <Button
                    variant="primary"
                    label="Register Support"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            {isLoading ? (
                <div className="text-center py-8 text-charcoal-500">
                    Loading supports...
                </div>
            ) : supports.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50">
                    <p className="text-charcoal-500">No support tickets found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-charcoal-200 bg-white">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-charcoal-50 text-charcoal-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Problem</th>
                                <th className="px-6 py-3 font-medium">Solution</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal-100">
                            {supports.map((support: any) => (
                                <tr key={support.id} className="hover:bg-charcoal-25">
                                    <td className="px-6 py-4 text-charcoal-900">
                                        {support.date_time ? new Date(support.date_time).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-charcoal-900">
                                        {support.problem}
                                    </td>
                                    <td className="px-6 py-4 text-charcoal-600">
                                        {support.solution || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${support.solution
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {support.solution ? 'Resolved' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <SupportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchSupports()
                    setIsModalOpen(false)
                }}
            />
        </div>
    )
}
