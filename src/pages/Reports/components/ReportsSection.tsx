import { useMemo } from 'react'
import Button from '@/components/ui/Button/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { LabReport } from '@/mocks/labs'

interface ReportsSectionProps {
  reports: LabReport[]
  onNewReport: () => void
  onViewAll: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}

export function ReportsSection({ reports, onNewReport, onViewAll, isExpanded, onToggleExpand }: ReportsSectionProps) {
  const displayedReports = useMemo(() => reports.slice(0, 5), [reports])

  return (
    <section className="rounded-2xl border border-charcoal-100 bg-white p-4 md:border-0 md:bg-transparent md:p-0">
      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Reportes abiertos</p>
        <div className="flex gap-2">
          <Button label="Nuevo reporte" variant="ghost" onClick={onNewReport} className="text-xs" />
          {reports.length > 5 && (
            <Button
              label={`Ver todos (${reports.length})`}
              variant="ghost"
              onClick={onViewAll}
              className="text-xs"
            />
          )}
          <button
            type="button"
            onClick={onToggleExpand}
            className="md:hidden p-1 rounded-lg hover:bg-charcoal-100"
            aria-label="Expandir sección"
          >
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`md:block ${isExpanded ? 'block' : 'hidden'}`}>
        <ul className="space-y-4">
          {displayedReports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-charcoal-100 bg-white p-4 min-h-[140px] flex flex-col">
              <header className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-charcoal-400">{report.type}</p>
                  <h4 className="text-lg font-semibold text-charcoal-900 break-words">{report.title}</h4>
                </div>
                <StatusBadge label={report.status} />
              </header>
              <div className="mt-auto">
                <p className="text-sm text-charcoal-600 break-words">{report.details}</p>
                <small className="text-xs text-charcoal-400">Actualizado {report.updatedAt}</small>
              </div>
            </article>
          ))}
        </ul>
      </div>
    </section>
  )
}

