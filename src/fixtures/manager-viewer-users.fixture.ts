/**
 * Usuários Gerente e Visualizador fictícios para cada tenant
 * Cada tenant tem gerentes e visualizadores com permissões específicas
 */

import { SystemRole, UserStatus, ScopeType, type User, type UserPermissions } from '@/modules/shared/types/auth'

const now = new Date().toISOString()

/**
 * Permissões do Gerente
 * Pode gerenciar câmeras e usuários do seu escopo, mas não pode deletar
 */
const managerPermissions: UserPermissions = {
  // Visualização
  canAccessDashboard: true,
  canViewLive: true,
  canViewRecordings: true,
  canViewPlayback: true,

  // Exportação
  canExportVideos: true,
  canExportReports: true,

  // Gerenciamento de Usuários - limitado
  canManageUsers: true, // Pode criar visualizadores
  canManageAdmins: false,
  canManageTechnicians: false,
  canResetPasswords: true,
  canSuspendUsers: false,

  // Gerenciamento de Tenants
  canViewAllTenants: false,
  canManageTenants: false,
  canChangeTenantPlan: false,
  canSuspendTenants: false,

  // Gerenciamento de Câmeras - limitado
  canManageCameras: true,
  canConfigureStreamProfiles: true,
  canDeleteCameras: false,

  // Configuração de IA
  canConfigureAI: true,
  canConfigureAIZones: true,
  canConfigureAISensitivity: true,

  // Gravações
  canConfigureRecording: false,
  canDeleteRecordings: false,

  // Alertas
  canConfigureAlerts: true,
  canAcknowledgeAlerts: true,

  // Infraestrutura
  canManageInfrastructure: false,
  canAccessGlobalAudit: false,
  canManageGlobalSettings: false,
  canForceLogout: false,

  // Suporte
  canGrantTemporaryAccess: false,
  canAccessDiagnostics: true,
  canViewLogs: true,

  // Limitações
  maxStreamQuality: '1080p',
  allowedAIModules: ['LPR', 'INTRUSION', 'LINE_CROSSING', 'PEOPLE_COUNTING'],
}

/**
 * Permissões do Visualizador
 * Apenas visualização, sem poder de edição
 */
const viewerPermissions: UserPermissions = {
  // Visualização - APENAS
  canAccessDashboard: true,
  canViewLive: true,
  canViewRecordings: true,
  canViewPlayback: true,

  // Exportação - limitada
  canExportVideos: false,
  canExportReports: false,

  // Gerenciamento de Usuários - NENHUM
  canManageUsers: false,
  canManageAdmins: false,
  canManageTechnicians: false,
  canResetPasswords: false,
  canSuspendUsers: false,

  // Gerenciamento de Tenants - NENHUM
  canViewAllTenants: false,
  canManageTenants: false,
  canChangeTenantPlan: false,
  canSuspendTenants: false,

  // Gerenciamento de Câmeras - NENHUM
  canManageCameras: false,
  canConfigureStreamProfiles: false,
  canDeleteCameras: false,

  // Configuração de IA - NENHUM
  canConfigureAI: false,
  canConfigureAIZones: false,
  canConfigureAISensitivity: false,

  // Gravações - NENHUM
  canConfigureRecording: false,
  canDeleteRecordings: false,

  // Alertas - apenas visualizar
  canConfigureAlerts: false,
  canAcknowledgeAlerts: true, // Pode reconhecer alertas

  // Infraestrutura - NENHUM
  canManageInfrastructure: false,
  canAccessGlobalAudit: false,
  canManageGlobalSettings: false,
  canForceLogout: false,

  // Suporte - NENHUM
  canGrantTemporaryAccess: false,
  canAccessDiagnostics: false,
  canViewLogs: false,

  // Limitações
  maxStreamQuality: '720p',
  allowedAIModules: [],
}

/**
 * Credenciais de login
 */
export interface UserCredential {
  email: string
  password: string
  user: User
}

/**
 * Lista de Gerentes fictícios (2 por tenant)
 */
