/**
 * Componente Timeline para navegação em gravações
 * Mostra segmentos de gravação e permite navegar no tempo
 */

import { useRef, useState, useCallback, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RecordingSegment, TimelineEvent, TimeRange } from '../types'

interface TimelineProps {
  date: Date
  segments: RecordingSegment[]
  events: TimelineEvent[]
  currentTime: Date
  onTimeChange: (time: Date) => void
  onSegmentClick?: (segment: RecordingSegment) => void
  className?: string
}

// Níveis de zoom (minutos visíveis na timeline)
const ZOOM_LEVELS = [1440, 720, 360, 180, 60, 30, 15, 5] // 24h, 12h, 6h, 3h, 1h, 30min, 15min, 5min

export function Timeline({
  date,
  segments,
  events,
  currentTime,
  onTimeChange,
  onSegmentClick,
  className,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(2) // Índice do ZOOM_LEVELS (6h)
  const [viewRange, setViewRange] = useState<TimeRange>(() => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    return { start, end }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartTime, setDragStartTime] = useState<Date | null>(null)

  const visibleMinutes = ZOOM_LEVELS[zoomLevel]

  // Atualizar range quando a data mudar
  useEffect(() => {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)
    setViewRange({ start, end })
  }, [date])

  // Calcular posição X baseado no tempo
  const timeToX = useCallback((time: Date): number => {
    const containerWidth = containerRef.current?.clientWidth || 800
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const totalMs = dayEnd.getTime() - dayStart.getTime()
    const timeMs = time.getTime() - dayStart.getTime()

    return (timeMs / totalMs) * containerWidth
  }, [date])

  // Calcular tempo baseado na posição X
  const xToTime = useCallback((x: number): Date => {
    const containerWidth = containerRef.current?.clientWidth || 800
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const totalMs = dayEnd.getTime() - dayStart.getTime()
    const timeMs = (x / containerWidth) * totalMs

    return new Date(dayStart.getTime() + timeMs)
  }, [date])

  // Handlers de zoom
  const handleZoomIn = () => {
    if (zoomLevel < ZOOM_LEVELS.length - 1) {
      setZoomLevel(zoomLevel + 1)
    }
  }

  const handleZoomOut = () => {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1)
    }
  }

  // Handler de clique na timeline
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (isDragging) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const time = xToTime(x)
    onTimeChange(time)
  }

  // Handlers de drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartTime(currentTime)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStartTime) return

    const deltaX = e.clientX - dragStartX
    const containerWidth = containerRef.current?.clientWidth || 800
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    const totalMs = dayEnd.getTime() - dayStart.getTime()

    const deltaMs = (deltaX / containerWidth) * totalMs
    const newTime = new Date(dragStartTime.getTime() + deltaMs)

    // Limitar ao dia atual
    if (newTime >= dayStart && newTime <= dayEnd) {
      onTimeChange(newTime)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStartTime(null)
  }

  // Gerar marcadores de hora
  const hourMarkers = Array.from({ length: 25 }, (_, i) => {
    const time = new Date(date)
    time.setHours(i, 0, 0, 0)
    return time
  })

  // Calcular cor do segmento baseado no tipo
  const getSegmentColor = (type: RecordingSegment['type']) => {
    switch (type) {
      case 'continuous':
        return 'bg-green-500'
      case 'motion':
        return 'bg-blue-500'
      case 'alert':
        return 'bg-red-500'
      case 'manual':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Posição do marcador de tempo atual
  const currentTimeX = timeToX(currentTime)

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Controles de zoom */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomOut} disabled={zoomLevel === 0}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[60px] text-center">
            {visibleMinutes >= 60 ? `${visibleMinutes / 60}h` : `${visibleMinutes}min`}
          </span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleZoomIn} disabled={zoomLevel === ZOOM_LEVELS.length - 1}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm font-medium">
          {format(currentTime, "HH:mm:ss", { locale: ptBR })}
        </div>
      </div>

      {/* Timeline container */}
      <div
        ref={containerRef}
        className="relative h-24 bg-muted/50 rounded-lg overflow-hidden cursor-crosshair select-none"
        onClick={handleTimelineClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Marcadores de hora */}
        <div className="absolute inset-x-0 top-0 h-6 border-b border-border/50">
          {hourMarkers.map((time, i) => {
            const x = timeToX(time)
            const isMainHour = i % 3 === 0
            return (
              <div
                key={i}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${(i / 24) * 100}%` }}
              >
                <div className={cn(
                  'w-px bg-border',
                  isMainHour ? 'h-4' : 'h-2'
                )} />
                {isMainHour && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {format(time, 'HH:mm')}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Área de segmentos */}
        <div className="absolute inset-x-0 top-6 bottom-0">
          {/* Segmentos de gravação */}
          {segments.map((segment) => {
            const startX = timeToX(segment.startTime)
            const endX = timeToX(segment.endTime)
            const width = endX - startX

            return (
              <div
                key={segment.id}
                className={cn(
                  'absolute top-2 h-8 rounded cursor-pointer transition-opacity hover:opacity-80',
                  getSegmentColor(segment.type)
                )}
                style={{
                  left: `${(startX / (containerRef.current?.clientWidth || 800)) * 100}%`,
                  width: `${(width / (containerRef.current?.clientWidth || 800)) * 100}%`,
                  minWidth: '2px',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSegmentClick?.(segment)
                }}
                title={`${format(segment.startTime, 'HH:mm:ss')} - ${format(segment.endTime, 'HH:mm:ss')}`}
              />
            )
          })}

          {/* Eventos (marcadores) */}
          {events.map((event) => {
            const x = timeToX(event.time)
            return (
              <div
                key={event.id}
                className="absolute top-1 w-0.5 h-10 bg-yellow-500 cursor-pointer"
                style={{ left: `${(x / (containerRef.current?.clientWidth || 800)) * 100}%` }}
                title={`${event.label} - ${format(event.time, 'HH:mm:ss')}`}
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-yellow-500 rounded-full" />
              </div>
            )
          })}

          {/* Marcador de tempo atual */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
            style={{ left: `${(currentTimeX / (containerRef.current?.clientWidth || 800)) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full" />
            <div className="absolute -bottom-1 -left-1.5 w-3 h-3 bg-red-500 rotate-45" />
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-4 px-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-muted-foreground">Contínuo</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-muted-foreground">Movimento</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-muted-foreground">Alerta</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-muted-foreground">Evento</span>
        </div>
      </div>
    </div>
  )
}
