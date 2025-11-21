import type { ReactNode } from 'react'

type PanelProps = {
  title?: string
  actions?: ReactNode
  variant?: 'default' | 'inverted'
  className?: string
  children: ReactNode
}

export function Panel({ title, actions, variant = 'default', className = '', children }: PanelProps) {
  const tone = variant === 'inverted' ? 'bg-charcoal-900 text-white' : 'bg-surface text-charcoal-900'
  const border = variant === 'inverted' ? 'border-charcoal-800 shadow-lg shadow-black/40' : 'border-charcoal-100 shadow-sm'

  return (
    <section className={`panel-shell ${tone} ${border} ${className}`.trim()}>
      {title && (
        <header className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-charcoal-400">{title}</p>
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  )
}
