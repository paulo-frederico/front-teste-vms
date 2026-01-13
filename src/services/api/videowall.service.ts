/**
 * Service para Video Wall
 * Utiliza localStorage para persistência de layouts
 */

import type {
  CameraForWall,
  CameraGroup,
  CameraWallFilters,
  LayoutConfig,
  LayoutPreset,
  SaveLayoutDTO,
  TileConfig,
  VideoWallStorage,
} from '@/modules/shared/types/videowall'
import { TileStatus, LAYOUT_PRESETS } from '@/modules/shared/types/videowall'
import { mockCamerasForWall, mockCameraGroups, mockSavedLayouts } from '@/mocks/cameras-wall.mock'

const STORAGE_KEY = 'vms_videowall_storage'

// Simular latência de rede
const simulateLatency = (min = 100, max = 300): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// Helper para gerar ID único
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Helper para criar tiles vazios para um layout
const createEmptyTiles = (preset: LayoutPreset): TileConfig[] => {
  const config = LAYOUT_PRESETS[preset]
  const tiles: TileConfig[] = []

  for (let i = 0; i < config.maxTiles; i++) {
    tiles.push({
      id: `tile-${i}`,
      position: i,
      cameraId: null,
      status: TileStatus.EMPTY,
      isPinned: false,
      isMuted: true,
      isMaximized: false,
      lastUpdated: new Date().toISOString(),
    })
  }

  return tiles
}

