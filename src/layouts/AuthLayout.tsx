import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-charcoal-50 to-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(227,0,47,0.12),_transparent_55%)]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
