import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/app/layout/AdminLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { AdminDashboardPage } from '@/modules/admin/pages/AdminDashboardPage'
import { AdminTenantsPage } from '@/modules/admin/pages/AdminTenantsPage'
import { TenantCreatePage } from '@/modules/admin/tenants/pages/TenantCreatePage'
import { TenantEditPage } from '@/modules/admin/tenants/pages/TenantEditPage'
import { TenantDetailPage } from '@/modules/admin/tenants/pages/TenantDetailPage'
import { AdminUsersPage } from '@/modules/admin/pages/AdminUsersPage'
import { AdminsListPage } from '@/modules/admin/admins/pages/AdminsListPage'
import { AdminCreatePage } from '@/modules/admin/admins/pages/AdminCreatePage'
import { AdminEditPage } from '@/modules/admin/admins/pages/AdminEditPage'
import { TechniciansListPage } from '@/modules/admin/technicians/pages/TechniciansListPage'
import { TechnicianCreatePage } from '@/modules/admin/technicians/pages/TechnicianCreatePage'
import { TechnicianEditPage } from '@/modules/admin/technicians/pages/TechnicianEditPage'
import { GrantAccessPage } from '@/modules/admin/technicians/pages/GrantAccessPage'
import { AdminAccessLevelsPage } from '@/modules/admin/pages/AdminAccessLevelsPage'
import { AdminLocationsPage } from '@/modules/admin/pages/AdminLocationsPage'
import { AdminAiAlertsPage } from '@/modules/admin/pages/AdminAiAlertsPage'
import { CamerasListPage } from '@/modules/admin/cameras/pages/CamerasListPage'
import { CameraCreatePage } from '@/modules/admin/cameras/pages/CameraCreatePage'
import { CameraEditPage } from '@/modules/admin/cameras/pages/CameraEditPage'
import { CameraDetailPage } from '@/modules/admin/cameras/pages/CameraDetailPage'
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
        <Route path="tenants">
          <Route index element={<AdminTenantsPage />} />
          <Route path="new" element={<TenantCreatePage />} />
          <Route path=":id" element={<TenantDetailPage />} />
          <Route path=":id/edit" element={<TenantEditPage />} />
        </Route>
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="admins">
          <Route index element={<AdminsListPage />} />
          <Route path="new" element={<AdminCreatePage />} />
          <Route path=":id/edit" element={<AdminEditPage />} />
        </Route>
        <Route path="technicians">
          <Route index element={<TechniciansListPage />} />
          <Route path="new" element={<TechnicianCreatePage />} />
          <Route path=":id/edit" element={<TechnicianEditPage />} />
          <Route path=":id/grant-access" element={<GrantAccessPage />} />
        </Route>
        <Route
          path="access-levels"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <AdminAccessLevelsPage />
            </ProtectedRoute>
          }
        />
        <Route path="cameras">
          <Route index element={<CamerasListPage />} />
          <Route path="new" element={<CameraCreatePage />} />
          <Route path=":id" element={<CameraDetailPage />} />
          <Route path=":id/edit" element={<CameraEditPage />} />
        </Route>
        <Route path="locations" element={<AdminLocationsPage />} />
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
