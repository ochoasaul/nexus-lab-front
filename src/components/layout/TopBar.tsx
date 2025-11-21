import { useAuth } from '../../hooks/useAuth'

export function TopBar() {
  const { user, logout } = useAuth()

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal-100 bg-surface px-4 py-4 shadow-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Panel de control</p>
        <h1 className="text-xl font-semibold text-charcoal-900">{user ? 'Bienvenido, ' + user.name : 'Bienvenido'}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right text-sm text-charcoal-500 md:block">
          <p className="font-semibold text-charcoal-900">{user?.name ?? 'Invitado'}</p>
          <span className="text-primary-600 uppercase tracking-wide text-xs">{user?.role ?? 'Supervisión'}</span>
        </div>
      </div>
    </div>
  )
}
