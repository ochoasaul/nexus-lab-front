import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

function MainLayout() {
  return (
    <div className="min-h-screen bg-charcoal-50 text-charcoal-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col w-0 lg:w-auto">
          <TopBar />
          <main className="flex-1 px-4 py-8 lg:px-10 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
