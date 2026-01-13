/**
 * Usuários Cliente Master fictícios para cada tenant
 * Cada cliente tem suas próprias credenciais de acesso
 */

import { SystemRole, UserStatus, ScopeType, type User, type UserPermissions } from '@/modules/shared/types/auth'

/**
 * Permissões padrão do Cliente Master
 * Baseado no documento de hierarquia
 */
const clientMasterPermissions: UserPermissions = {
  // Visualização - TOTAL dentro do próprio tenant
  canAccessDashboard: true,
  canViewLive: true,
  canViewRecordings: true,
  canViewPlayback: true,

  // Exportação
  canExportVideos: true,
  canExportReports: true,

  // Gerenciamento de Usuários - apenas do próprio tenant
  canManageUsers: true,
  canManageAdmins: false, // Não pode criar Admins
  canManageTechnicians: false, // Não pode criar Técnicos diretamente
  canResetPasswords: true,
  canSuspendUsers: true,

  // Gerenciamento de Tenants - apenas visualizar o próprio
  canViewAllTenants: false,
  canManageTenants: false,
  canChangeTenantPlan: false,
  canSuspendTenants: false,

  // Gerenciamento de Câmeras - dentro do próprio tenant
  canManageCameras: true,
  canConfigureStreamProfiles: true,
  canDeleteCameras: false, // Apenas Admin pode deletar

  // Configuração de IA - dentro do próprio tenant
  canConfigureAI: true,
  canConfigureAIZones: true,
  canConfigureAISensitivity: true,

  // Gravações
  canConfigureRecording: true,
  canDeleteRecordings: false, // Apenas Admin

  // Alertas
  canConfigureAlerts: true,
  canAcknowledgeAlerts: true,

  // Infraestrutura - NÃO tem acesso
  canManageInfrastructure: false,
  canAccessGlobalAudit: false,
  canManageGlobalSettings: false,
  canForceLogout: false,

  // Suporte
  canGrantTemporaryAccess: true, // Pode aprovar acesso de técnicos
  canAccessDiagnostics: true, // Diagnóstico básico
  canViewLogs: true, // Logs do próprio tenant

  // Limitações
  maxStreamQuality: '4K',
  allowedAIModules: ['LPR', 'INTRUSION', 'LINE_CROSSING', 'PEOPLE_COUNTING', 'VEHICLE_COUNTING', 'LOITERING', 'EPI'],
}

/**
 * Credenciais de login dos Clientes Master
 * Email -> Dados do usuário
 */
export interface ClientMasterCredential {
  email: string
  password: string
  user: User
}

const now = new Date().toISOString()

/**
 * Lista de usuários Cliente Master fictícios
 */
export const clientMasterUsers: ClientMasterCredential[] = [
  // Unifique Headquarters - tnt-001
  {
    email: 'cliente@unifique.com.br',
    password: 'unifique123',
    user: {
      id: 'cm-001',
      name: 'Beatriz Andrade',
      email: 'cliente@unifique.com.br',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-001',
      },
      permissions: clientMasterPermissions,
      createdAt: '2023-01-18T14:20:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-06T19:30:00-03:00',
      phone: '+55 47 99888-2233',
      tenantId: 'tnt-001',
      tenantName: 'Unifique Headquarters',
    },
  },
  // Retail Park Brasil - tnt-002
  {
    email: 'cliente@retailpark.com',
    password: 'retail123',
    user: {
      id: 'cm-002',
      name: 'Juliano Ribeiro',
      email: 'cliente@retailpark.com',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-002',
      },
      permissions: clientMasterPermissions,
      createdAt: '2023-11-05T09:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-05T18:10:00-03:00',
      phone: '+55 11 98765-4321',
      tenantId: 'tnt-002',
      tenantName: 'Retail Park Brasil',
    },
  },
  // Hospital Vida Plena - tnt-003
  {
    email: 'cliente@vidaplena.org',
    password: 'hospital123',
    user: {
      id: 'cm-003',
      name: 'Dr. Roberto Mendes',
      email: 'cliente@vidaplena.org',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-003',
      },
      permissions: clientMasterPermissions,
      createdAt: '2021-02-14T06:30:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-08T10:45:00-03:00',
      phone: '+55 21 99876-5432',
      tenantId: 'tnt-003',
      tenantName: 'Hospital Vida Plena',
    },
  },
  // Colégio Horizonte - tnt-004
  {
    email: 'cliente@horizonte.edu',
    password: 'colegio123',
    user: {
      id: 'cm-004',
      name: 'Profa. Ana Cristina Lima',
      email: 'cliente@horizonte.edu',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-004',
      },
      permissions: clientMasterPermissions,
      createdAt: '2024-03-02T13:20:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T08:15:00-03:00',
      phone: '+55 19 98765-1234',
      tenantId: 'tnt-004',
      tenantName: 'Colégio Horizonte',
    },
  },
  // Inova Agro Logística - tnt-005
  {
    email: 'cliente@inovaagro.com',
    password: 'inova123',
    user: {
      id: 'cm-005',
      name: 'Carlos Eduardo Martins',
      email: 'cliente@inovaagro.com',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-005',
      },
      permissions: clientMasterPermissions,
      createdAt: '2020-07-18T11:05:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-07T14:20:00-03:00',
      phone: '+55 62 99887-6543',
      tenantId: 'tnt-005',
      tenantName: 'Inova Agro Logística',
    },
  },
  // Vila Olímpica Residencial - tnt-006
  {
    email: 'cliente@vilaolimpica.com',
    password: 'vila123',
    user: {
      id: 'cm-006',
      name: 'Fernando Costa (Síndico)',
      email: 'cliente@vilaolimpica.com',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-006',
      },
      permissions: clientMasterPermissions,
      createdAt: '2025-05-20T15:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T07:30:00-03:00',
      phone: '+55 11 97654-3210',
      tenantId: 'tnt-006',
      tenantName: 'Vila Olímpica Residencial',
    },
  },
  // Nova Ferrovia Paulista - tnt-007
  {
    email: 'cliente@novaferrovia.com.br',
    password: 'ferrovia123',
    user: {
      id: 'cm-007',
      name: 'Eng. Marcos Vieira',
      email: 'cliente@novaferrovia.com.br',
      role: SystemRole.CLIENT_MASTER,
      status: UserStatus.ACTIVE,
      scope: {
        type: ScopeType.TENANT,
        tenantId: 'tnt-007',
      },
      permissions: clientMasterPermissions,
      createdAt: '2023-11-10T05:40:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T16:45:00-03:00',
      phone: '+55 19 98543-2109',
      tenantId: 'tnt-007',
      tenantName: 'Nova Ferrovia Paulista',
    },
  },
]

/**
 * Busca um usuário Cliente Master pelo email
 */
export function findClientMasterByEmail(email: string): ClientMasterCredential | undefined {
  return clientMasterUsers.find((cred) => cred.email.toLowerCase() === email.toLowerCase())
}

/**
 * Valida as credenciais de um Cliente Master
 */
export function validateClientMasterCredentials(
  email: string,
  password: string
): User | null {
  const credential = findClientMasterByEmail(email)
  if (!credential) return null
  if (credential.password !== password) return null
  return credential.user
}

/**
 * Lista todos os emails disponíveis para teste
 */
export function listClientMasterEmails(): string[] {
  return clientMasterUsers.map((cred) => cred.email)
}
