import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/contexts'
import { getRedirectPathByRole } from '@/lib/auth/getRedirectPathByRole'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  requireAuth?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(String(user.role))) {
      const redirectPath = getRedirectPathByRole(String(user.role))
      return <Navigate to={redirectPath} replace />
    }
  }

  if (isAuthenticated && user && !user.role) {
    console.error('Usuário autenticado sem role definido')
    localStorage.clear()
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
