/**
 * Tipos para Câmeras
 * Câmeras são o núcleo do sistema VMS
 */

export enum CameraStatus {
  ONLINE = 'ONLINE',           // Conectada e funcionando
  OFFLINE = 'OFFLINE',         // Desconectada
  ERROR = 'ERROR',             // Erro de conexão
  CONFIGURING = 'CONFIGURING', // Em configuração
  MAINTENANCE = 'MAINTENANCE'  // Em manutenção
}

export enum CameraProtocol {
  ONVIF = 'ONVIF',   // Padrão da indústria (recomendado)
  RTSP = 'RTSP',     // Stream direto
  RTMP = 'RTMP'      // Stream para broadcast
}

export enum StreamQuality {
  LOW = 'LOW',       // 480p - economia de banda
  MEDIUM = 'MEDIUM', // 720p - balanceado
  HIGH = 'HIGH',     // 1080p - alta qualidade
  ULTRA = 'ULTRA'    // 4K - máxima qualidade
}

export enum RecordingMode {
  CONTINUOUS = 'CONTINUOUS',       // Gravação contínua 24/7
  EVENT_BASED = 'EVENT_BASED',     // Apenas quando detectar evento
  SCHEDULED = 'SCHEDULED',         // Agendado (horários específicos)
  DISABLED = 'DISABLED'            // Sem gravação
}

/**
 * Perfil de Stream (múltiplos perfis por câmera)
 */
export interface StreamProfile {
  id: string;
  name: string;                    // Ex: "Principal", "Substream", "Mobile"
  quality: StreamQuality;
  resolution: string;              // Ex: "1920x1080", "1280x720"
  fps: number;                     // Frames por segundo (ex: 30, 15, 10)
  bitrate: number;                 // Kbps (ex: 2048, 1024, 512)
  codec: string;                   // Ex: "H.264", "H.265", "MJPEG"
  url?: string;                    // URL do stream (gerado após configuração)
}

/**
 * Credenciais de acesso à câmera
 */
export interface CameraCredentials {
  username: string;
  password: string;
}

/**
 * Configurações PTZ (Pan-Tilt-Zoom)
 */
export interface PTZCapabilities {
  supportsPTZ: boolean;
  canPan: boolean;                 // Movimento horizontal
  canTilt: boolean;                // Movimento vertical
  canZoom: boolean;                // Zoom óptico/digital
  presets: number;                 // Quantidade de posições pré-definidas
  tours: number;                   // Quantidade de tours automáticos
}

/**
 * Informações de hardware (detectadas via ONVIF)
 */
export interface CameraHardwareInfo {
  manufacturer?: string;           // Ex: "Hikvision", "Dahua", "Intelbras"
  model?: string;                  // Ex: "DS-2CD2143G0-I"
  firmwareVersion?: string;
  serialNumber?: string;
  macAddress?: string;
}

/**
 * Teste de Conexão
 */
export interface ConnectionTest {
  id: string;
  cameraId: string;
  testedAt: string;                // ISO timestamp
  testedBy: string;                // ID do usuário
  testedByName: string;            // Nome do usuário
  success: boolean;
  latencyMs?: number;              // Latência em milissegundos
  errorMessage?: string;
  snapshotUrl?: string;            // URL do snapshot de teste
}

/**
 * Câmera
 */
export interface Camera {
  id: string;
  name: string;
  description?: string;

  // Localização
  tenantId: string;
  tenantName: string;
  siteId?: string;                 // ID do local (filial, loja)
  siteName?: string;
  areaId?: string;                 // ID da área (entrada, estacionamento)
  areaName?: string;

  // Conexão
  protocol: CameraProtocol;
  ipAddress: string;
  port: number;                    // Ex: 554 (RTSP), 80 (ONVIF), 1935 (RTMP)
  credentials: CameraCredentials;

  // Streams
  mainStreamUrl: string;           // URL do stream principal
  subStreamUrl?: string;           // URL do substream (menor qualidade)
  streamProfiles: StreamProfile[]; // Múltiplos perfis

  // Status
  status: CameraStatus;
  lastOnline?: string;             // ISO timestamp
  lastOffline?: string;            // ISO timestamp

  // Hardware
  hardwareInfo?: CameraHardwareInfo;
  ptzCapabilities?: PTZCapabilities;

  // Gravação
  recordingMode: RecordingMode;
  retentionDays: number;           // Dias de retenção de gravação

  // IA (módulos habilitados para esta câmera)
  enabledAIModules: string[];      // Ex: ['lpr', 'intrusion', 'line_crossing']

  // Snapshot
  snapshotUrl?: string;            // URL do último snapshot
  snapshotUpdatedAt?: string;      // ISO timestamp

  // Testes
  lastConnectionTest?: ConnectionTest;

  // Auditoria
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  installedBy?: string;            // ID do técnico que instalou
  installedByName?: string;
  installedAt?: string;            // ISO timestamp
}

/**
 * Estatísticas da câmera
 */
export interface CameraStats {
  cameraId: string;
  uptime: number;                  // Porcentagem de uptime (0-100)
  totalEvents: number;             // Total de eventos de IA detectados
  storageUsedGB: number;           // Armazenamento usado em GB
  averageBitrate: number;          // Bitrate médio em Kbps
  lastSnapshot?: string;           // URL do último snapshot
}