class VideoWallService {
  private getStorageData(): VideoWallStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error)
    }

    // Retornar dados padrão se não houver dados salvos
    return {
      currentLayoutId: null,
      layouts: [...mockSavedLayouts],
      lastSelectedCameras: [],
      preferences: {
        defaultPreset: '2x2',
        maxTiles: 16,
        autoReconnect: true,
        showOverlays: true,
      },
    }
  }

  private saveStorageData(data: VideoWallStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error)
    }
  }

  // ============================================================================
  // CÂMERAS
  // ============================================================================

  /**
   * Listar câmeras para o Video Wall com filtros
   * IMPORTANTE: O filtro tenantId é obrigatório para clientes (LGPD)
   */
  async listCameras(filters?: CameraWallFilters): Promise<CameraForWall[]> {
    await simulateLatency()

    let cameras = [...mockCamerasForWall]

    if (filters) {
      // LGPD: Filtrar por tenant PRIMEIRO (cada cliente só vê suas câmeras)
      if (filters.tenantId) {
        cameras = cameras.filter((c) => c.tenantId === filters.tenantId)
      }

      // Filtrar por busca textual
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        cameras = cameras.filter(
          (c) =>
            c.name.toLowerCase().includes(searchLower) ||
            c.siteName?.toLowerCase().includes(searchLower) ||
            c.areaName?.toLowerCase().includes(searchLower) ||
            c.groupName?.toLowerCase().includes(searchLower)
        )
      }

      // Filtrar por sites
      if (filters.siteIds?.length) {
        cameras = cameras.filter((c) => c.siteName && filters.siteIds!.some((s) => c.siteName?.includes(s)))
      }

      // Filtrar por grupos
      if (filters.groupIds?.length) {
        cameras = cameras.filter((c) => c.groupName && filters.groupIds!.includes(c.groupName))
      }

      // Filtrar por status
      if (filters.status?.length) {
        cameras = cameras.filter((c) => filters.status!.includes(c.status))
      }

      // Filtrar por gravação
      if (filters.hasRecording !== undefined) {
        cameras = cameras.filter((c) => c.isRecording === filters.hasRecording)
      }
    }

    return cameras
  }

  /**
   * Listar grupos de câmeras
   */
  async listCameraGroups(): Promise<CameraGroup[]> {
    await simulateLatency(100, 200)
    return mockCameraGroups
  }

  /**
   * Buscar câmera por ID
   */
  async getCameraById(id: string): Promise<CameraForWall | null> {
    await simulateLatency(50, 100)
    return mockCamerasForWall.find((c) => c.id === id) || null
  }

  // ============================================================================
  // LAYOUTS
  // ============================================================================

  /**
   * Listar layouts salvos
   */
  async listLayouts(): Promise<LayoutConfig[]> {
    await simulateLatency(100, 200)
    const data = this.getStorageData()
    return data.layouts
  }

  /**
   * Buscar layout por ID
   */
  async getLayoutById(id: string): Promise<LayoutConfig | null> {
    await simulateLatency(50, 100)
    const data = this.getStorageData()
    return data.layouts.find((l) => l.id === id) || null
  }

  /**
   * Obter layout padrão
   */
  async getDefaultLayout(): Promise<LayoutConfig | null> {
    await simulateLatency(50, 100)
    const data = this.getStorageData()
    return data.layouts.find((l) => l.isDefault) || null
  }

  /**
   * Criar novo layout
   */
  async createLayout(layoutData: SaveLayoutDTO): Promise<LayoutConfig> {
    await simulateLatency(150, 300)

    const presetConfig = LAYOUT_PRESETS[layoutData.preset]
    const now = new Date().toISOString()

    // Criar tiles com base nos dados fornecidos
    const tiles: TileConfig[] = []
    for (let i = 0; i < presetConfig.maxTiles; i++) {
      const tileData = layoutData.tiles.find((t) => t.position === i)
      tiles.push({
        id: `tile-${i}`,
        position: i,
        cameraId: tileData?.cameraId || null,
        cameraName: tileData?.cameraId
          ? mockCamerasForWall.find((c) => c.id === tileData.cameraId)?.name
          : undefined,
        status: tileData?.cameraId ? TileStatus.LOADING : TileStatus.EMPTY,
        isPinned: false,
        isMuted: true,
        isMaximized: false,
        lastUpdated: now,
      })
    }

    const newLayout: LayoutConfig = {
      id: generateId('layout'),
      name: layoutData.name,
      preset: layoutData.preset,
      rows: presetConfig.rows,
      cols: presetConfig.cols,
      tiles,
      createdAt: now,
      updatedAt: now,
      isDefault: layoutData.isDefault,
    }

    const data = this.getStorageData()

    // Se este layout é o padrão, remover flag dos outros
    if (layoutData.isDefault) {
      data.layouts = data.layouts.map((l) => ({ ...l, isDefault: false }))
    }

    data.layouts.push(newLayout)
    data.currentLayoutId = newLayout.id
    this.saveStorageData(data)

    return newLayout
  }

  /**
   * Atualizar layout existente
   */
  async updateLayout(id: string, updates: Partial<SaveLayoutDTO>): Promise<LayoutConfig> {
    await simulateLatency(100, 200)

    const data = this.getStorageData()
    const index = data.layouts.findIndex((l) => l.id === id)

    if (index === -1) {
      throw new Error('Layout não encontrado')
    }

    const layout = data.layouts[index]
    const now = new Date().toISOString()

    // Atualizar tiles se fornecido
    if (updates.tiles) {
      for (const tileUpdate of updates.tiles) {
        const tileIndex = layout.tiles.findIndex((t) => t.position === tileUpdate.position)
        if (tileIndex !== -1) {
          layout.tiles[tileIndex] = {
            ...layout.tiles[tileIndex],
            cameraId: tileUpdate.cameraId,
            cameraName: tileUpdate.cameraId
              ? mockCamerasForWall.find((c) => c.id === tileUpdate.cameraId)?.name
              : undefined,
            status: tileUpdate.cameraId ? TileStatus.LOADING : TileStatus.EMPTY,
            lastUpdated: now,
          }
        }
      }
    }

    const updatedLayout: LayoutConfig = {
      ...layout,
      name: updates.name || layout.name,
      updatedAt: now,
      isDefault: updates.isDefault !== undefined ? updates.isDefault : layout.isDefault,
    }

    // Se este layout é o padrão, remover flag dos outros
    if (updates.isDefault) {
      data.layouts = data.layouts.map((l, i) =>
        i === index ? updatedLayout : { ...l, isDefault: false }
      )
    } else {
      data.layouts[index] = updatedLayout
    }

    this.saveStorageData(data)

    return updatedLayout
  }

  /**
   * Deletar layout
   */
  async deleteLayout(id: string): Promise<void> {
    await simulateLatency(100, 200)

    const data = this.getStorageData()
    const index = data.layouts.findIndex((l) => l.id === id)

    if (index === -1) {
      throw new Error('Layout não encontrado')
    }

    data.layouts.splice(index, 1)

    // Se era o layout atual, limpar
    if (data.currentLayoutId === id) {
      data.currentLayoutId = null
    }

    this.saveStorageData(data)
  }

  /**
   * Criar layout com preset (quick create)
   */
  async createLayoutFromPreset(preset: LayoutPreset, name?: string): Promise<LayoutConfig> {
    const presetConfig = LAYOUT_PRESETS[preset]
    const now = new Date().toISOString()

    const newLayout: LayoutConfig = {
      id: generateId('layout'),
      name: name || `Layout ${preset}`,
      preset,
      rows: presetConfig.rows,
      cols: presetConfig.cols,
      tiles: createEmptyTiles(preset),
      createdAt: now,
      updatedAt: now,
      isDefault: false,
    }

    const data = this.getStorageData()
    data.layouts.push(newLayout)
    data.currentLayoutId = newLayout.id
    this.saveStorageData(data)

    return newLayout
  }

  // ============================================================================
  // TILES
  // ============================================================================

  /**
   * Adicionar câmera a um tile
   */
  async addCameraToTile(layoutId: string, tilePosition: number, cameraId: string): Promise<LayoutConfig> {
    await simulateLatency(50, 100)

    const data = this.getStorageData()
    const layoutIndex = data.layouts.findIndex((l) => l.id === layoutId)

    if (layoutIndex === -1) {
      throw new Error('Layout não encontrado')
    }

    const camera = mockCamerasForWall.find((c) => c.id === cameraId)
    if (!camera) {
      throw new Error('Câmera não encontrada')
    }

    const tileIndex = data.layouts[layoutIndex].tiles.findIndex((t) => t.position === tilePosition)
    if (tileIndex === -1) {
      throw new Error('Tile não encontrado')
    }

    const now = new Date().toISOString()
    data.layouts[layoutIndex].tiles[tileIndex] = {
      ...data.layouts[layoutIndex].tiles[tileIndex],
      cameraId,
      cameraName: camera.name,
      status: camera.status === 'online' ? TileStatus.STREAMING : TileStatus.OFFLINE,
      streamInfo: camera.status === 'online' ? {
        fps: camera.fps || 30,
        bitrate: camera.bitrate || 4096,
        resolution: camera.resolution || '1920x1080',
        codec: 'H.265',
        latencyMs: Math.floor(Math.random() * 100) + 50,
        isRecording: camera.isRecording,
      } : undefined,
      lastUpdated: now,
    }

    data.layouts[layoutIndex].updatedAt = now
    this.saveStorageData(data)

    return data.layouts[layoutIndex]
  }

  /**
   * Remover câmera de um tile
   */
  async removeCameraFromTile(layoutId: string, tilePosition: number): Promise<LayoutConfig> {
    await simulateLatency(50, 100)

    const data = this.getStorageData()
    const layoutIndex = data.layouts.findIndex((l) => l.id === layoutId)

    if (layoutIndex === -1) {
      throw new Error('Layout não encontrado')
    }

    const tileIndex = data.layouts[layoutIndex].tiles.findIndex((t) => t.position === tilePosition)
    if (tileIndex === -1) {
      throw new Error('Tile não encontrado')
    }

    const now = new Date().toISOString()
    data.layouts[layoutIndex].tiles[tileIndex] = {
      ...data.layouts[layoutIndex].tiles[tileIndex],
      cameraId: null,
      cameraName: undefined,
      status: TileStatus.EMPTY,
      streamInfo: undefined,
      isPinned: false,
      lastUpdated: now,
    }

    data.layouts[layoutIndex].updatedAt = now
    this.saveStorageData(data)

    return data.layouts[layoutIndex]
  }

  /**
   * Trocar câmeras entre tiles
   */
  async swapTiles(layoutId: string, position1: number, position2: number): Promise<LayoutConfig> {
    await simulateLatency(50, 100)

    const data = this.getStorageData()
    const layoutIndex = data.layouts.findIndex((l) => l.id === layoutId)

    if (layoutIndex === -1) {
      throw new Error('Layout não encontrado')
    }

    const tile1Index = data.layouts[layoutIndex].tiles.findIndex((t) => t.position === position1)
    const tile2Index = data.layouts[layoutIndex].tiles.findIndex((t) => t.position === position2)

    if (tile1Index === -1 || tile2Index === -1) {
      throw new Error('Tile não encontrado')
    }

    const now = new Date().toISOString()
    const tile1 = data.layouts[layoutIndex].tiles[tile1Index]
    const tile2 = data.layouts[layoutIndex].tiles[tile2Index]

    // Trocar dados das câmeras mantendo as posições
    data.layouts[layoutIndex].tiles[tile1Index] = {
      ...tile1,
      cameraId: tile2.cameraId,
      cameraName: tile2.cameraName,
      status: tile2.status,
      streamInfo: tile2.streamInfo,
      lastUpdated: now,
    }

    data.layouts[layoutIndex].tiles[tile2Index] = {
      ...tile2,
      cameraId: tile1.cameraId,
      cameraName: tile1.cameraName,
      status: tile1.status,
      streamInfo: tile1.streamInfo,
      lastUpdated: now,
    }

    data.layouts[layoutIndex].updatedAt = now
    this.saveStorageData(data)

    return data.layouts[layoutIndex]
  }

  /**
   * Atualizar propriedades de um tile
   */
  async updateTile(
    layoutId: string,
    tilePosition: number,
    updates: { isPinned?: boolean; isMuted?: boolean }
  ): Promise<LayoutConfig> {
    await simulateLatency(30, 80)

    const data = this.getStorageData()
    const layoutIndex = data.layouts.findIndex((l) => l.id === layoutId)

    if (layoutIndex === -1) {
      throw new Error('Layout não encontrado')
    }

    const tileIndex = data.layouts[layoutIndex].tiles.findIndex((t) => t.position === tilePosition)
    if (tileIndex === -1) {
      throw new Error('Tile não encontrado')
    }

    const now = new Date().toISOString()
    data.layouts[layoutIndex].tiles[tileIndex] = {
      ...data.layouts[layoutIndex].tiles[tileIndex],
      ...updates,
      lastUpdated: now,
    }

    data.layouts[layoutIndex].updatedAt = now
    this.saveStorageData(data)

    return data.layouts[layoutIndex]
  }

  // ============================================================================
  // PREFERÊNCIAS
  // ============================================================================

  /**
   * Obter preferências
   */
  async getPreferences(): Promise<VideoWallStorage['preferences']> {
    await simulateLatency(30, 80)
    const data = this.getStorageData()
    return data.preferences
  }

  /**
   * Atualizar preferências
   */
  async updatePreferences(updates: Partial<VideoWallStorage['preferences']>): Promise<VideoWallStorage['preferences']> {
    await simulateLatency(30, 80)
    const data = this.getStorageData()
    data.preferences = { ...data.preferences, ...updates }
    this.saveStorageData(data)
    return data.preferences
  }

  /**
   * Obter layout atual
   */
  async getCurrentLayout(): Promise<LayoutConfig | null> {
    await simulateLatency(50, 100)
    const data = this.getStorageData()
    if (!data.currentLayoutId) return null
    return data.layouts.find((l) => l.id === data.currentLayoutId) || null
  }

  /**
   * Definir layout atual
   */
  async setCurrentLayout(layoutId: string): Promise<void> {
    await simulateLatency(30, 80)
    const data = this.getStorageData()
    data.currentLayoutId = layoutId
    this.saveStorageData(data)
  }

  /**
   * Resetar para dados mock (útil para desenvolvimento)
   */
  async resetToMock(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export const videoWallService = new VideoWallService()
