export enum CameraStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
  MAINTENANCE = 'MAINTENANCE'
}

export enum StreamPurpose {
  LIVE_MAIN = 'LIVE_MAIN',
  LIVE_SUB = 'LIVE_SUB',
  MOBILE_LOW = 'MOBILE_LOW',
  AI_INPUT = 'AI_INPUT',
  RECORDING_SOURCE = 'RECORDING_SOURCE'
}

export interface StreamProfile {
  id: string
  name: string
  purpose: StreamPurpose
  resolution: string
  fps: number
  bitrate: number
  codec: 'H264' | 'H265'
  mode: 'CBR' | 'VBR'
}

export interface Camera {
  id: string
  name: string
  tenantId: string
  siteId: string
  areaId?: string
  status: CameraStatus
  protocol: 'ONVIF' | 'RTSP' | 'RTMP'
  onvifEndpoint?: string
  rtspUrl?: string
  rtmpUrl?: string
  manufacturer?: string
  model?: string
  streamProfiles: StreamProfile[]
  defaultProfiles: {
    liveMain: string
    liveSub: string
    mobileLow: string
    aiInput: string
    recordingSource: string
  }
  aiEnabled: boolean
  aiModules: string[]
  recordingEnabled: boolean
  retentionDays: number
  createdAt: string
  updatedAt: string
  lastSeen?: string
}