export const managerUsers: UserCredential[] = [
  // ========== Unifique Headquarters - tnt-001 ==========
  {
    email: 'gerente1@unifique.com.br',
    password: 'gerente123',
    user: {
      id: 'mgr-001-1',
      name: 'Ricardo Souza',
      email: 'gerente1@unifique.com.br',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-001' },
      permissions: managerPermissions,
      createdAt: '2023-06-10T09:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T08:30:00-03:00',
      phone: '+55 47 99111-2233',
      tenantId: 'tnt-001',
      tenantName: 'Unifique Headquarters',
    },
  },
  {
    email: 'gerente2@unifique.com.br',
    password: 'gerente123',
    user: {
      id: 'mgr-001-2',
      name: 'Mariana Costa',
      email: 'gerente2@unifique.com.br',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-001' },
      permissions: managerPermissions,
      createdAt: '2023-08-15T14:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T17:45:00-03:00',
      phone: '+55 47 99222-3344',
      tenantId: 'tnt-001',
      tenantName: 'Unifique Headquarters',
    },
  },

  // ========== Retail Park Brasil - tnt-002 ==========
  {
    email: 'gerente1@retailpark.com',
    password: 'gerente123',
    user: {
      id: 'mgr-002-1',
      name: 'Paulo Henrique Silva',
      email: 'gerente1@retailpark.com',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-002' },
      permissions: managerPermissions,
      createdAt: '2024-01-20T10:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T09:15:00-03:00',
      phone: '+55 11 98111-4455',
      tenantId: 'tnt-002',
      tenantName: 'Retail Park Brasil',
    },
  },
  {
    email: 'gerente2@retailpark.com',
    password: 'gerente123',
    user: {
      id: 'mgr-002-2',
      name: 'Fernanda Oliveira',
      email: 'gerente2@retailpark.com',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-002' },
      permissions: managerPermissions,
      createdAt: '2024-03-05T11:30:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-08T16:20:00-03:00',
      phone: '+55 11 98222-5566',
      tenantId: 'tnt-002',
      tenantName: 'Retail Park Brasil',
    },
  },

  // ========== Hospital Vida Plena - tnt-003 ==========
  {
    email: 'gerente@vidaplena.org',
    password: 'gerente123',
    user: {
      id: 'mgr-003-1',
      name: 'Dr. André Nascimento',
      email: 'gerente@vidaplena.org',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-003' },
      permissions: managerPermissions,
      createdAt: '2022-05-12T08:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T07:00:00-03:00',
      phone: '+55 21 99333-6677',
      tenantId: 'tnt-003',
      tenantName: 'Hospital Vida Plena',
    },
  },

  // ========== Colégio Horizonte - tnt-004 ==========
  {
    email: 'gerente@horizonte.edu',
    password: 'gerente123',
    user: {
      id: 'mgr-004-1',
      name: 'Prof. Marcos Almeida',
      email: 'gerente@horizonte.edu',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-004' },
      permissions: managerPermissions,
      createdAt: '2024-04-01T13:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T12:30:00-03:00',
      phone: '+55 19 99444-7788',
      tenantId: 'tnt-004',
      tenantName: 'Colégio Horizonte',
    },
  },

  // ========== Inova Agro Logística - tnt-005 ==========
  {
    email: 'gerente@inovaagro.com',
    password: 'gerente123',
    user: {
      id: 'mgr-005-1',
      name: 'João Pedro Ramos',
      email: 'gerente@inovaagro.com',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-005' },
      permissions: managerPermissions,
      createdAt: '2021-09-20T15:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T06:45:00-03:00',
      phone: '+55 62 99555-8899',
      tenantId: 'tnt-005',
      tenantName: 'Inova Agro Logística',
    },
  },

  // ========== Vila Olímpica Residencial - tnt-006 ==========
  {
    email: 'gerente@vilaolimpica.com',
    password: 'gerente123',
    user: {
      id: 'mgr-006-1',
      name: 'Luciana Ferreira',
      email: 'gerente@vilaolimpica.com',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-006' },
      permissions: managerPermissions,
      createdAt: '2025-06-01T10:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T19:00:00-03:00',
      phone: '+55 11 99666-9900',
      tenantId: 'tnt-006',
      tenantName: 'Vila Olímpica Residencial',
    },
  },

  // ========== Nova Ferrovia Paulista - tnt-007 ==========
  {
    email: 'gerente@novaferrovia.com.br',
    password: 'gerente123',
    user: {
      id: 'mgr-007-1',
      name: 'Eng. Carla Mendonça',
      email: 'gerente@novaferrovia.com.br',
      role: SystemRole.MANAGER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-007' },
      permissions: managerPermissions,
      createdAt: '2024-01-15T09:30:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T05:30:00-03:00',
      phone: '+55 19 99777-0011',
      tenantId: 'tnt-007',
      tenantName: 'Nova Ferrovia Paulista',
    },
  },
]

