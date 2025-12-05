import { useAuth } from '@/hooks/useAuth'
import { useMemo } from 'react'

export function TopBar() {
  const { user } = useAuth()

  const userName = useMemo(() => {
    if (!user?.person || !Array.isArray(user.person) || user.person.length === 0) {
      return user?.username || 'Invitado'
    }
    const person = user.person[0]
    return `${person.first_name} ${person.last_name || ''}`.trim() || user.username
  }, [user])

  const userRole = useMemo(() => {
    if (!user?.role || !Array.isArray(user.role) || user.role.length === 0) {
      return 'Sin rol'
    }
    return user.role[0].name || 'Sin rol'
  }, [user])

  const userLab = useMemo(() => {
    if (!user?.laboratory || !Array.isArray(user.laboratory) || user.laboratory.length === 0) {
      return null
    }
    return user.laboratory[0].name || null
  }, [user])

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal-100 bg-surface px-4 py-4 shadow-sm">
      <div className="pl-16 lg:pl-0">
        <p className="text-xs uppercase tracking-[0.4em] text-charcoal-400">Panel de Control</p>
        <h1 className="text-xl font-semibold text-charcoal-900">
          {user ? `Bienvenido, ${userName}` : 'Bienvenido'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right text-sm text-charcoal-500 md:block">
          <p className="font-semibold text-charcoal-900">{userName}</p>
          <div className="flex items-center gap-2">
            <span className="text-primary-600 uppercase tracking-wide text-xs">{userRole}</span>
            {userLab && (
              <>
                <span className="text-charcoal-300">•</span>
                <span className="text-charcoal-600 text-xs">{userLab}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
