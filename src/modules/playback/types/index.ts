/**
 * Tipos do módulo de Playback/Gravações
 */

export interface Recording {
  id: string
  cameraId: string
  cameraName: string
  startTime: Date
  endTime: Date
  duration: number // em segundos
  size: number // em bytes
  hasMotion: boolean
  hasAlerts: boolean
  thumbnailUrl?: string
}

export interface RecordingSegment {
  id: string
  startTime: Date
  endTime: Date
  type: 'continuous' | 'motion' | 'alert' | 'manual'
  hasAudio: boolean
}

export interface TimelineEvent {
  id: string
  time: Date
  type: 'motion' | 'alert' | 'bookmark' | 'export'
  label: string
  severity?: 'low' | 'medium' | 'high'
}

export interface ExportClip {
  id: string
  cameraId: string
  startTime: Date
  endTime: Date
  format: 'mp4' | 'avi' | 'mkv'
  quality: 'original' | 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'ready' | 'failed'
  progress?: number
  downloadUrl?: string
}

export interface PlaybackState {
  isPlaying: boolean
  currentTime: Date
  playbackSpeed: number
  volume: number
  isMuted: boolean
}

export type TimeRange = {
  start: Date
  end: Date
}
