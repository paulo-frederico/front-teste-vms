/**
 * Fixture de usuários Técnicos para mock
 */

import {
  SystemRole,
  UserStatus,
  ScopeType,
  type User,
  type UserPermissions,
} from '@/modules/shared/types/auth'

/**
 * Permissões padrão do Técnico
 */
const TECHNICIAN_PERMISSIONS: UserPermissions = {
  // Visualização (limitada ao acesso temporário)
  canAccessDashboard: true,
  canViewLive: true, // Apenas câmeras autorizadas
  canViewRecordings: false,
  canViewPlayback: false,

  // Exportação
  canExportVideos: false,
  canExportReports: false,

  // Gerenciamento de Usuários
  canManageUsers: false,
  canManageAdmins: false,
  canManageTechnicians: false,
  canResetPasswords: false,
  canSuspendUsers: false,

  // Gerenciamento de Tenants
  canViewAllTenants: false,
  canManageTenants: false,
  canChangeTenantPlan: false,
  canSuspendTenants: false,

  // Gerenciamento de Câmeras (apenas configuração, não deleção)
  canManageCameras: false,
  canConfigureStreamProfiles: true, // Pode configurar streams
  canDeleteCameras: false,

  // Configuração de IA
  canConfigureAI: false,
  canConfigureAIZones: false,
  canConfigureAISensitivity: false,

  // Gravações
  canConfigureRecording: false,
  canDeleteRecordings: false,

  // Alertas
  canConfigureAlerts: false,
  canAcknowledgeAlerts: false,

  // Infraestrutura
  canManageInfrastructure: false,
  canAccessGlobalAudit: false,
  canManageGlobalSettings: false,
  canForceLogout: false,

  // Suporte
  canGrantTemporaryAccess: false,
  canAccessDiagnostics: true, // Pode usar ferramentas de diagnóstico
  canViewLogs: true, // Pode ver logs das câmeras

  // Limitações
  maxStreamQuality: 'FULLHD',
  allowedAIModules: [],
}

/**
 * Lista de técnicos mock
 */
const TECHNICIAN_USERS: Array<{
  email: string
  password: string
  name: string
}> = [
  {
    email: 'tecnico.joao@unifique.com',
    password: 'tecnico123',
    name: 'João da Silva',
  },
  {
    email: 'tecnico.maria@unifique.com',
    password: 'tecnico123',
    name: 'Maria Oliveira',
  },
  {
    email: 'tecnico.pedro@unifique.com',
    password: 'tecnico123',
    name: 'Pedro Santos',
  },
]

/**
 * Valida credenciais de técnico e retorna o usuário mock
 */
export function validateTechnicianCredentials(email: string, password: string): User | null {
  const technician = TECHNICIAN_USERS.find(
    (t) => t.email.toLowerCase() === email.toLowerCase() && t.password === password
  )

  if (!technician) {
    return null
  }

  return {
    id: `technician-${technician.email.split('@')[0]}`,
    name: technician.name,
    email: technician.email,
    role: SystemRole.TECHNICIAN,
    status: UserStatus.ACTIVE,
    scope: {
      type: ScopeType.GLOBAL, // Técnico pode acessar qualquer tenant quando autorizado
    },
    permissions: TECHNICIAN_PERMISSIONS,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }
}

/**
 * Lista de técnicos para exibição no login
 */
export const TECHNICIAN_CREDENTIALS = TECHNICIAN_USERS.map((t) => ({
  email: t.email,
  password: t.password,
  name: t.name,
}))
