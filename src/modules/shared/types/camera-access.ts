/**
 * Tipos para Controle de Acesso LGPD
 */
export enum AccessReason {
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT', // Suporte Técnico
  INCIDENT_INVESTIGATION = 'INCIDENT_INVESTIGATION', // Investigação de Incidente
  CLIENT_REQUEST = 'CLIENT_REQUEST', // Solicitação do Cliente
  COMPLIANCE_AUDIT = 'COMPLIANCE_AUDIT', // Auditoria de Conformidade
  INFRASTRUCTURE_MONITORING = 'INFRASTRUCTURE_MONITORING' // Monitoramento de Infraestrutura
}

export interface CameraAccessRequest {
  cameraId: string;
  cameraName: string;
  tenantId: string;
  tenantName: string;
  reason: AccessReason;
  description: string;
  ticketNumber?: string;
}

export interface CameraAccessSession {
  id: string;
  cameraId: string;
  cameraName: string;
  tenantId: string;
  tenantName: string;
  userId: string;
  userName: string;
  reason: AccessReason;
  reasonLabel: string;
  description: string;
  ticketNumber?: string;
  startedAt: string;
  expiresAt: string;
  durationSeconds: number;
  ipAddress: string;
  active: boolean;
}

export interface CameraAccessLog {
  id: string;
  timestamp: string;
  actorUserId: string;
  actorUserName: string;
  actorRole: string;
  tenantId: string;
  tenantName: string;
  action: 'VIEW_CAMERA_LIVE' | 'CAPTURE_SNAPSHOT' | 'END_ACCESS';
  resourceType: 'CAMERA';
  resourceId: string;
  resourceName: string;
  reason: AccessReason;
  reasonLabel: string;
  description: string;
  ticketNumber?: string;
  ipAddress: string;
  durationSeconds?: number;
  details: Record<string, any>;
}

/**
 * Helper: Obter label do motivo de acesso
 */
export const getAccessReasonLabel = (reason: AccessReason): string => {
  const labels: Record<AccessReason, string> = {
    TECHNICAL_SUPPORT: 'Suporte Técnico (troubleshooting)',
    INCIDENT_INVESTIGATION: 'Investigação de Incidente de Segurança',
    CLIENT_REQUEST: 'Solicitação do Cliente',
    COMPLIANCE_AUDIT: 'Auditoria de Conformidade',
    INFRASTRUCTURE_MONITORING: 'Monitoramento de Infraestrutura'
  };
  return labels[reason];
};
