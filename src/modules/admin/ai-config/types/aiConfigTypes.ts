// Tipos de Configuracao de IA conforme documento VMS Unifique

export type AiModuleType =
  | 'intrusion'
  | 'line_cross'
  | 'lpr'
  | 'people_count'
  | 'vehicle_count'
  | 'loitering'
  | 'epi'

export type AiModuleStatus = 'enabled' | 'disabled' | 'configuring'

export interface AiZone {
  id: string
  name: string
  type: 'polygon' | 'line' | 'rectangle'
  points: { x: number; y: number }[]
  color: string
  moduleType: AiModuleType
}

export interface AiModuleConfig {
  id: string
  type: AiModuleType
  enabled: boolean
  sensitivity: number // 0-100
  zones: AiZone[]
  schedule?: AiSchedule
  createdAt: string
  updatedAt: string
}

export interface AiSchedule {
  enabled: boolean
  periods: AiSchedulePeriod[]
}

export interface AiSchedulePeriod {
  id: string
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  startTime: string // HH:mm
  endTime: string // HH:mm
}

export interface CameraAiConfig {
  cameraId: string
  cameraName: string
  tenantId: string
  tenantName: string
  siteId: string
  siteName: string
  modules: AiModuleConfig[]
  globalSensitivity: number
  lastUpdated: string
  updatedBy: string
}

export interface GlobalAiConfig {
  id: string
  tenantId?: string
  tenantName?: string
  defaultSensitivity: number
  modulesEnabled: AiModuleType[]
  serverAssignment: 'auto' | 'manual'
  assignedServerId?: string
  assignedServerName?: string
  loadBalancing: 'round_robin' | 'least_load' | 'priority'
  maxCamerasPerModule: number
  createdAt: string
  updatedAt: string
}

export const AI_MODULE_LABELS: Record<AiModuleType, string> = {
  intrusion: 'Deteccao de Intrusao',
  line_cross: 'Linha Virtual',
  lpr: 'LPR (Leitura de Placas)',
  people_count: 'Contagem de Pessoas',
  vehicle_count: 'Contagem de Veiculos',
  loitering: 'Permanencia (Loitering)',
  epi: 'Deteccao de EPI'
}

export const AI_MODULE_DESCRIPTIONS: Record<AiModuleType, string> = {
  intrusion: 'Detecta quando pessoas ou objetos entram em areas demarcadas',
  line_cross: 'Detecta quando alguem cruza uma linha virtual em qualquer direcao',
  lpr: 'Reconhece e registra placas de veiculos (padrao Brasil/Mercosul)',
  people_count: 'Conta pessoas entrando e saindo de areas especificas',
  vehicle_count: 'Conta veiculos entrando e saindo de areas especificas',
  loitering: 'Detecta quando alguem permanece em uma area por tempo prolongado',
  epi: 'Verifica uso de Equipamentos de Protecao Individual'
}

export const AI_MODULE_COLORS: Record<AiModuleType, string> = {
  intrusion: '#ef4444',
  line_cross: '#f59e0b',
  lpr: '#3b82f6',
  people_count: '#22c55e',
  vehicle_count: '#8b5cf6',
  loitering: '#ec4899',
  epi: '#06b6d4'
}

export const AI_MODULE_ICONS: Record<AiModuleType, string> = {
  intrusion: 'Shield',
  line_cross: 'ArrowLeftRight',
  lpr: 'Car',
  people_count: 'Users',
  vehicle_count: 'Truck',
  loitering: 'Clock',
  epi: 'HardHat'
}
