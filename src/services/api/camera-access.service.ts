import type { 
  CameraAccessRequest, 
  CameraAccessSession, 
  CameraAccessLog 
} from '@/modules/shared/types/camera-access';

const MAX_ACCESS_DURATION = 30 * 60 * 1000; // 30 minutos

// Mock de sessões ativas (em memória)
const activeSessions: Map<string, CameraAccessSession> = new Map();

class CameraAccessService {
  /**
   * Solicitar acesso a uma câmera (LGPD)
   */
  async requestAccess(request: CameraAccessRequest): Promise<CameraAccessSession> {
    console.log('🔐 [CameraAccessService] Solicitando acesso LGPD:', request);
    await new Promise(resolve => setTimeout(resolve, 500));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + MAX_ACCESS_DURATION);

    const session: CameraAccessSession = {
      id: `session-${Date.now()}`,
      cameraId: request.cameraId,
      cameraName: request.cameraName,
      tenantId: request.tenantId,
      tenantName: request.tenantName,
      userId: '1', // Mock: Admin Master
      userName: 'Admin Master',
      reason: request.reason,
      reasonLabel: this.getReasonLabel(request.reason),
      description: request.description,
      ticketNumber: request.ticketNumber,
      startedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      durationSeconds: 0,
      ipAddress: '192.168.1.100', // Mock
      active: true
    };

    activeSessions.set(request.cameraId, session);

    // Registrar log de auditoria
    await this.logAccess({
      id: `log-${Date.now()}`,
      timestamp: now.toISOString(),
      actorUserId: '1',
      actorUserName: 'Admin Master',
      actorRole: 'GLOBAL_ADMIN',
      tenantId: request.tenantId,
      tenantName: request.tenantName,
      action: 'VIEW_CAMERA_LIVE',
      resourceType: 'CAMERA',
      resourceId: request.cameraId,
      resourceName: request.cameraName,
      reason: request.reason,
      reasonLabel: this.getReasonLabel(request.reason),
      description: request.description,
      ticketNumber: request.ticketNumber,
      ipAddress: '192.168.1.100',
      details: {
        access_type: 'LIVE_VIEW',
        max_duration_minutes: 30
      }
    });

    console.log('✅ [CameraAccessService] Acesso concedido até:', expiresAt.toLocaleString('pt-BR'));
    return session;
  }

  /**
   * Obter sessão ativa de uma câmera
   */
  async getActiveSession(cameraId: string): Promise<CameraAccessSession | null> {
    const session = activeSessions.get(cameraId);

    if (!session) return null;

    // Verificar se sessão expirou
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now >= expiresAt) {
      await this.endAccess(cameraId);
      return null;
    }

    // Atualizar duração
    const startedAt = new Date(session.startedAt);
    session.durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);

    return session;
  }

  /**
   * Encerrar acesso a uma câmera
   */
  async endAccess(cameraId: string): Promise<void> {
    console.log('🔒 [CameraAccessService] Encerrando acesso:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 300));

    const session = activeSessions.get(cameraId);

    if (session) {
      const now = new Date();
      const startedAt = new Date(session.startedAt);
      const durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);

      // Registrar log de encerramento
      await this.logAccess({
        id: `log-${Date.now()}`,
        timestamp: now.toISOString(),
        actorUserId: session.userId,
        actorUserName: session.userName,
        actorRole: 'GLOBAL_ADMIN',
        tenantId: session.tenantId,
        tenantName: session.tenantName,
        action: 'END_ACCESS',
        resourceType: 'CAMERA',
        resourceId: session.cameraId,
        resourceName: session.cameraName,
        reason: session.reason,
        reasonLabel: session.reasonLabel,
        description: session.description,
        ticketNumber: session.ticketNumber,
        ipAddress: session.ipAddress,
        durationSeconds: durationSeconds,
        details: {
          access_type: 'LIVE_VIEW',
          ended_by: 'USER'
        }
      });

      activeSessions.delete(cameraId);
    }

    console.log('✅ [CameraAccessService] Acesso encerrado');
  }

  /**
   * Registrar log de auditoria
   */
  private async logAccess(log: CameraAccessLog): Promise<void> {
    console.log('📋 [CameraAccessService] Log de auditoria:', log);
    // Em produção, enviar para backend:
    // await api.post('/audit-logs', log);
  }

  /**
   * Helper: Obter label do motivo
   */
  private getReasonLabel(reason: string): string {
    const labels: Record<string, string> = {
      TECHNICAL_SUPPORT: 'Suporte Técnico',
      INCIDENT_INVESTIGATION: 'Investigação de Incidente',
      CLIENT_REQUEST: 'Solicitação do Cliente',
      COMPLIANCE_AUDIT: 'Auditoria de Conformidade',
      INFRASTRUCTURE_MONITORING: 'Monitoramento de Infraestrutura'
    };
    return labels[reason] || reason;
  }
}

export const cameraAccessService = new CameraAccessService();
