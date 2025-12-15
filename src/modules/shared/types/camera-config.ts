/**
 * Tipos para Configurações Avançadas de Câmeras
 * Baseado no VMS Fulltime e documentação oficial
 */

export enum CodecType {
  VIDEO_ONLY = 'VIDEO_ONLY',           // Vídeo
  VIDEO_AUDIO = 'VIDEO_AUDIO'          // Vídeo + Áudio
}

export enum Resolution {
  // SD (Standard Definition)
  CIF = 'CIF',                          // 352x288
  D1 = 'D1',                            // 720x480 (NTSC) / 720x576 (PAL)

  // HD (High Definition)
  HD = 'HD',                            // 1280x720 (720p)

  // Full HD
  FULL_HD = 'FULL_HD',                  // 1920x1080 (1080p)

  // 2K
  QHD = 'QHD',                          // 2560x1440 (1440p)

  // 4K (Ultra HD)
  UHD_4K = 'UHD_4K',                    // 3840x2160 (2160p)

  // 8K
  UHD_8K = 'UHD_8K'                     // 7680x4320 (4320p)
}

export enum Encoder {
  H264 = 'H264',                        // H.264 (AVC)
  H265 = 'H265',                        // H.265 (HEVC)
  MJPEG = 'MJPEG'                       // Motion JPEG (legado)
}

export enum StreamType {
  MAIN_STREAM = 'MAIN_STREAM',          // Stream principal (alta qualidade)
  SUB_STREAM = 'SUB_STREAM'             // Substream (baixa qualidade)
}

export enum BitRateType {
  CBR = 'CBR',                          // Constante (Constant Bit Rate)
  VBR = 'VBR'                           // Variável (Variable Bit Rate)
}

export enum BitRateValue {
  KBPS_512 = 512,
  KBPS_800 = 800,
  KBPS_1024 = 1024,
  KBPS_1536 = 1536,
  KBPS_2048 = 2048,
  KBPS_3072 = 3072,
  KBPS_4096 = 4096,
  KBPS_6144 = 6144,
  KBPS_8192 = 8192
}

export enum VideoStandard {
  NTSC = 'NTSC',                        // 30 fps (América do Norte, Japão)
  PAL = 'PAL'                           // 25 fps (Europa, Brasil)
}

export enum OperationMode {
  ALL_DAYS = 'ALL_DAYS',                // Todos os dias
  SCHEDULED = 'SCHEDULED'               // Agendado
}

/**
 * Configurações de CODEC
 */
export interface CodecConfig {
  codecType: CodecType;                 // Vídeo / Vídeo + Áudio
  resolution: Resolution;               // HD, Full HD, 4K, etc.
  encoder: Encoder;                     // H264, H265
  fps: number;                          // Frame Rate (1-30)
  frameTime: number;                    // Frame time (FPS x 2, calculado automaticamente)
  displayOSD: string;                   // Nome exibido na tela (ex: "Câmera Entrada")
  streamType: StreamType;               // Main Stream / Sub Stream
  bitRateType: BitRateType;             // CBR / VBR
  bitRate: BitRateValue;                // 512Kbps, 1024Kbps, 2048Kbps, 4096Kbps
}

/**
 * Ajuste de Imagem
 */
export interface ImageAdjustment {
  brightness: number;                   // Brilho (0-255)
  contrast: number;                     // Contraste (0-255)
  saturation: number;                   // Saturação (0-255)
}

/**
 * Configurações de IA
 */
export interface AIConfig {
  enableAI: boolean;                    // Configurar IA
  recordOnMotionOnly: boolean;          // Gravar só movimento
  faceDetect: boolean;                  // F/Detect
  motionContours: boolean;              // Contornos de movimento
}

/**
 * Informação de Dispositivo
 */
export interface DeviceInfo {
  videoStandard: VideoStandard;         // NTSC / PAL
  timezone: string;                     // GMT+0:00, GMT-3:00, etc.
  operationMode: OperationMode;         // Todos os dias / Agendado
  operationTime: string;                // Horário (HH:mm)
}

/**
 * Configuração Completa da Câmera
 */
export interface CameraConfiguration {
  id: string;
  cameraId: string;

  // Seção 1: Configurar CODEC
  codec: CodecConfig;

