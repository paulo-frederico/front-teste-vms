/**
 * Componente de Tile para Video Wall
 * Exibe stream de câmera individual com controles
 */

import { useState, memo } from 'react'
import {
  MoreHorizontal,
  Volume2,
  VolumeX,
  Maximize2,
  Pin,
  RefreshCw,
  X,
  Camera,
  AlertCircle,
  Loader2,
  Circle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TileConfig, CameraForWall } from '@/modules/shared/types/videowall'
import { TileStatus } from '@/modules/shared/types/videowall'
import { cameraStatusColors } from '@/mocks/cameras-wall.mock'

interface VideoTileProps {
  tile: TileConfig
  camera?: CameraForWall | null
  onRemove: () => void
  onMaximize: () => void
  onMuteToggle: () => void
  onPinToggle: () => void
  onReconnect: () => void
  onSwapCamera: () => void
  isMaximized?: boolean
}

export const VideoTile = memo(function VideoTile({
  tile,
  camera,
  onRemove,
  onMaximize,
  onMuteToggle,
  onPinToggle,
  onReconnect,
  onSwapCamera,
  isMaximized = false,
}: VideoTileProps) {
  const [showControls, setShowControls] = useState(false)

  // Estado vazio
  if (tile.status === TileStatus.EMPTY || !camera) {
    return (
      <div
        className={cn(
          'relative h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 flex items-center justify-center transition-colors',
          'hover:border-muted-foreground/50 hover:bg-muted/30'
        )}
      >
        <div className="text-center text-muted-foreground">
          <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">Arraste uma câmera aqui</p>
          <p className="text-[10px] opacity-70">ou clique para selecionar</p>
        </div>
      </div>
    )
  }

  // Estado de loading
  if (tile.status === TileStatus.LOADING) {
    return (
      <div className="relative h-full w-full rounded-lg bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white/70">
          <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <p className="text-xs">{camera.name}</p>
          <p className="text-[10px] opacity-70">Conectando...</p>
        </div>
      </div>
    )
  }

  // Estado offline
  if (tile.status === TileStatus.OFFLINE) {
    return (
      <div className="relative h-full w-full rounded-lg bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-black/50">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn('h-2 w-2 rounded-full shrink-0', cameraStatusColors.offline)} />
            <span className="text-xs text-white truncate">{camera.name}</span>
          </div>
          <TileMenu
            onRemove={onRemove}
            onSwapCamera={onSwapCamera}
            onMaximize={onMaximize}
            onPin={onPinToggle}
            isPinned={tile.isPinned}
          />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col items-center justify-center text-white/70">
          <AlertCircle className="h-8 w-8 mb-2 text-red-400" />
          <p className="text-xs mb-1">Câmera Offline</p>
          <p className="text-[10px] opacity-70 mb-3">
            Última conexão: {new Date(camera.lastSeen).toLocaleTimeString('pt-BR')}
          </p>
          <Button variant="outline" size="sm" onClick={onReconnect} className="h-7 text-xs">
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Reconectar
          </Button>
        </div>
      </div>
    )
  }

  // Estado de erro
  if (tile.status === TileStatus.ERROR) {
    return (
      <div className="relative h-full w-full rounded-lg bg-gray-900 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-black/50">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn('h-2 w-2 rounded-full shrink-0 bg-yellow-500')} />
            <span className="text-xs text-white truncate">{camera.name}</span>
          </div>
          <TileMenu
            onRemove={onRemove}
            onSwapCamera={onSwapCamera}
            onMaximize={onMaximize}
            onPin={onPinToggle}
            isPinned={tile.isPinned}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-white/70">
          <AlertCircle className="h-8 w-8 mb-2 text-yellow-400" />
          <p className="text-xs mb-3">Erro de conexão</p>
          <Button variant="outline" size="sm" onClick={onReconnect} className="h-7 text-xs">
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  // Estado streaming/pausado
  return (
    <div
      className={cn(
        'relative h-full w-full rounded-lg bg-gray-900 overflow-hidden',
        isMaximized && 'fixed inset-4 z-50'
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onDoubleClick={onMaximize}
    >
      {/* Vídeo placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white/30">
          <Camera className="h-12 w-12 mx-auto mb-1" />
          <span className="text-xs font-mono">LIVE</span>
        </div>
      </div>

      {/* Header overlay */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-2 transition-opacity duration-200',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn('h-2 w-2 rounded-full shrink-0', cameraStatusColors[camera.status])} />
            <span className="text-xs text-white truncate font-medium">{camera.name}</span>
            {tile.isPinned && <Pin className="h-3 w-3 text-yellow-400 shrink-0" />}
          </div>
          <TileMenu
            onRemove={onRemove}
            onSwapCamera={onSwapCamera}
            onMaximize={onMaximize}
            onPin={onPinToggle}
            isPinned={tile.isPinned}
          />
        </div>
      </div>

      {/* Stream info overlay */}
      {tile.streamInfo && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-2 transition-opacity duration-200',
            showControls ? 'opacity-100' : 'opacity-60'
          )}
        >
          <div className="flex items-center justify-between text-[10px] text-white/70">
            <div className="flex items-center gap-2">
              {tile.streamInfo.isRecording && (
                <span className="flex items-center gap-1 text-red-400">
                  <Circle className="h-2 w-2 fill-current animate-pulse" />
                  REC
                </span>
              )}
              <span>{tile.streamInfo.fps} FPS</span>
              <span>{Math.round(tile.streamInfo.bitrate / 1024)}Mbps</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{tile.streamInfo.resolution}</span>
              <span className="text-green-400">{tile.streamInfo.latencyMs}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Controles de áudio */}
      <div
        className={cn(
          'absolute bottom-10 right-2 z-10 transition-opacity duration-200',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 bg-black/50 hover:bg-black/70 text-white"
          onClick={(e) => {
            e.stopPropagation()
            onMuteToggle()
          }}
          aria-label={tile.isMuted ? 'Ativar som' : 'Silenciar'}
        >
          {tile.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Paused overlay */}
      {tile.status === TileStatus.PAUSED && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <span className="text-white/70 text-xs">Pausado</span>
        </div>
      )}
    </div>
  )
})

// Menu dropdown do tile
const TileMenu = memo(function TileMenu({
  onRemove,
  onSwapCamera,
  onMaximize,
  onPin,
  isPinned,
}: {
  onRemove: () => void
  onSwapCamera: () => void
  onMaximize: () => void
  onPin: () => void
  isPinned: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/20"
          aria-label="Opções do tile"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onSwapCamera}>
          <Camera className="h-4 w-4 mr-2" />
          Trocar câmera
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMaximize}>
          <Maximize2 className="h-4 w-4 mr-2" />
          Maximizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPin}>
          <Pin className="h-4 w-4 mr-2" />
          {isPinned ? 'Desafixar' : 'Fixar'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
          <X className="h-4 w-4 mr-2" />
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
