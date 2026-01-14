/**
 * Componente VideoPlayer para reprodução de gravações
 * Inclui controles de playback, velocidade e volume
 */

import { useState, useRef, useCallback } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Camera,
  Download,
  Bookmark,
  Rewind,
  FastForward,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  cameraName: string
  currentTime: Date
  isPlaying: boolean
  playbackSpeed: number
  volume: number
  isMuted: boolean
  onPlayPause: () => void
  onSpeedChange: (speed: number) => void
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
  onSeek: (seconds: number) => void
  onExportClip: () => void
  onAddBookmark: () => void
  onFullscreenToggle: () => void
  isFullscreen?: boolean
  className?: string
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2, 4, 8, 16]

export function VideoPlayer({
  cameraName,
  currentTime,
  isPlaying,
  playbackSpeed,
  volume,
  isMuted,
  onPlayPause,
  onSpeedChange,
  onVolumeChange,
  onMuteToggle,
  onSeek,
  onExportClip,
  onAddBookmark,
  onFullscreenToggle,
  isFullscreen = false,
  className,
}: VideoPlayerProps) {
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setShowControls(false)
    }
  }, [isPlaying])

  return (
    <div
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Área do vídeo (placeholder) */}
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white/30">
          <Camera className="h-16 w-16 mx-auto mb-2" />
          <p className="text-sm font-medium">{cameraName}</p>
          <p className="text-xs font-mono mt-1">
            {format(currentTime, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
          </p>
          <p className="text-[10px] mt-2 uppercase tracking-wider">Gravação</p>
        </div>
      </div>

      {/* Overlay de controles */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">{cameraName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs font-mono bg-black/50 px-2 py-1 rounded">
              {format(currentTime, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
            </span>
          </div>
        </div>

        {/* Controles centrais (play grande) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-20 w-20 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-10 w-10" />
            ) : (
              <Play className="h-10 w-10 ml-1" />
            )}
          </Button>
        </div>

        {/* Controles inferiores */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Barra de progresso (simplificada para o player) */}
          <div className="h-1 bg-white/20 rounded-full">
            <div className="h-full w-1/3 bg-red-500 rounded-full" />
          </div>

          {/* Controles principais */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* Seek para trás */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => onSeek(-30)}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>-30 segundos</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Rewind frame a frame */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => onSeek(-1)}
                    >
                      <Rewind className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>-1 segundo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-white hover:bg-white/20"
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              {/* Forward frame a frame */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => onSeek(1)}
                    >
                      <FastForward className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>+1 segundo</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Seek para frente */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => onSeek(30)}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>+30 segundos</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Velocidade */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-white hover:bg-white/20 text-xs font-mono px-2"
                  >
                    {playbackSpeed}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Velocidade</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {SPEED_OPTIONS.map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => onSpeedChange(speed)}
                      className={cn(playbackSpeed === speed && 'bg-accent')}
                    >
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Volume */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={onMuteToggle}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="w-20 hidden sm:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={([v]) => onVolumeChange(v)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Bookmark */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={onAddBookmark}
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Adicionar marcador</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Exportar clip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={onExportClip}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exportar clip</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Fullscreen */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={onFullscreenToggle}
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? 'Sair do fullscreen' : 'Fullscreen'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