  // Seção 2: Ajuste de Imagem
  image: ImageAdjustment;

  // Seção 3: Configurações de IA
  ai: AIConfig;

  // Seção 4: Informação de Dispositivo
  device: DeviceInfo;

  // Seção 5: Data de Manutenção
  maintenanceDate?: string;             // ISO date string

  // Auditoria
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
}

/**
 * Helper: Obter label de resolução
 */
export const getResolutionLabel = (resolution: Resolution): string => {
  const labels: Record<Resolution, string> = {
    CIF: 'CIF (352x288)',
    D1: 'D1 (720x480)',
    HD: 'HD (1280x720)',
    FULL_HD: 'Full HD (1920x1080)',
    QHD: '2K QHD (2560x1440)',
    UHD_4K: '4K UHD (3840x2160)',
    UHD_8K: '8K UHD (7680x4320)'
  };
  return labels[resolution];
};

/**
 * Helper: Obter label de encoder
 */
export const getEncoderLabel = (encoder: Encoder): string => {
  const labels: Record<Encoder, string> = {
    H264: 'H.264 (AVC)',
    H265: 'H.265 (HEVC)',
    MJPEG: 'Motion JPEG'
  };
  return labels[encoder];
};

/**
 * Helper: Obter label de bit rate
 */
export const getBitRateLabel = (bitRate: BitRateValue): string => {
  if (bitRate >= 1024) {
    return `${(bitRate / 1024).toFixed(0)}Mbps`;
  }
  return `${bitRate}Kbps`;
};

/**
 * Helper: Calcular frame time (FPS x 2)
 */
export const calculateFrameTime = (fps: number): number => {
  return fps * 2;
};

/**
 * Helper: Obter lista de fusos horários
 */
export const getTimezones = (): Array<{ value: string; label: string }> => {
  return [
    { value: 'GMT-12:00', label: 'GMT-12:00 (Baker Island)' },
    { value: 'GMT-11:00', label: 'GMT-11:00 (Samoa)' },
    { value: 'GMT-10:00', label: 'GMT-10:00 (Hawaii)' },
    { value: 'GMT-9:00', label: 'GMT-9:00 (Alaska)' },
    { value: 'GMT-8:00', label: 'GMT-8:00 (Pacific Time)' },
    { value: 'GMT-7:00', label: 'GMT-7:00 (Mountain Time)' },
    { value: 'GMT-6:00', label: 'GMT-6:00 (Central Time)' },
    { value: 'GMT-5:00', label: 'GMT-5:00 (Eastern Time)' },
    { value: 'GMT-4:00', label: 'GMT-4:00 (Atlantic Time)' },
    { value: 'GMT-3:00', label: 'GMT-3:00 (Brasília, Buenos Aires)' },
    { value: 'GMT-2:00', label: 'GMT-2:00 (Mid-Atlantic)' },
    { value: 'GMT-1:00', label: 'GMT-1:00 (Azores)' },
    { value: 'GMT+0:00', label: 'GMT+0:00 (London, Dublin)' },
    { value: 'GMT+1:00', label: 'GMT+1:00 (Paris, Berlin)' },
    { value: 'GMT+2:00', label: 'GMT+2:00 (Cairo, Athens)' },
    { value: 'GMT+3:00', label: 'GMT+3:00 (Moscow, Istanbul)' },
    { value: 'GMT+4:00', label: 'GMT+4:00 (Dubai)' },
    { value: 'GMT+5:00', label: 'GMT+5:00 (Pakistan)' },
    { value: 'GMT+5:30', label: 'GMT+5:30 (India)' },
    { value: 'GMT+6:00', label: 'GMT+6:00 (Bangladesh)' },
    { value: 'GMT+7:00', label: 'GMT+7:00 (Bangkok, Jakarta)' },
    { value: 'GMT+8:00', label: 'GMT+8:00 (Beijing, Singapore)' },
    { value: 'GMT+9:00', label: 'GMT+9:00 (Tokyo, Seoul)' },
    { value: 'GMT+10:00', label: 'GMT+10:00 (Sydney)' },
    { value: 'GMT+11:00', label: 'GMT+11:00 (Solomon Islands)' },
    { value: 'GMT+12:00', label: 'GMT+12:00 (Auckland)' }
  ];
};
