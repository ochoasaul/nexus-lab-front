import React, { type ReactElement, Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import LoginPage from '../pages/Login/LoginPage'
import { ROUTES } from '../config'
import { useAuth } from '../hooks/useAuth'

// Lazy-loaded dashboard pages
const OverviewPage = lazy(() => import('../pages/Dashboard/OverviewPage'))
const InventoryPage = lazy(() => import('../pages/Dashboard/InventoryPage'))
const UsersPage = lazy(() => import('../pages/Dashboard/UsersPage'))
const ReportsPage = lazy(() => import('../pages/Dashboard/ReportsPage'))
const SchedulesPage = lazy(() => import('../pages/Dashboard/SchedulesPage'))
const TasksPage = lazy(() => import('../pages/Dashboard/TasksPage'))

function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return children
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8">Cargando...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.home} element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
            <Route path={ROUTES.dashboard} element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
            <Route path={ROUTES.inventory} element={<PrivateRoute><InventoryPage /></PrivateRoute>} />
            <Route path={ROUTES.users} element={<PrivateRoute><UsersPage /></PrivateRoute>} />
            <Route path={ROUTES.reports} element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path={ROUTES.schedules} element={<PrivateRoute><SchedulesPage /></PrivateRoute>} />
            <Route path={ROUTES.tasks} element={<PrivateRoute><TasksPage /></PrivateRoute>} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path={ROUTES.login} element={<LoginPage />} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
