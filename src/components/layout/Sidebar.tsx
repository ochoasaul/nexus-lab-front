import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../Button/Button'
import { HomeIcon, InventoryIcon, UsersIcon, ReportIcon, CalendarIcon, LogoutIcon } from '../icons/Icons'

const navItems = [
  { id: 'overview', label: 'Panel principal', href: '/?view=overview', Icon: HomeIcon },
  { id: 'inventory', label: 'Inventario', href: '/dashboard?view=inventory', Icon: InventoryIcon },
  { id: 'users', label: 'Usuarios', href: '/dashboard?view=users', Icon: UsersIcon },
  { id: 'reports', label: 'Reportes', href: '/dashboard?view=reports', Icon: ReportIcon },
  { id: 'schedules', label: 'Horarios', href: '/dashboard?view=schedules', Icon: CalendarIcon },
  { id: 'tasks', label: 'Tareas', href: '/dashboard?view=tasks', Icon: ReportIcon },
]

export function Sidebar() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user, logout } = useAuth()
  const view = (searchParams.get('view') ?? 'overview').split('?')[0]

  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        MaquetaLab
        <span className="brand-sub">Control de laboratorios</span>
      </Link>
      <div className="mt-8 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = view === item.id
          const Icon = (item as any).Icon as React.ComponentType<any>
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`nav-item ${isActive ? 'nav-item-active' : 'text-charcoal-500'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {Icon ? <Icon className="w-5 h-5 mr-3 text-charcoal-600" aria-hidden="true" /> : null}
              {item.label}
            </Link>
          )
        })}
      </div>
      <div className="session-card">
        <p className="session-title">Sesión</p>
        <p className="mt-1">{user?.name ?? 'Invitado'}</p>
        <span className="text-primary-600">{user?.role ?? 'sin rol'}</span>
        <div className="mt-3">
          <Button label="Cerrar sesión" variant="ghost" onClick={logout} Icon={LogoutIcon} />
        </div>
      </div>
    </aside>
  )
}
