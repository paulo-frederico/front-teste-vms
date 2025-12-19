export type CameraLogLevel = 'info' | 'warning' | 'error' | 'debug'
export type AiLogLevel = 'info' | 'warning' | 'error'
export type StreamTestStatus = 'idle' | 'testing' | 'success' | 'failed'

export type CameraLog = {
  id: string
  cameraId: string
  cameraName: string
  timestamp: string
  level: CameraLogLevel
  message: string
  details?: string
}

export type AiLog = {
  id: string
  cameraId: string
  cameraName: string
  module: string
  timestamp: string
  level: AiLogLevel
  message: string
  processingTime?: number
  detections?: number
}

export type StreamTestResult = {
  cameraId: string
  cameraName: string
  status: StreamTestStatus
  rtspUrl?: string
  rtmpUrl?: string
  resolution?: string
  bitrate?: string
  fps?: number
  latency?: number
  errors?: string[]
  testedAt?: string
}

export type ProblematicCamera = {
  id: string
  name: string
  status: 'offline' | 'error' | 'degraded'
  lastOnline: string
  errorCount: number
  avgLatency: number
  site: string
  tenant: string
}

// Mock Camera Logs
export const MOCK_CAMERA_LOGS: CameraLog[] = [
  {
    id: 'log-1',
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    level: 'info',
    message: 'Camera conectada com sucesso',
    details: 'Stream RTSP inicializado em 1920x1080 @ 30fps'
  },
  {
    id: 'log-2',
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    level: 'warning',
    message: 'Queda de conexao detectada',
    details: 'Reconectando... Tentativa 1 de 3'
  },
  {
    id: 'log-3',
    cameraId: 'cam-002',
    cameraName: 'Corredor 01',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    level: 'error',
    message: 'Falha na autenticacao',
    details: 'Credenciais invalidas. Verifique usuario e senha.'
  },
  {
    id: 'log-4',
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    level: 'debug',
    message: 'Buffering ajustado',
    details: 'Buffer aumentado para 2048KB'
  },
  {
    id: 'log-5',
    cameraId: 'cam-003',
    cameraName: 'Estacionamento A',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    level: 'info',
    message: 'Gravacao iniciada',
    details: 'Modo: Continuo | Bitrate: 2.5Mbps | Retencao: 30 dias'
  },
  {
    id: 'log-6',
    cameraId: 'cam-004',
    cameraName: 'Estacionamento B',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    level: 'error',
    message: 'Disco cheio',
    details: 'Espaco disponivel: 50MB (critico). Considere expandir armazenamento.'
  },
  {
    id: 'log-7',
    cameraId: 'cam-005',
    cameraName: 'Sala de Servidores',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    level: 'warning',
    message: 'IP duplicado detectado',
    details: 'Outro dispositivo na rede com IP 10.0.10.15'
  },
  {
    id: 'log-8',
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    level: 'info',
    message: 'Manutencao agendada completada',
    details: 'Firmware atualizado para v2.4.1'
  }
]

// Mock AI Logs
export const MOCK_AI_LOGS: AiLog[] = [
  {
    id: 'ai-log-1',
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    module: 'Intrusao',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    level: 'info',
    message: 'Evento de intrusao detectado',
    processingTime: 45,
    detections: 2
  },
  {
    id: 'ai-log-2',
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    module: 'LPR',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    level: 'info',
    message: 'Placa detectada e reconhecida',
    processingTime: 120,
    detections: 1
  },
  {
    id: 'ai-log-3',
    cameraId: 'cam-003',
    cameraName: 'Estacionamento A',
    module: 'Contagem de Pessoas',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    level: 'info',
    message: 'Evento de contagem processado',
    processingTime: 30,
    detections: 5
  },
  {
    id: 'ai-log-4',
    cameraId: 'cam-002',
    cameraName: 'Corredor 01',
    module: 'Loitering',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    level: 'warning',
    message: 'Permanencia em zona sensivel detectada',
    processingTime: 55,
    detections: 1
  },
  {
    id: 'ai-log-5',
    cameraId: 'cam-004',
    cameraName: 'Estacionamento B',
    module: 'Linha Virtual',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    level: 'error',
    message: 'Falha no processamento de linha virtual',
    processingTime: 0,
    detections: 0
  },
  {
    id: 'ai-log-6',
    cameraId: 'cam-005',
    cameraName: 'Sala de Servidores',
    module: 'EPI',
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    level: 'info',
    message: 'Verificacao de EPI completa',
    processingTime: 60,
    detections: 0
  }
]

// Mock Stream Test Results
export const MOCK_STREAM_TESTS: StreamTestResult[] = [
  {
    cameraId: 'cam-001',
    cameraName: 'Entrada Principal',
    status: 'success',
    rtspUrl: 'rtsp://10.0.10.1/stream1',
    rtmpUrl: 'rtmp://10.0.10.1/live/stream1',
    resolution: '1920x1080',
    bitrate: '4.5 Mbps',
    fps: 30,
    latency: 150,
    testedAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    cameraId: 'cam-002',
    cameraName: 'Corredor 01',
    status: 'failed',
    rtspUrl: 'rtsp://10.0.10.2/stream1',
    errors: ['Timeout na conexao RTSP', 'Credenciais invalidas'],
    testedAt: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    cameraId: 'cam-003',
    cameraName: 'Estacionamento A',
    status: 'success',
    rtspUrl: 'rtsp://10.0.10.3/stream1',
    rtmpUrl: 'rtmp://10.0.10.3/live/stream1',
    resolution: '1280x720',
    bitrate: '2.8 Mbps',
    fps: 30,
    latency: 200,
    testedAt: new Date(Date.now() - 3 * 60000).toISOString()
  },
  {
    cameraId: 'cam-004',
    cameraName: 'Estacionamento B',
    status: 'success',
    rtspUrl: 'rtsp://10.0.10.4/stream1',
    rtmpUrl: 'rtmp://10.0.10.4/live/stream1',
    resolution: '1920x1080',
    bitrate: '3.2 Mbps',
    fps: 25,
    latency: 180,
    testedAt: new Date(Date.now() - 2 * 60000).toISOString()
  }
]

// Mock Problematic Cameras
export const MOCK_PROBLEMATIC_CAMERAS: ProblematicCamera[] = [
  {
    id: 'cam-002',
    name: 'Corredor 01',
    status: 'offline',
    lastOnline: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    errorCount: 12,
    avgLatency: 850,
    site: 'Unifique Headquarters',
    tenant: 'Unifique Headquarters'
  },
  {
    id: 'cam-006',
    name: 'Sala de Reuniao 02',
    status: 'error',
    lastOnline: new Date(Date.now() - 30 * 60000).toISOString(),
    errorCount: 5,
    avgLatency: 420,
    site: 'Unifique Headquarters',
    tenant: 'Unifique Headquarters'
  },
  {
    id: 'cam-007',
    name: 'Fachada Externa',
    status: 'degraded',
    lastOnline: new Date(Date.now() - 5 * 60000).toISOString(),
    errorCount: 2,
    avgLatency: 750,
    site: 'Retail Park Brasil',
    tenant: 'Retail Park Brasil'
  },
  {
    id: 'cam-008',
    name: 'Portaria Traseira',
    status: 'offline',
    lastOnline: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    errorCount: 8,
    avgLatency: 600,
    site: 'Hospital Vida Plena',
    tenant: 'Hospital Vida Plena'
  }
]
