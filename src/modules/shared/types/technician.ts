/**
 * Tipos para Técnicos (Instaladores)
 * Técnicos têm acesso temporário aos tenants para instalação/manutenção
 */

export enum TechnicianStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum TechnicianSpecialty {
  INSTALLATION = 'INSTALLATION',           // Instalação física
  NETWORK = 'NETWORK',                     // Configuração de rede
  ONVIF_CONFIG = 'ONVIF_CONFIG',          // Configuração ONVIF/RTSP
  MAINTENANCE = 'MAINTENANCE',             // Manutenção preventiva
  TROUBLESHOOTING = 'TROUBLESHOOTING',     // Resolução de problemas
  ALL = 'ALL'                              // Todas as especialidades
}

/**
 * Acesso temporário do técnico a um tenant (LGPD)
 */
export interface TemporaryAccess {
  id: string;
  technicianId: string;
  technicianName: string;
  tenantId: string;
  tenantName: string;
  grantedBy: string;           // ID do Admin que liberou
  grantedByName: string;       // Nome do Admin
  grantedAt: string;           // ISO timestamp
  expiresAt: string;           // ISO timestamp
  revokedAt?: string;          // ISO timestamp (se foi revogado antes de expirar)
  revokedBy?: string;          // ID do Admin que revogou
  revokedByName?: string;      // Nome do Admin que revogou
  reason: string;              // Motivo do acesso (ex: "Instalação de 5 câmeras")
  allowedActions: string[];    // Ações permitidas (ex: ['install_camera', 'test_connection'])
  cameraIds?: string[];        // IDs das câmeras que pode acessar (opcional)
  siteIds?: string[];          // IDs dos locais que pode acessar (opcional)
  isActive: boolean;           // Se o acesso ainda está válido
}

/**
 * Técnico (Instalador)
 */
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: TechnicianSpecialty;
  region?: string;             // Região de atuação (ex: "São Paulo - Zona Sul")
  status: TechnicianStatus;
  avatar?: string;

  // Multi-tenant: técnico pode atender múltiplos clientes
  assignedTenants: string[];   // IDs dos tenants que este técnico pode atender

  // Acesso temporário atual (se houver)
  currentAccess?: TemporaryAccess;

  // Estatísticas
  stats?: {
    totalInstallations: number;
    totalMaintenances: number;
    averageRating: number;      // Avaliação média (1-5)
    lastActivity?: string;       // ISO timestamp
  };

  // Auditoria
  createdAt: string;
  updatedAt: string;
  createdBy: string;             // ID do Admin que criou
  createdByName: string;         // Nome do Admin
}

/**
 * Evidência de instalação/manutenção
 */
export interface InstallationEvidence {
  id: string;
  technicianId: string;
  tenantId: string;
  cameraId?: string;
  type: 'PHOTO' | 'VIDEO' | 'DOCUMENT';
  url: string;                   // URL do arquivo
  description?: string;
  timestamp: string;             // ISO timestamp
}

/**
 * Registro de atividade do técnico (auditoria)
 */
export interface TechnicianActivity {
  id: string;
  technicianId: string;
  technicianName: string;
  tenantId: string;
  tenantName: string;
  action: string;                // Ex: "Instalou câmera CAM-001"
  details?: Record<string, any>; // Dados adicionais
  timestamp: string;             // ISO timestamp
  ipAddress?: string;
}
