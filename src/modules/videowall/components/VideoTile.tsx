/**
 * Componente de Tile para Video Wall
 * Exibe stream de câmera individual com controles
 */

import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MoreHorizontal,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Pin,
  RefreshCw,
  X,
  Camera,
  AlertCircle,
  Loader2,
  Circle,
  Plus,
  Settings,
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
  onConfigure?: () => void
  isMaximized?: boolean
  canConfigure?: boolean
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
  onConfigure,
  isMaximized = false,
  canConfigure = false,
}: VideoTileProps) {
  const [showControls, setShowControls] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Estado vazio
  if (tile.status === TileStatus.EMPTY || !camera) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'relative h-full w-full rounded-xl border-2 border-dashed bg-slate-900/50 flex items-center justify-center transition-all duration-300',
          isDragOver
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : 'border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/50',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={() => setIsDragOver(false)}
      >
        <motion.div
          className="text-center text-slate-400"
          animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
        >
          <motion.div
            className={cn(
              'mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
              isDragOver ? 'bg-primary/20' : 'bg-slate-800',
            )}
            animate={isDragOver ? { rotate: 90 } : { rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {isDragOver ? (
              <Plus className="h-7 w-7 text-primary" />
            ) : (
              <Camera className="h-7 w-7 text-slate-500" />
            )}
          </motion.div>
          <p className="text-sm font-medium">
            {isDragOver ? 'Solte para adicionar' : 'Arraste uma câmera'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isDragOver ? 'A câmera será adicionada aqui' : 'ou clique na câmera na lista'}
          </p>
        </motion.div>

        {/* Pulsing border when drag over */}
        {isDragOver && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    )
  }

  // Estado de loading
  if (tile.status === TileStatus.LOADING) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-full w-full rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative text-center text-white/80">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="mx-auto mb-3"
          >
            <Loader2 className="h-10 w-10 text-primary" />
          </motion.div>
          <p className="text-sm font-medium">{camera.name}</p>
          <motion.p
            className="mt-1 text-xs text-slate-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Conectando ao stream...
          </motion.p>
        </div>
      </motion.div>
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
            onConfigure={onConfigure}
            isPinned={tile.isPinned}
            canConfigure={canConfigure}
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
            onConfigure={onConfigure}
            isPinned={tile.isPinned}
            canConfigure={canConfigure}
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'group relative h-full w-full rounded-xl bg-slate-900 overflow-hidden',
        isMaximized && 'fixed inset-4 z-50 rounded-2xl',
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onDoubleClick={onMaximize}
    >
      {/* Vídeo placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white/20">
          <Camera className="h-12 w-12 mx-auto mb-1" />
          <span className="text-xs font-mono tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Header overlay */}
      <AnimatePresence>
        {(showControls || isMaximized) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <motion.span
                  className={cn('h-2.5 w-2.5 rounded-full shrink-0', cameraStatusColors[camera.status])}
                  animate={camera.status === 'online' ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-white truncate font-medium">{camera.name}</span>
                {tile.isPinned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="shrink-0"
                  >
                    <Pin className="h-3.5 w-3.5 text-amber-400" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {/* Quick maximize button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMaximize()
                  }}
                  aria-label={isMaximized ? 'Minimizar' : 'Maximizar'}
                >
                  {isMaximized ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <TileMenu
                  onRemove={onRemove}
                  onSwapCamera={onSwapCamera}
                  onMaximize={onMaximize}
                  onPin={onPinToggle}
                  onConfigure={onConfigure}
                  isPinned={tile.isPinned}
                  canConfigure={canConfigure}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stream info overlay */}
      {tile.streamInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0.6 }}
          className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3"
        >
          <div className="flex items-center justify-between text-[11px] text-white/80">
            <div className="flex items-center gap-3">
              {tile.streamInfo.isRecording && (
                <motion.span
                  className="flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-0.5 text-red-400"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Circle className="h-2 w-2 fill-current" />
                  REC
                </motion.span>
              )}
              <span className="font-mono">{tile.streamInfo.fps} FPS</span>
              <span className="font-mono">{Math.round(tile.streamInfo.bitrate / 1024)} Mbps</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono">{tile.streamInfo.resolution}</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-mono text-emerald-400">
                {tile.streamInfo.latencyMs}ms
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controles de áudio - sempre visível em hover */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-12 right-3 z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                onMuteToggle()
              }}
              aria-label={tile.isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {tile.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paused overlay */}
      <AnimatePresence>
        {tile.status === TileStatus.PAUSED && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="h-4 w-4 border-l-2 border-r-2 border-white" />
              </motion.div>
              <span className="text-sm text-white/80">Pausado</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Border highlight on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-primary/0 pointer-events-none"
        animate={{ borderColor: showControls ? 'rgba(0, 81, 182, 0.3)' : 'rgba(0, 81, 182, 0)' }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
})

// Menu dropdown do tile
const TileMenu = memo(function TileMenu({
  onRemove,
  onSwapCamera,
  onMaximize,
  onPin,
  onConfigure,
  isPinned,
  canConfigure = false,
}: {
  onRemove: () => void
  onSwapCamera: () => void
  onMaximize: () => void
  onPin: () => void
  onConfigure?: () => void
  isPinned: boolean
  canConfigure?: boolean
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
      <DropdownMenuContent align="end" className="w-44">
        {canConfigure && onConfigure && (
          <>
            <DropdownMenuItem onClick={onConfigure}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
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
