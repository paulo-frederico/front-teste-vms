import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/app/layout/AdminLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { AdminDashboardPage } from '@/modules/admin/pages/AdminDashboardPage'
import { AdminTenantsPage } from '@/modules/admin/pages/AdminTenantsPage'
import { AdminUsersPage } from '@/modules/admin/pages/AdminUsersPage'
import { AdminAccessLevelsPage } from '@/modules/admin/pages/AdminAccessLevelsPage'
import { AdminLocationsPage } from '@/modules/admin/pages/AdminLocationsPage'
import { AdminAiAlertsPage } from '@/modules/admin/pages/AdminAiAlertsPage'
import { AdminReportsPage } from '@/modules/admin/pages/AdminReportsPage'
import { AdminSettingsPage } from '@/modules/admin/pages/AdminSettingsPage'
import { AdminAuditPage } from '@/modules/admin/pages/AdminAuditPage'
import { SystemRole } from '@/modules/shared/types/auth'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            allowedRoles={[SystemRole.ADMIN_MASTER, SystemRole.ADMIN, SystemRole.CLIENT_MASTER]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="tenants" element={<AdminTenantsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route
          path="access-levels"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <AdminAccessLevelsPage />
            </ProtectedRoute>
          }
        />
        <Route path="cameras" element={<AdminLocationsPage />} />
        <Route path="ai-alerts" element={<AdminAiAlertsPage />} />
        <Route
          path="audit"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <AdminAuditPage />
            </ProtectedRoute>
          }
        />
        <Route path="analytics-notifications" element={<Navigate to="ai-alerts" replace />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}
