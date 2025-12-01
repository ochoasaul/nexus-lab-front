import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button/Button'
import { HomeIcon, InventoryIcon, UsersIcon, ReportIcon, CalendarIcon, LogoutIcon, RegisterIcon } from '@/components/icons/Icons'

const navItems = [
  { id: 'overview', label: 'Panel principal', href: '/dashboard', Icon: HomeIcon },
  { id: 'schedules', label: 'Horarios', href: '/schedules', Icon: CalendarIcon },
  { id: 'tasks', label: 'Tareas', href: '/tasks', Icon: ReportIcon },
  { id: 'inventory', label: 'Inventario', href: '/inventory', Icon: InventoryIcon },
  { id: 'reports', label: 'Reportes', href: '/reports', Icon: ReportIcon },
  { id: 'users', label: 'Usuarios', href: '/users', Icon: UsersIcon },
  { id: 'register', label: 'Registro', href: '/register', Icon: RegisterIcon },
]

export function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-charcoal-200 shadow-md"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-sidebar-open' : ''}`}>
        <Link to="/" className="brand" onClick={() => setIsMobileMenuOpen(false)}>
          NexusLab
          <span className="brand-sub">Control de laboratorios</span>
        </Link>
        <div className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.id === 'overview' && location.pathname === '/')
            const Icon = (item as any).Icon as React.ComponentType<any>
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`nav-item ${isActive ? 'nav-item-active' : 'text-charcoal-500'}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {Icon ? <Icon className="w-5 h-5 mr-3 text-charcoal-600" aria-hidden="true" /> : null}
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className="session-card">
          <p className="session-title">Sesión</p>
          <p className="mt-1">
            {user?.persona && Array.isArray(user.persona) && user.persona.length > 0
              ? `${user.persona[0].nombre} ${user.persona[0].apellido || ''}`.trim() || user.usuario
              : user?.usuario || 'Invitado'}
          </p>
          <span className="text-primary-600">
            {user?.rol && Array.isArray(user.rol) && user.rol.length > 0
              ? user.rol[0].nombre
              : 'sin rol'}
          </span>
          <div className="mt-3">
            <Button label="Cerrar sesión" variant="ghost" onClick={logout} Icon={LogoutIcon} />
          </div>
        </div>
      </aside>
    </>
  )
}
