/**
 * Tipos para o Módulo Video Wall / Mosaico
 * Gerenciamento de layouts e tiles para monitoramento ao vivo
 */

// =============================================================================
// LAYOUTS
// =============================================================================

export type LayoutPreset = '1x1' | '2x2' | '3x3' | '4x4' | '5x5' | 'auto'

export interface LayoutConfig {
  id: string
  name: string
  preset: LayoutPreset
  rows: number
  cols: number
  tiles: TileConfig[]
  createdAt: string
  updatedAt: string
  isDefault?: boolean
}

// =============================================================================
// TILES
// =============================================================================

export enum TileStatus {
  EMPTY = 'EMPTY',
  LOADING = 'LOADING',
  STREAMING = 'STREAMING',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR',
  PAUSED = 'PAUSED',
}

export interface TileStreamInfo {
  fps: number
  bitrate: number // Kbps
  resolution: string
  codec: string
  latencyMs: number
  isRecording: boolean
}

export interface TileConfig {
  id: string
  position: number // 0-indexed position in grid
  cameraId: string | null
  cameraName?: string
  status: TileStatus
  streamInfo?: TileStreamInfo
  isPinned: boolean
  isMuted: boolean
  isMaximized: boolean
  lastUpdated: string
}

// =============================================================================
// CÂMERAS PARA VIDEO WALL
// =============================================================================

export type CameraWallStatus = 'online' | 'offline' | 'unstable' | 'maintenance'

export interface CameraForWall {
  id: string
  name: string
  siteName?: string
  areaName?: string
  groupName?: string
  status: CameraWallStatus
  thumbnailUrl?: string
  streamUrl?: string
  isRecording: boolean
  lastSeen: string
  resolution?: string
  fps?: number
  bitrate?: number
}

export interface CameraGroup {
  id: string
  name: string
  siteId?: string
  siteName?: string
  cameras: CameraForWall[]
  cameraCount: number
  onlineCount: number
}

// =============================================================================
// FILTROS E BUSCA
// =============================================================================

export interface CameraWallFilters {
  search?: string
  siteIds?: string[]
  groupIds?: string[]
  status?: CameraWallStatus[]
  hasRecording?: boolean
}

// =============================================================================
// ESTADO DO VIDEO WALL
// =============================================================================

export interface VideoWallState {
  currentLayout: LayoutConfig | null
  savedLayouts: LayoutConfig[]
  isFullscreen: boolean
  autoFitEnabled: boolean
  maxTilesLimit: number
  activeTileCount: number
}

// =============================================================================
// AÇÕES DO VIDEO WALL
// =============================================================================

export interface VideoWallActions {
  // Layout
  setLayout: (preset: LayoutPreset) => void
  saveLayout: (name: string) => void
  loadLayout: (layoutId: string) => void
  clearLayout: () => void
  deleteLayout: (layoutId: string) => void
  toggleFullscreen: () => void

  // Tiles
  addCameraToTile: (cameraId: string, tilePosition: number) => void
  removeCameraFromTile: (tilePosition: number) => void
  swapTiles: (position1: number, position2: number) => void
  pinTile: (tilePosition: number) => void
  unpinTile: (tilePosition: number) => void
  maximizeTile: (tilePosition: number) => void
  minimizeTile: () => void
  muteTile: (tilePosition: number) => void
  unmuteTile: (tilePosition: number) => void
  reconnectTile: (tilePosition: number) => void
}

// =============================================================================
// DTOs
// =============================================================================

export interface SaveLayoutDTO {
  name: string
  preset: LayoutPreset
  tiles: Array<{
    position: number
    cameraId: string | null
  }>
  isDefault?: boolean
}

export interface UpdateTileDTO {
  tilePosition: number
  cameraId?: string | null
  isPinned?: boolean
  isMuted?: boolean
}

// =============================================================================
// PERSISTÊNCIA (localStorage)
// =============================================================================

export interface VideoWallStorage {
  currentLayoutId: string | null
  layouts: LayoutConfig[]
  lastSelectedCameras: string[] // IDs das últimas câmeras selecionadas
  preferences: {
    defaultPreset: LayoutPreset
    maxTiles: number
    autoReconnect: boolean
    showOverlays: boolean
  }
}

// =============================================================================
// CONSTANTES
// =============================================================================

export const LAYOUT_PRESETS: Record<LayoutPreset, { rows: number; cols: number; maxTiles: number }> = {
  '1x1': { rows: 1, cols: 1, maxTiles: 1 },
  '2x2': { rows: 2, cols: 2, maxTiles: 4 },
  '3x3': { rows: 3, cols: 3, maxTiles: 9 },
  '4x4': { rows: 4, cols: 4, maxTiles: 16 },
  '5x5': { rows: 5, cols: 5, maxTiles: 25 },
  'auto': { rows: 0, cols: 0, maxTiles: 16 }, // Auto-fit based on screen
}

export const MAX_SAFE_TILES = 16 // Limite seguro para performance