/**
 * Lista de Visualizadores fictícios (2-3 por tenant)
 */
export const viewerUsers: UserCredential[] = [
  // ========== Unifique Headquarters - tnt-001 ==========
  {
    email: 'operador1@unifique.com.br',
    password: 'operador123',
    user: {
      id: 'vwr-001-1',
      name: 'Lucas Pereira',
      email: 'operador1@unifique.com.br',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-001' },
      permissions: viewerPermissions,
      createdAt: '2024-02-10T08:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T22:00:00-03:00',
      phone: '+55 47 99333-1111',
      tenantId: 'tnt-001',
      tenantName: 'Unifique Headquarters',
    },
  },
  {
    email: 'operador2@unifique.com.br',
    password: 'operador123',
    user: {
      id: 'vwr-001-2',
      name: 'Amanda Santos',
      email: 'operador2@unifique.com.br',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-001' },
      permissions: viewerPermissions,
      createdAt: '2024-05-20T14:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T06:00:00-03:00',
      phone: '+55 47 99444-2222',
      tenantId: 'tnt-001',
      tenantName: 'Unifique Headquarters',
    },
  },
  {
    email: 'operador3@unifique.com.br',
    password: 'operador123',
    user: {
      id: 'vwr-001-3',
      name: 'Thiago Ribeiro',
      email: 'operador3@unifique.com.br',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-001' },
      permissions: viewerPermissions,
      createdAt: '2024-08-01T16:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T14:00:00-03:00',
      phone: '+55 47 99555-3333',
      tenantId: 'tnt-001',
      tenantName: 'Unifique Headquarters',
    },
  },

  // ========== Retail Park Brasil - tnt-002 ==========
  {
    email: 'seguranca1@retailpark.com',
    password: 'operador123',
    user: {
      id: 'vwr-002-1',
      name: 'Roberto Gomes',
      email: 'seguranca1@retailpark.com',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-002' },
      permissions: viewerPermissions,
      createdAt: '2024-04-15T07:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T23:30:00-03:00',
      phone: '+55 11 99666-4444',
      tenantId: 'tnt-002',
      tenantName: 'Retail Park Brasil',
    },
  },
  {
    email: 'seguranca2@retailpark.com',
    password: 'operador123',
    user: {
      id: 'vwr-002-2',
      name: 'Patrícia Lima',
      email: 'seguranca2@retailpark.com',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-002' },
      permissions: viewerPermissions,
      createdAt: '2024-06-20T15:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T07:30:00-03:00',
      phone: '+55 11 99777-5555',
      tenantId: 'tnt-002',
      tenantName: 'Retail Park Brasil',
    },
  },

  // ========== Hospital Vida Plena - tnt-003 ==========
  {
    email: 'portaria@vidaplena.org',
    password: 'operador123',
    user: {
      id: 'vwr-003-1',
      name: 'Carlos Alberto',
      email: 'portaria@vidaplena.org',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-003' },
      permissions: viewerPermissions,
      createdAt: '2022-08-10T06:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T00:00:00-03:00',
      phone: '+55 21 99888-6666',
      tenantId: 'tnt-003',
      tenantName: 'Hospital Vida Plena',
    },
  },
  {
    email: 'seguranca@vidaplena.org',
    password: 'operador123',
    user: {
      id: 'vwr-003-2',
      name: 'Simone Cardoso',
      email: 'seguranca@vidaplena.org',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-003' },
      permissions: viewerPermissions,
      createdAt: '2023-01-05T18:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T12:00:00-03:00',
      phone: '+55 21 99999-7777',
      tenantId: 'tnt-003',
      tenantName: 'Hospital Vida Plena',
    },
  },

  // ========== Colégio Horizonte - tnt-004 ==========
  {
    email: 'porteiro@horizonte.edu',
    password: 'operador123',
    user: {
      id: 'vwr-004-1',
      name: 'José Maria',
      email: 'porteiro@horizonte.edu',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-004' },
      permissions: viewerPermissions,
      createdAt: '2024-05-01T05:30:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T06:30:00-03:00',
      phone: '+55 19 99000-8888',
      tenantId: 'tnt-004',
      tenantName: 'Colégio Horizonte',
    },
  },

  // ========== Inova Agro Logística - tnt-005 ==========
  {
    email: 'vigilante1@inovaagro.com',
    password: 'operador123',
    user: {
      id: 'vwr-005-1',
      name: 'Antônio Ferreira',
      email: 'vigilante1@inovaagro.com',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-005' },
      permissions: viewerPermissions,
      createdAt: '2022-03-15T19:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T01:00:00-03:00',
      phone: '+55 62 99111-9999',
      tenantId: 'tnt-005',
      tenantName: 'Inova Agro Logística',
    },
  },
  {
    email: 'vigilante2@inovaagro.com',
    password: 'operador123',
    user: {
      id: 'vwr-005-2',
      name: 'Maria Aparecida',
      email: 'vigilante2@inovaagro.com',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-005' },
      permissions: viewerPermissions,
      createdAt: '2023-07-20T07:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T19:00:00-03:00',
      phone: '+55 62 99222-0000',
      tenantId: 'tnt-005',
      tenantName: 'Inova Agro Logística',
    },
  },

  // ========== Vila Olímpica Residencial - tnt-006 ==========
  {
    email: 'portaria@vilaolimpica.com',
    password: 'operador123',
    user: {
      id: 'vwr-006-1',
      name: 'Pedro Henrique',
      email: 'portaria@vilaolimpica.com',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-006' },
      permissions: viewerPermissions,
      createdAt: '2025-06-15T06:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T22:30:00-03:00',
      phone: '+55 11 99333-1111',
      tenantId: 'tnt-006',
      tenantName: 'Vila Olímpica Residencial',
    },
  },

  // ========== Nova Ferrovia Paulista - tnt-007 ==========
  {
    email: 'operador@novaferrovia.com.br',
    password: 'operador123',
    user: {
      id: 'vwr-007-1',
      name: 'Rafael Monteiro',
      email: 'operador@novaferrovia.com.br',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-007' },
      permissions: viewerPermissions,
      createdAt: '2024-02-01T00:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-10T04:00:00-03:00',
      phone: '+55 19 99444-2222',
      tenantId: 'tnt-007',
      tenantName: 'Nova Ferrovia Paulista',
    },
  },
  {
    email: 'cftv@novaferrovia.com.br',
    password: 'operador123',
    user: {
      id: 'vwr-007-2',
      name: 'Sandra Melo',
      email: 'cftv@novaferrovia.com.br',
      role: SystemRole.VIEWER,
      status: UserStatus.ACTIVE,
      scope: { type: ScopeType.TENANT, tenantId: 'tnt-007' },
      permissions: viewerPermissions,
      createdAt: '2024-05-10T08:00:00-03:00',
      updatedAt: now,
      lastLogin: '2025-12-09T16:00:00-03:00',
      phone: '+55 19 99555-3333',
      tenantId: 'tnt-007',
      tenantName: 'Nova Ferrovia Paulista',
    },
  },
]

/**
 * Todos os usuários (gerentes + visualizadores)
 */
export const allTenantUsers: UserCredential[] = [...managerUsers, ...viewerUsers]

/**
 * Valida as credenciais de um Gerente ou Visualizador
 */
export function validateManagerViewerCredentials(email: string, password: string): User | null {
  const credential = allTenantUsers.find(
    (cred) => cred.email.toLowerCase() === email.toLowerCase()
  )
  if (!credential) return null
  if (credential.password !== password) return null
  return credential.user
}

/**
 * Lista todos os gerentes de um tenant
 */
export function getManagersByTenant(tenantId: string): UserCredential[] {
  return managerUsers.filter((u) => u.user.tenantId === tenantId)
}

/**
 * Lista todos os visualizadores de um tenant
 */
export function getViewersByTenant(tenantId: string): UserCredential[] {
  return viewerUsers.filter((u) => u.user.tenantId === tenantId)
}
