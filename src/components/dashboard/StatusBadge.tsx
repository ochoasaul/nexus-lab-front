const toneMap: Record<string, string> = {
  operativo: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  mantenimiento: 'border-amber-200 bg-amber-50 text-amber-700',
  abierto: 'border-amber-200 bg-amber-50 text-amber-700',
  en_proceso: 'border-primary-200 bg-primary-50 text-primary-700',
  pendiente: 'border-primary-200 bg-primary-50 text-primary-700',
  cerrado: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  devuelto: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  aprobada: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rechazada: 'border-primary-200 bg-primary-50 text-primary-700',
}

type StatusBadgeProps = {
  label: string
}

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${toneMap[label] ?? 'border-charcoal-200 bg-charcoal-50 text-charcoal-600'}`}>
      {label}
    </span>
  )
}
