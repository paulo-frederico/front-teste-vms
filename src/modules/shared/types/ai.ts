export enum AIModule {
  LPR = 'LPR',
  INTRUSION = 'INTRUSION',
  LINE_CROSSING = 'LINE_CROSSING',
  PEOPLE_COUNTING = 'PEOPLE_COUNTING',
  VEHICLE_COUNTING = 'VEHICLE_COUNTING',
  LOITERING = 'LOITERING',
  PPE = 'PPE'
}

export interface Zone {
  id: string
  name: string
  type: 'polygon' | 'line'
  points: { x: number; y: number }[]
}

export interface AIConfig {
  cameraId: string
  module: AIModule
  enabled: boolean
  sensitivity: number
  zones?: Zone[]
  parameters?: Record<string, any>
}

export interface AIEvent {
  id: string
  cameraId: string
  tenantId: string
  module: AIModule
  timestamp: string
  confidence: number
  metadata: Record<string, any>
  plate?: string
  bbox?: {
    x: number
    y: number
    width: number
    height: number
  }
  label?: string
  snapshotUrl?: string
  processed: boolean
  alertGenerated: boolean
}

export interface AIServer {
  id: string
  name: string
  ip: string
  port: number
  status: 'ONLINE' | 'OFFLINE'
  gpu: {
    model: string
    memoryTotal: number
    memoryUsed: number
  }
  load: number
  camerasProcessing: number
}
