/**
 * Tipos de autenticação e hierarquia do VMS Unifique
 */

export enum SystemRole {
  ADMIN_MASTER = 'ADMIN_MASTER',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  CLIENT_MASTER = 'CLIENT_MASTER',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export enum ScopeType {
  GLOBAL = 'GLOBAL',
  TENANT = 'TENANT',
  SITES = 'SITES',
  AREAS = 'AREAS',
  CAMERAS = 'CAMERAS',
}

export interface UserScope {
  type: ScopeType
  tenantId?: string
  siteIds?: string[]
  areaIds?: string[]
  cameraIds?: string[]
}

export interface UserPermissions {
  // Visualização
  canAccessDashboard: boolean
  canViewLive: boolean
  canViewRecordings: boolean
  canViewPlayback: boolean

  // Exportação
  canExportVideos: boolean
  canExportReports: boolean

  // Gerenciamento de Usuários
  canManageUsers: boolean
  canManageAdmins: boolean
  canManageTechnicians: boolean
  canResetPasswords: boolean
  canSuspendUsers: boolean

  // Gerenciamento de Tenants
  canViewAllTenants: boolean
  canManageTenants: boolean
  canChangeTenantPlan: boolean
  canSuspendTenants: boolean

  // Gerenciamento de Câmeras
  canManageCameras: boolean
  canConfigureStreamProfiles: boolean
  canDeleteCameras: boolean

  // Configuração de IA
  canConfigureAI: boolean
  canConfigureAIZones: boolean
  canConfigureAISensitivity: boolean

  // Gravações
  canConfigureRecording: boolean
  canDeleteRecordings: boolean

  // Alertas
  canConfigureAlerts: boolean
  canAcknowledgeAlerts: boolean

  // Infraestrutura (ADMIN_MASTER APENAS)
  canManageInfrastructure: boolean
  canAccessGlobalAudit: boolean
  canManageGlobalSettings: boolean
  canForceLogout: boolean

  // Suporte
  canGrantTemporaryAccess: boolean
  canAccessDiagnostics: boolean
  canViewLogs: boolean

  // Limitações
  maxStreamQuality: 'SD' | 'HD' | 'FULLHD' | '4K'
  allowedAIModules: string[]
}

export interface TemporaryAccess {
  tenantId: string
  tenantName: string
  grantedBy: string
  grantedByName: string
  grantedAt: string
  expiresAt: string
  reason?: string
  allowedActions: string[]
  cameraIds?: string[]
  siteIds?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: SystemRole
  status: UserStatus
  scope: UserScope
  permissions: UserPermissions
  temporaryAccess?: TemporaryAccess
  createdAt: string
  updatedAt: string
  lastLogin?: string
  phone?: string
  avatar?: string
  tenantId?: string
  tenantName?: string
}

export const UserRole = SystemRole
export type UserRole = SystemRole

/**
 * Resumo de usuário para listagens
 */
export interface UserSummary {
  id: string
  name: string
  email: string
  role: SystemRole
  status: UserStatus
  tenantId?: string
  tenantName?: string
  lastLogin?: string
}

/**
 * Converter User completo para UserSummary
 */
export function toUserSummary(user: User): UserSummary {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    tenantId: user.tenantId ?? user.scope.tenantId,
    tenantName: user.tenantName,
    lastLogin: user.lastLogin,
  }
}
