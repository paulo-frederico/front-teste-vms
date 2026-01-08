/**
 * Tipos para o Módulo de Investigação
 * Inclui Eventos, Segmentos de Gravação e Casos
 */

// =============================================================================
// EVENTOS
// =============================================================================

export enum EventType {
  MOTION = 'MOTION',
  PERSON = 'PERSON',
  VEHICLE = 'VEHICLE',
  LPR = 'LPR',
  INTRUSION = 'INTRUSION',
  LINE_CROSSING = 'LINE_CROSSING',
  LOITERING = 'LOITERING',
  FACE_DETECTED = 'FACE_DETECTED',
  SYSTEM = 'SYSTEM',
  MANUAL = 'MANUAL',
}

export enum EventSeverity {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface EventMetadata {
  confidence?: number
  objectCount?: number
  licensePlate?: string
  vehicleType?: string
  personAttributes?: {
    gender?: string
    ageRange?: string
    clothing?: string
  }
  zoneId?: string
  zoneName?: string
  direction?: 'in' | 'out' | 'unknown'
  speed?: number
  duration?: number
  systemMessage?: string
}

export interface Event {
  id: string
  cameraId: string
  cameraName: string
  siteId?: string
  siteName?: string
  areaId?: string
  areaName?: string
  type: EventType
  severity: EventSeverity
  timestamp: string // ISO timestamp
  endTimestamp?: string // ISO timestamp (for duration events)
  thumbnailUrl?: string
  videoClipUrl?: string
  metadata: EventMetadata
  tags: string[]
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
  notes?: string
  addedToCase?: string // Case ID if added
  createdAt: string
  updatedAt: string
}

// =============================================================================
// SEGMENTOS DE GRAVAÇÃO
// =============================================================================

export enum RecordingStatus {
  AVAILABLE = 'AVAILABLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  CORRUPTED = 'CORRUPTED',
  DELETED = 'DELETED',
}

export interface RecordingSegment {
  id: string
  cameraId: string
  cameraName: string
  startTime: string // ISO timestamp
  endTime: string // ISO timestamp
  durationSeconds: number
  status: RecordingStatus
  sizeBytes: number
  hasAudio: boolean
  quality: 'LOW' | 'MEDIUM' | 'HIGH' | 'ULTRA'
  fps: number
  hasEvents: boolean
  eventCount: number
  streamUrl?: string // URL para playback
  thumbnailUrl?: string
}

export interface RecordingGap {
  cameraId: string
  startTime: string
  endTime: string
  reason: 'OFFLINE' | 'DISABLED' | 'STORAGE_FULL' | 'ERROR' | 'UNKNOWN'
}

export interface TimelineData {
  cameraId: string
  date: string // YYYY-MM-DD
  segments: RecordingSegment[]
  gaps: RecordingGap[]
  events: Event[]
  activityHistogram: number[] // 24 valores (um por hora), 0-100
}

// =============================================================================
// CASOS (Case Management)
// =============================================================================

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_REVIEW = 'PENDING_REVIEW',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum CasePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface CaseClip {
  id: string
  cameraId: string
  cameraName: string
  startTime: string
  endTime: string
  durationSeconds: number
  thumbnailUrl?: string
  videoUrl?: string
  notes?: string
  addedBy: string
  addedByName: string
  addedAt: string
}

export interface CaseEvent {
  id: string
  eventId: string
  event: Event
  notes?: string
  addedBy: string
  addedByName: string
  addedAt: string
}

export interface CaseNote {
  id: string
  content: string
  createdBy: string
  createdByName: string
  createdAt: string
  updatedAt: string
}

export interface CaseAuditEntry {
  id: string
  action: 'CREATED' | 'UPDATED' | 'CLIP_ADDED' | 'EVENT_ADDED' | 'NOTE_ADDED' | 'STATUS_CHANGED' | 'EXPORTED' | 'SHARED'
  description: string
  performedBy: string
  performedByName: string
  performedAt: string
  metadata?: Record<string, unknown>
}

export interface CaseAssignee {
  id: string
  name: string
  email: string
  role: string
  assignedAt: string
  assignedBy: string
}

export interface Case {
  id: string
  title: string
  description: string
  status: CaseStatus
  priority: CasePriority
  tags: string[]

  // Período do caso
  incidentStartTime?: string
  incidentEndTime?: string

  // Evidências
  clips: CaseClip[]
  events: CaseEvent[]
  notes: CaseNote[]

  // Responsáveis
  createdBy: string
  createdByName: string
  assignees: CaseAssignee[]

  // Auditoria
  auditTrail: CaseAuditEntry[]

  // Metadados
  createdAt: string
  updatedAt: string
  closedAt?: string
  closedBy?: string
  closedByName?: string
}

// =============================================================================
// DTOs e Filtros
// =============================================================================

export interface EventFilters {
  cameraIds?: string[]
  siteIds?: string[]
  areaIds?: string[]
  types?: EventType[]
  severities?: EventSeverity[]
  startTime?: string
  endTime?: string
  acknowledged?: boolean
  search?: string
  tags?: string[]
}

export interface RecordingFilters {
  cameraId: string
  startTime: string
  endTime: string
  hasEvents?: boolean
  quality?: string[]
}

export interface CaseFilters {
  status?: CaseStatus[]
  priority?: CasePriority[]
  assigneeId?: string
  search?: string
  startDate?: string
  endDate?: string
  tags?: string[]
}

export interface CreateCaseDTO {
  title: string
  description: string
  priority: CasePriority
  tags?: string[]
  incidentStartTime?: string
  incidentEndTime?: string
}

export interface UpdateCaseDTO {
  title?: string
  description?: string
  status?: CaseStatus
  priority?: CasePriority
  tags?: string[]
  incidentStartTime?: string
  incidentEndTime?: string
}

export interface AddClipToCaseDTO {
  caseId: string
  cameraId: string
  startTime: string
  endTime: string
  notes?: string
}

export interface AddEventToCaseDTO {
  caseId: string
  eventId: string
  notes?: string
}

export interface AddNoteToCaseDTO {
  caseId: string
  content: string
}

// =============================================================================
// PLAYBACK
// =============================================================================

export interface PlaybackState {
  isPlaying: boolean
  currentTime: number // seconds from start of day
  playbackSpeed: 0.5 | 1 | 2 | 4
  volume: number // 0-1
  isMuted: boolean
  isFullscreen: boolean
  selectedCameraId: string | null
  selectedDate: string // YYYY-MM-DD
}

export interface PlayerControls {
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setSpeed: (speed: 0.5 | 1 | 2 | 4) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleFullscreen: () => void
  stepForward: () => void
  stepBackward: () => void
  goToEvent: (event: Event) => void
}
