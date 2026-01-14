/**
 * Página Video Wall / Mosaico
 * Monitoramento ao vivo em grid com layouts customizáveis
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Grid3X3,
  Maximize,
  Minimize,
  Save,
  FolderOpen,
  Trash2,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { VideoTile } from '../components/VideoTile'
import { CameraSidebar } from '../components/CameraSidebar'

import { videoWallService } from '@/services/api/videowall.service'
import { useTenantFilter } from '@/hooks/useTenantData'

import type {
  CameraForWall,
  CameraGroup,
  LayoutConfig,
  LayoutPreset,
} from '@/modules/shared/types/videowall'
import { TileStatus, MAX_SAFE_TILES } from '@/modules/shared/types/videowall'

// Presets de layout disponíveis
const PRESET_OPTIONS: { value: LayoutPreset; label: string; tiles: number }[] = [
  { value: '1x1', label: '1x1', tiles: 1 },
  { value: '2x2', label: '2x2', tiles: 4 },
  { value: '3x3', label: '3x3', tiles: 9 },
  { value: '4x4', label: '4x4', tiles: 16 },
  { value: '5x5', label: '5x5', tiles: 25 },
]

export function VideoWallPage() {
  // LGPD: Filtrar por tenant do usuário logado (clientes só veem suas câmeras)
  const tenantFilter = useTenantFilter()

  // Estado de layout
  const [currentLayout, setCurrentLayout] = useState<LayoutConfig | null>(null)
  const [savedLayouts, setSavedLayouts] = useState<LayoutConfig[]>([])
  const [selectedPreset, setSelectedPreset] = useState<LayoutPreset>('2x2')

  // Estado de câmeras
  const [cameras, setCameras] = useState<CameraForWall[]>([])
  const [groups, setGroups] = useState<CameraGroup[]>([])

  // Estado de UI
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [maximizedTile, setMaximizedTile] = useState<number | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveLayoutName, setSaveLayoutName] = useState('')

  // Estado de loading
  const [isLoadingCameras, setIsLoadingCameras] = useState(true)
  const [isLoadingLayouts, setIsLoadingLayouts] = useState(true)

  // Carregar câmeras e grupos - FILTRANDO POR TENANT (LGPD)
  useEffect(() => {
    const loadCameras = async () => {
      setIsLoadingCameras(true)
      try {
        // Passar tenantId para filtrar câmeras (clientes só veem suas câmeras)
        const [camerasData, groupsData] = await Promise.all([
          videoWallService.listCameras({ tenantId: tenantFilter.tenantId }),
          videoWallService.listCameraGroups(),
        ])

        // Filtrar grupos também por tenant se necessário
        let filteredGroups = groupsData
        if (tenantFilter.tenantId) {
          const cameraIds = new Set(camerasData.map((c) => c.id))
          filteredGroups = groupsData
            .map((g) => ({
              ...g,
              cameras: g.cameras.filter((c) => cameraIds.has(c.id)),
              cameraCount: g.cameras.filter((c) => cameraIds.has(c.id)).length,
              onlineCount: g.cameras.filter((c) => cameraIds.has(c.id) && c.status === 'online').length,
            }))
            .filter((g) => g.cameraCount > 0)
        }

        setCameras(camerasData)
        setGroups(filteredGroups)
      } catch (error) {
        console.error('Erro ao carregar câmeras:', error)
      } finally {
        setIsLoadingCameras(false)
      }
    }
    loadCameras()
  }, [tenantFilter.tenantId])

  // Carregar layouts salvos
  useEffect(() => {
    const loadLayouts = async () => {
      setIsLoadingLayouts(true)
      try {
        const layouts = await videoWallService.listLayouts()
        setSavedLayouts(layouts)

        // Tentar carregar layout atual ou padrão
        const current = await videoWallService.getCurrentLayout()
        if (current) {
          setCurrentLayout(current)
          setSelectedPreset(current.preset)
        } else if (layouts.length > 0) {
          const defaultLayout = layouts.find((l) => l.isDefault) || layouts[0]
          setCurrentLayout(defaultLayout)
          setSelectedPreset(defaultLayout.preset)
        } else {
          // Criar layout vazio
          await handleCreateEmptyLayout('2x2')
        }
      } catch (error) {
        console.error('Erro ao carregar layouts:', error)
      } finally {
        setIsLoadingLayouts(false)
      }
    }
    loadLayouts()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleCreateEmptyLayout é estável e só executamos na montagem
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (maximizedTile !== null) {
          setMaximizedTile(null)
        } else if (isFullscreen) {
          handleToggleFullscreen()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleToggleFullscreen é estável
  }, [maximizedTile, isFullscreen])

  // Handlers
  const handleCreateEmptyLayout = useCallback(async (preset: LayoutPreset) => {
    try {
      const newLayout = await videoWallService.createLayoutFromPreset(preset)
      setCurrentLayout(newLayout)
      setSavedLayouts((prev) => [...prev, newLayout])
      setSelectedPreset(preset)
    } catch (error) {
      console.error('Erro ao criar layout:', error)
    }
  }, [])

  const handleChangePreset = useCallback(async (preset: LayoutPreset) => {
    setSelectedPreset(preset)
    await handleCreateEmptyLayout(preset)
  }, [handleCreateEmptyLayout])

  const handleLoadLayout = useCallback(async (layout: LayoutConfig) => {
    try {
      await videoWallService.setCurrentLayout(layout.id)
      setCurrentLayout(layout)
      setSelectedPreset(layout.preset)
    } catch (error) {
      console.error('Erro ao carregar layout:', error)
    }
  }, [])

  const handleSaveLayout = useCallback(async () => {
    if (!currentLayout || !saveLayoutName.trim()) return

    try {
      const updatedLayout = await videoWallService.updateLayout(currentLayout.id, {
        name: saveLayoutName.trim(),
      })
      setSavedLayouts((prev) =>
        prev.map((l) => (l.id === updatedLayout.id ? updatedLayout : l))
      )
      setCurrentLayout(updatedLayout)
      setShowSaveDialog(false)
      setSaveLayoutName('')
    } catch (error) {
      console.error('Erro ao salvar layout:', error)
    }
  }, [currentLayout, saveLayoutName])

  const handleDeleteLayout = useCallback(async (layoutId: string) => {
    try {
      await videoWallService.deleteLayout(layoutId)
      setSavedLayouts((prev) => prev.filter((l) => l.id !== layoutId))
      if (currentLayout?.id === layoutId) {
        const remaining = savedLayouts.filter((l) => l.id !== layoutId)
        if (remaining.length > 0) {
          await handleLoadLayout(remaining[0])
        } else {
          await handleCreateEmptyLayout('2x2')
        }
      }
    } catch (error) {
      console.error('Erro ao deletar layout:', error)
    }
  }, [currentLayout, savedLayouts, handleLoadLayout, handleCreateEmptyLayout])

  const handleClearLayout = useCallback(async () => {
    if (!currentLayout) return
    await handleCreateEmptyLayout(selectedPreset)
  }, [currentLayout, selectedPreset, handleCreateEmptyLayout])

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleAddCameraToTile = useCallback(
    async (cameraId: string, tilePosition?: number) => {
      if (!currentLayout) return

      // Encontrar primeiro tile vazio se posição não especificada
      const position = tilePosition ?? currentLayout.tiles.findIndex(
        (t) => t.status === TileStatus.EMPTY || !t.cameraId
      )

      if (position === -1) {
        console.log('Nenhum tile vazio disponível')
        return
      }

      try {
        const updatedLayout = await videoWallService.addCameraToTile(
          currentLayout.id,
          position,
          cameraId
        )
        setCurrentLayout(updatedLayout)
        setSavedLayouts((prev) =>
          prev.map((l) => (l.id === updatedLayout.id ? updatedLayout : l))
        )
      } catch (error) {
        console.error('Erro ao adicionar câmera:', error)
      }
    },
    [currentLayout]
  )

  const handleRemoveCameraFromTile = useCallback(
    async (tilePosition: number) => {
      if (!currentLayout) return

      try {
        const updatedLayout = await videoWallService.removeCameraFromTile(
          currentLayout.id,
          tilePosition
        )
        setCurrentLayout(updatedLayout)
        setSavedLayouts((prev) =>
          prev.map((l) => (l.id === updatedLayout.id ? updatedLayout : l))
        )
      } catch (error) {
        console.error('Erro ao remover câmera:', error)
      }
    },
    [currentLayout]
  )

  const handleTileMuteToggle = useCallback(
    async (tilePosition: number) => {
      if (!currentLayout) return

      const tile = currentLayout.tiles.find((t) => t.position === tilePosition)
      if (!tile) return

      try {
        const updatedLayout = await videoWallService.updateTile(currentLayout.id, tilePosition, {
          isMuted: !tile.isMuted,
        })
        setCurrentLayout(updatedLayout)
      } catch (error) {
        console.error('Erro ao alterar mute:', error)
      }
    },
    [currentLayout]
  )

  const handleTilePinToggle = useCallback(
    async (tilePosition: number) => {
      if (!currentLayout) return

      const tile = currentLayout.tiles.find((t) => t.position === tilePosition)
      if (!tile) return

      try {
        const updatedLayout = await videoWallService.updateTile(currentLayout.id, tilePosition, {
          isPinned: !tile.isPinned,
        })
        setCurrentLayout(updatedLayout)
      } catch (error) {
        console.error('Erro ao alterar pin:', error)
      }
    },
    [currentLayout]
  )

  const handleTileReconnect = useCallback((tilePosition: number) => {
    // Stub - simular reconexão
    console.log('Reconectando tile:', tilePosition)
  }, [])

  const handleSwapCamera = useCallback((tilePosition: number) => {
    // TODO: Abrir modal para selecionar nova câmera
    console.log('Trocar câmera do tile:', tilePosition)
  }, [])

  // Handle drag & drop
  const handleDrop = useCallback(
    async (e: React.DragEvent, tilePosition: number) => {
      e.preventDefault()
      const cameraId = e.dataTransfer.getData('text/plain')
      if (cameraId) {
        await handleAddCameraToTile(cameraId, tilePosition)
      }
    },
    [handleAddCameraToTile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  // Câmeras ativas no layout
  const activeCameraIds = useMemo(() => {
    if (!currentLayout) return []
    return currentLayout.tiles
      .filter((t) => t.cameraId)
      .map((t) => t.cameraId as string)
  }, [currentLayout])

  // Grid classes baseado no preset (apenas colunas, rows são automáticas com aspect-video)
  const gridClasses = useMemo(() => {
    switch (selectedPreset) {
      case '1x1':
        return 'grid-cols-1'
      case '2x2':
        return 'grid-cols-2'
      case '3x3':
        return 'grid-cols-3'
      case '4x4':
        return 'grid-cols-4'
      case '5x5':
        return 'grid-cols-5'
      default:
        return 'grid-cols-2'
    }
  }, [selectedPreset])

  const isLoading = isLoadingCameras || isLoadingLayouts

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar de câmeras */}
      <div
        className={cn(
          'w-72 shrink-0 border-r bg-card transition-all duration-300',
          isFullscreen && 'hidden'
        )}
      >
        <CameraSidebar
          cameras={cameras}
          groups={groups}
          onAddCamera={handleAddCameraToTile}
          isLoading={isLoadingCameras}
          activeCameraIds={activeCameraIds}
        />
      </div>

      {/* Área principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div
          className={cn(
            'flex items-center justify-between p-3 border-b bg-card',
            isFullscreen && 'absolute top-0 left-0 right-0 z-50 bg-black/80'
          )}
        >
          <div className="flex items-center gap-3">
            <h1 className={cn('text-lg font-semibold', isFullscreen && 'text-white')}>
              Video Wall
            </h1>

            {/* Layout selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  {selectedPreset}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Layout</DropdownMenuLabel>
                {PRESET_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleChangePreset(option.value)}
                    className={cn(selectedPreset === option.value && 'bg-accent')}
                    disabled={option.tiles > MAX_SAFE_TILES}
                  >
                    <span className="flex-1">{option.label}</span>
                    <Badge variant="secondary" className="text-[10px] h-4">
                      {option.tiles} tiles
                    </Badge>
                    {option.tiles > MAX_SAFE_TILES && (
                      <span className="text-[10px] text-muted-foreground ml-1">(lento)</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Saved layouts */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Layouts
                  {savedLayouts.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] h-4 ml-1">
                      {savedLayouts.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {savedLayouts.length === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    Nenhum layout salvo
                  </div>
                ) : (
                  savedLayouts.map((layout) => (
                    <div key={layout.id} className="flex items-center group">
                      <DropdownMenuItem
                        className="flex-1 flex items-center justify-between"
                        onClick={() => handleLoadLayout(layout)}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="truncate">{layout.name}</span>
                          <span className="text-[10px] text-muted-foreground ml-2">
                            {layout.preset}
                          </span>
                        </div>
                        {layout.isDefault && (
                          <Badge variant="secondary" className="text-[9px] h-4 ml-2">
                            Padrão
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteLayout(layout.id)
                        }}
                        aria-label={`Deletar layout ${layout.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar layout atual
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLayout}
              disabled={!currentLayout || activeCameraIds.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Limpar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFullscreen}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-1.5" />
                  Sair
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-1.5" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Grid de tiles */}
        <div className={cn('flex-1 p-3 bg-muted/30 overflow-auto flex items-start justify-center', isFullscreen && 'pt-16')}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Carregando...</p>
              </div>
            </div>
          ) : !currentLayout ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">Nenhum layout carregado</p>
                <Button variant="outline" onClick={() => handleCreateEmptyLayout('2x2')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Criar layout
                </Button>
              </div>
            </div>
          ) : (
            <div className={cn('grid gap-2 w-full max-h-full place-content-center', gridClasses)}>
              {currentLayout.tiles.map((tile) => {
                const camera = tile.cameraId
                  ? cameras.find((c) => c.id === tile.cameraId)
                  : null

                return (
                  <div
                    key={tile.id}
                    className={cn(
                      'relative aspect-video',
                      maximizedTile === tile.position && 'fixed inset-4 z-50 aspect-auto'
                    )}
                    onDrop={(e) => handleDrop(e, tile.position)}
                    onDragOver={handleDragOver}
                  >
                    <VideoTile
                      tile={tile}
                      camera={camera}
                      onRemove={() => handleRemoveCameraFromTile(tile.position)}
                      onMaximize={() =>
                        setMaximizedTile(
                          maximizedTile === tile.position ? null : tile.position
                        )
                      }
                      onMuteToggle={() => handleTileMuteToggle(tile.position)}
                      onPinToggle={() => handleTilePinToggle(tile.position)}
                      onReconnect={() => handleTileReconnect(tile.position)}
                      onSwapCamera={() => handleSwapCamera(tile.position)}
                      isMaximized={maximizedTile === tile.position}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div
          className={cn(
            'flex items-center justify-between px-3 py-1.5 border-t bg-card text-xs text-muted-foreground',
            isFullscreen && 'hidden'
          )}
        >
          <div className="flex items-center gap-4">
            <span>
              {activeCameraIds.length} câmera{activeCameraIds.length !== 1 ? 's' : ''} ativa
              {activeCameraIds.length !== 1 ? 's' : ''}
            </span>
            {currentLayout && (
              <span>Layout: {currentLayout.name || 'Sem nome'}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">ESC</kbd>
            <span>Sair do fullscreen/maximizar</span>
          </div>
        </div>
      </div>

      {/* Overlay quando tile maximizado */}
      {maximizedTile !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setMaximizedTile(null)}
        />
      )}

      {/* Dialog para salvar layout */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Layout</DialogTitle>
            <DialogDescription>
              Dê um nome para este layout para poder carregá-lo posteriormente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="layout-name">Nome do layout</Label>
              <Input
                id="layout-name"
                value={saveLayoutName}
                onChange={(e) => setSaveLayoutName(e.target.value)}
                placeholder="Ex: Monitoramento principal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLayout} disabled={!saveLayoutName.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
