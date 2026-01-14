import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from '@/app/layout/AdminLayout'
import { ClientLayout } from '@/app/layout/ClientLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { AdminDashboardPage } from '@/modules/admin/pages/AdminDashboardPage'
import { AdminTenantsPage } from '@/modules/admin/pages/AdminTenantsPage'
import { TenantCreatePage } from '@/modules/admin/tenants/pages/TenantCreatePage'
import { TenantEditPage } from '@/modules/admin/tenants/pages/TenantEditPage'
import { TenantDetailPage } from '@/modules/admin/tenants/pages/TenantDetailPage'
import { UsersListPage, UserCreatePage, UserEditPage, UserDetailPage } from '@/modules/admin/users/pages'
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
import { SitesListPage } from '@/modules/admin/sites/pages/SitesListPage'
import { SiteCreatePage } from '@/modules/admin/sites/pages/SiteCreatePage'
import { SiteEditPage } from '@/modules/admin/sites/pages/SiteEditPage'
import { SiteDetailPage } from '@/modules/admin/sites/pages/SiteDetailPage'
import { AreasListPage, AreaCreatePage, AreaEditPage, AreaDetailPage } from '@/modules/admin/areas/pages'
import { InfrastructurePage } from '@/modules/admin/infrastructure/pages'
import { AiConfigPage, CameraAiConfigPage } from '@/modules/admin/ai-config/pages'
import { RecordingPoliciesPage } from '@/modules/admin/recording-policies/pages'
import { AdminReportsPage } from '@/modules/admin/pages/AdminReportsPage'
import { AdminSettingsPage } from '@/modules/admin/pages/AdminSettingsPage'
import { AdminAuditPage } from '@/modules/admin/pages/AdminAuditPage'
import { DiagnosticsPage } from '@/modules/admin/diagnostics/pages'
import { NotificationProfilesPage } from '@/modules/admin/notifications/pages'
import { AccessControlPage } from '@/modules/admin/access-control/pages'
import { TemporaryTechnicianAccessPage } from '@/modules/admin/technician-access/pages'
import { IncidentsPage } from '@/modules/admin/incidents/pages'
import { InvestigationPage } from '@/modules/investigation/pages/InvestigationPage'
import { VideoWallPage } from '@/modules/videowall/pages/VideoWallPage'
import { PlaybackPage } from '@/modules/playback/pages'
import { ClientMasterDashboard } from '@/modules/client/dashboard/pages/ClientMasterDashboard'
import { TechnicianLayout } from '@/app/layout/TechnicianLayout'
import {
  TechnicianDashboard,
  TicketsPage,
  MyAccessPage,
  TechnicianDiagnosticsPage,
  TechnicianCamerasPage,
  HistoryPage,
  HelpPage,
} from '@/modules/technician/pages'
import { SystemRole } from '@/modules/shared/types/auth'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

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
        <Route path="users">
          <Route index element={<UsersListPage />} />
          <Route path="new" element={<UserCreatePage />} />
          <Route path=":id" element={<UserDetailPage />} />
          <Route path=":id/edit" element={<UserEditPage />} />
        </Route>
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
        <Route path="sites">
          <Route index element={<SitesListPage />} />
          <Route path="new" element={<SiteCreatePage />} />
          <Route path=":id" element={<SiteDetailPage />} />
          <Route path=":id/edit" element={<SiteEditPage />} />
        </Route>
        <Route path="areas">
          <Route index element={<AreasListPage />} />
          <Route path="new" element={<AreaCreatePage />} />
          <Route path=":id" element={<AreaDetailPage />} />
          <Route path=":id/edit" element={<AreaEditPage />} />
        </Route>
        <Route path="locations" element={<AdminLocationsPage />} />
        <Route path="ai-alerts" element={<AdminAiAlertsPage />} />
        <Route path="ai-config">
          <Route index element={<AiConfigPage />} />
          <Route path="camera/:cameraId" element={<CameraAiConfigPage />} />
        </Route>
        <Route path="recording-policies" element={<RecordingPoliciesPage />} />
        <Route
          path="infrastructure"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <InfrastructurePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="audit"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <AdminAuditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="diagnostics"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <DiagnosticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <NotificationProfilesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="access-control"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <AccessControlPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="technician-access"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <TemporaryTechnicianAccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="incidents"
          element={
            <ProtectedRoute allowedRoles={[SystemRole.ADMIN_MASTER]}>
              <IncidentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="analytics-notifications" element={<Navigate to="ai-alerts" replace />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        {/* Módulos Premium */}
        <Route path="investigacao" element={<InvestigationPage />} />
        <Route path="videowall" element={<VideoWallPage />} />
      </Route>

      {/* Rotas do Cliente Master */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={[SystemRole.CLIENT_MASTER, SystemRole.MANAGER, SystemRole.VIEWER]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ClientMasterDashboard />} />
        <Route path="videowall" element={<VideoWallPage />} />
        <Route path="investigacao" element={<InvestigationPage />} />
        <Route path="cameras" element={<CamerasListPage />} />
        <Route path="cameras/:id" element={<CameraDetailPage />} />
        <Route path="cameras/:id/edit" element={<CameraEditPage />} />
        <Route path="live" element={<VideoWallPage />} />
        <Route path="playback" element={<PlaybackPage />} />
        <Route path="sites" element={<SitesListPage />} />
        <Route path="sites/:id" element={<SiteDetailPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="users/new" element={<UserCreatePage />} />
        <Route path="users/:id" element={<UserDetailPage />} />
        <Route path="users/:id/edit" element={<UserEditPage />} />
        <Route path="ai-config" element={<AiConfigPage />} />
        <Route path="ai-config/camera/:cameraId" element={<CameraAiConfigPage />} />
        <Route path="notifications" element={<NotificationProfilesPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="technician-access" element={<TemporaryTechnicianAccessPage />} />
        <Route path="support" element={<IncidentsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Rotas do Técnico */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute allowedRoles={[SystemRole.TECHNICIAN]}>
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TechnicianDashboard />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="access" element={<MyAccessPage />} />
        <Route path="cameras" element={<TechnicianCamerasPage />} />
        <Route path="live" element={<VideoWallPage />} />
        <Route path="diagnostics" element={<TechnicianDiagnosticsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      {/* Redirect padrão baseado no role - vai para login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
