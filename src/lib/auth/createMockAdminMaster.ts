import { SystemRole, UserStatus, ScopeType, type User } from '@/types/user.types'

export function createMockAdminMaster(email: string): User {
  const now = new Date().toISOString()

  return {
    id: '1',
    name: 'Admin Master',
    email,
    role: SystemRole.ADMIN_MASTER,
    status: UserStatus.ACTIVE,
    scope: { type: ScopeType.GLOBAL },
    permissions: {
      canAccessDashboard: true,
      canViewLive: true,
      canViewRecordings: true,
      canViewPlayback: true,
      canExportVideos: true,
      canExportReports: true,
      canManageUsers: true,
      canManageAdmins: true,
      canManageTechnicians: true,
      canResetPasswords: true,
      canManageTenants: true,
      canManageAreas: true,
      canManageSites: true,
      canAuditLogs: true,
    },
    createdAt: now,
    updatedAt: now,
    lastLogin: undefined,
    avatar: undefined,
    tenantId: undefined,
    tenantName: undefined,
    phone: undefined,
  }
}
