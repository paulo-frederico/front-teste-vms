/**
 * Componente Player para o Módulo de Investigação
 * Player de vídeo com controles VMS-style
 */

import { useState, useRef, useCallback, useEffect, memo } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  ChevronDown,
  Circle,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface CameraOption {
  id: string
  name: string
  status: 'online' | 'offline' | 'recording' | 'error'
}

interface InvestigationPlayerProps {
  cameras: CameraOption[]
  selectedCameraId: string | null
  onCameraChange: (cameraId: string) => void
  currentTime: number // seconds from start of day
  onTimeChange: (time: number) => void
  isPlaying: boolean
  onPlayPauseToggle: () => void
  playbackSpeed: 0.5 | 1 | 2 | 4
  onSpeedChange: (speed: 0.5 | 1 | 2 | 4) => void
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const statusConfig = {
  online: { color: 'bg-green-500', label: 'Online' },
  offline: { color: 'bg-red-500', label: 'Offline' },
  recording: { color: 'bg-red-500 animate-pulse', label: 'Gravando' },
  error: { color: 'bg-yellow-500', label: 'Erro' },
}

export const InvestigationPlayer = memo(function InvestigationPlayer({
  cameras,
  selectedCameraId,
  onCameraChange,
  currentTime,
  onTimeChange,
  isPlaying,
  onPlayPauseToggle,
  playbackSpeed,
  onSpeedChange,
  isLoading = false,
  hasError = false,
  onRetry,
}: InvestigationPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)

  const selectedCamera = cameras.find((c) => c.id === selectedCameraId)

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Frame step (stub - avança/retrocede 1 frame ~ 33ms at 30fps)
  const stepForward = useCallback(() => {
    onTimeChange(Math.min(currentTime + 0.033, 86400))
  }, [currentTime, onTimeChange])

  const stepBackward = useCallback(() => {
    onTimeChange(Math.max(currentTime - 0.033, 0))
  }, [currentTime, onTimeChange])

  // Skip 10 seconds
  const skipForward = useCallback(() => {
    onTimeChange(Math.min(currentTime + 10, 86400))
  }, [currentTime, onTimeChange])

  const skipBackward = useCallback(() => {
    onTimeChange(Math.max(currentTime - 10, 0))
  }, [currentTime, onTimeChange])

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      setShowControls(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isPlaying])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col bg-black rounded-lg overflow-hidden',
        isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Header com seletor de câmera */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-3 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 gap-2 text-white hover:bg-white/20 hover:text-white"
                aria-label="Selecionar câmera"
              >
                {selectedCamera ? (
                  <>
                    <span
                      className={cn('h-2 w-2 rounded-full', statusConfig[selectedCamera.status].color)}
                      aria-hidden="true"
                    />
                    <span className="max-w-[200px] truncate text-sm font-medium">
                      {selectedCamera.name}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-white/70">Selecionar câmera</span>
                )}
                <ChevronDown className="h-4 w-4 text-white/70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
              {cameras.map((camera) => (
                <DropdownMenuItem
                  key={camera.id}
                  onClick={() => onCameraChange(camera.id)}
                  className="flex items-center gap-2"
                >
                  <span
                    className={cn('h-2 w-2 rounded-full', statusConfig[camera.status].color)}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{camera.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {statusConfig[camera.status].label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status indicator */}
          {selectedCamera && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              {selectedCamera.status === 'recording' && (
                <span className="flex items-center gap-1 text-red-400">
                  <Circle className="h-3 w-3 fill-current animate-pulse" />
                  REC
                </span>
              )}
              <span>{formatTime(currentTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Área do vídeo (placeholder) */}
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3 text-white/70">
            <Loader2 className="h-12 w-12 animate-spin" />
            <span className="text-sm">Carregando gravação...</span>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center gap-3 text-white/70">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <span className="text-sm">Erro ao carregar gravação</span>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
                Tentar novamente
              </Button>
            )}
          </div>
        ) : !selectedCamera ? (
          <div className="flex flex-col items-center gap-3 text-white/50">
            <Play className="h-16 w-16" />
            <span className="text-sm">Selecione uma câmera para iniciar</span>
          </div>
        ) : selectedCamera.status === 'offline' ? (
          <div className="flex flex-col items-center gap-3 text-white/50">
            <AlertCircle className="h-12 w-12 text-yellow-400" />
            <span className="text-sm">Câmera offline</span>
            <span className="text-xs text-white/30">Buscando gravações disponíveis...</span>
          </div>
        ) : (
          // Placeholder de vídeo
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            <div className="relative flex flex-col items-center gap-2 text-white/40">
              <span className="text-sm font-mono">{selectedCamera.name}</span>
              <span className="text-xs">Playback @ {playbackSpeed}x</span>
              <span className="text-lg font-mono mt-2">{formatTime(currentTime)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controles inferiores */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 hover:text-white"
            onClick={onPlayPauseToggle}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          {/* Skip backward */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white"
            onClick={skipBackward}
            aria-label="Retroceder 10 segundos"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* Frame step backward */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-white/70 hover:bg-white/20 hover:text-white"
            onClick={stepBackward}
            aria-label="Retroceder 1 frame"
          >
            -1f
          </Button>

          {/* Frame step forward */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-white/70 hover:bg-white/20 hover:text-white"
            onClick={stepForward}
            aria-label="Avançar 1 frame"
          >
            +1f
          </Button>

          {/* Skip forward */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white"
            onClick={skipForward}
            aria-label="Avançar 10 segundos"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Speed selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-sm text-white/70 hover:bg-white/20 hover:text-white"
                aria-label="Velocidade de reprodução"
              >
                {playbackSpeed}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {([0.5, 1, 2, 4] as const).map((speed) => (
                <DropdownMenuItem
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={cn(playbackSpeed === speed && 'bg-accent')}
                >
                  {speed}x {speed === 1 && '(Normal)'}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume * 100]}
                max={100}
                step={1}
                onValueChange={([val]) => {
                  setVolume(val / 100)
                  if (val > 0) setIsMuted(false)
                }}
                className="cursor-pointer"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Fullscreen */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
})
