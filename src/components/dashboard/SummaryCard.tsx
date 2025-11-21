import type { ReactNode } from 'react'

type SummaryCardProps = {
  label: string
  value: number | string
  description: string
  icon?: ReactNode
}

export function SummaryCard({ label, value, description, icon }: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-charcoal-100 bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">{label}</p>
        {icon}
      </div>
      <strong className="mt-3 block text-3xl font-semibold text-charcoal-900">{value}</strong>
      <small className="text-sm text-charcoal-500">{description}</small>
    </article>
  )
}
