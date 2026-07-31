import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/router/paths'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-lagoon-200 border-t-lagoon-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.adminLogin} state={{ from: location }} replace />
  }

  return <Outlet />
}
