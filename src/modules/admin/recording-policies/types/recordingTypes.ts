// Tipos de Configuracao de Gravacao conforme documento VMS Unifique

export type RecordingMode = 'continuous' | 'event_based' | 'scheduled' | 'mixed'

export type RecordingQuality = '4K' | 'FullHD' | 'HD' | 'SD'

export type StorageTier = 'hot' | 'warm' | 'cold' | 'archive'

export type ExportFormat = 'mp4' | 'avi' | 'mkv'

export type ExportPermission = 'all' | 'admin_only' | 'restricted' | 'disabled'

export interface RetentionPolicy {
  id: string
  name: string
  retentionDays: number
  storageTier: StorageTier
  autoArchive: boolean
  archiveAfterDays?: number
}

export interface RecordingSchedule {
  id: string
  name: string
  enabled: boolean
  periods: RecordingPeriod[]
}

export interface RecordingPeriod {
  id: string
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  startTime: string
  endTime: string
  mode: RecordingMode
  quality: RecordingQuality
}

export interface ExportPolicy {
  id: string
  name: string
  format: ExportFormat
  maxDurationMinutes: number
  watermarkEnabled: boolean
  watermarkText?: string
  permission: ExportPermission
  requireApproval: boolean
  auditEnabled: boolean
}

export interface StoragePolicy {
  id: string
  tenantId?: string
  tenantName?: string
  name: string
  description: string
  defaultRetentionDays: number
  maxRetentionDays: number
  recordingMode: RecordingMode
  defaultQuality: RecordingQuality
  retentionPolicies: RetentionPolicy[]
  schedules: RecordingSchedule[]
  exportPolicy: ExportPolicy
  storageQuotaGB: number
  usedStorageGB: number
  alertThresholdPercent: number
  createdAt: string
  updatedAt: string
}

export interface CameraRecordingConfig {
  cameraId: string
  cameraName: string
  tenantId: string
  tenantName: string
  siteId: string
  siteName: string
  recordingEnabled: boolean
  mode: RecordingMode
  quality: RecordingQuality
  retentionDays: number
  scheduleId?: string
  storageUsedGB: number
  lastRecordingAt?: string
  status: 'recording' | 'stopped' | 'error' | 'scheduled'
}

export const RECORDING_MODE_LABELS: Record<RecordingMode, string> = {
  continuous: 'Continuo',
  event_based: 'Baseado em Evento',
  scheduled: 'Agendado',
  mixed: 'Misto'
}

export const RECORDING_MODE_DESCRIPTIONS: Record<RecordingMode, string> = {
  continuous: 'Grava 24/7 sem interrupcao',
  event_based: 'Grava apenas quando detecta movimento ou evento de IA',
  scheduled: 'Grava em horarios especificos programados',
  mixed: 'Combina gravacao continua com eventos'
}

export const QUALITY_LABELS: Record<RecordingQuality, string> = {
  '4K': '4K Ultra HD (3840x2160)',
  'FullHD': 'Full HD (1920x1080)',
  'HD': 'HD (1280x720)',
  'SD': 'SD (640x480)'
}

export const STORAGE_TIER_LABELS: Record<StorageTier, string> = {
  hot: 'Acesso Rapido (SSD)',
  warm: 'Acesso Normal (HDD)',
  cold: 'Acesso Frio (Cloud)',
  archive: 'Arquivo (Tape/Deep Storage)'
}

export const EXPORT_PERMISSION_LABELS: Record<ExportPermission, string> = {
  all: 'Todos os usuarios',
  admin_only: 'Apenas administradores',
  restricted: 'Com aprovacao',
  disabled: 'Desabilitado'
}
