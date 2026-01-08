/**
 * Componente Timeline para o Módulo de Investigação
 * Timeline visual com segmentos de gravação e marcadores de eventos
 */

import { useCallback, useRef, useState, memo, useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { RecordingSegment, RecordingGap, Event } from '@/modules/shared/types/investigation'
import { eventTypeColors, eventTypeLabels } from '@/mocks/events.mock'
import { gapReasonColors, gapReasonLabels } from '@/mocks/recordings.mock'

interface InvestigationTimelineProps {
  segments: RecordingSegment[]
  gaps: RecordingGap[]
  events: Event[]
  activityHistogram: number[]
  currentTime: number // seconds from start of day
  onTimeChange: (time: number) => void
  selectedDate: string // YYYY-MM-DD
  isLoading?: boolean
}

const HOURS_IN_DAY = 24
const SECONDS_IN_DAY = 86400

// Converter timestamp ISO para segundos do dia
const timestampToSeconds = (timestamp: string): number => {
  const date = new Date(timestamp)
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()
}

// Formatar segundos para HH:MM:SS
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// Formatar segundos para HH:MM
const formatHour = (hour: number): string => {
  return `${String(hour).padStart(2, '0')}:00`
}

export const InvestigationTimeline = memo(function InvestigationTimeline({
  segments,
  gaps,
  events,
  activityHistogram,
  currentTime,
  onTimeChange,
  selectedDate: _selectedDate,
  isLoading = false,
}: InvestigationTimelineProps) {
  // selectedDate pode ser usado no futuro para mostrar a data no header
  void _selectedDate
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoverTime, setHoverTime] = useState<number | null>(null)

  // Calcular posição percentual para um tempo
  const timeToPercent = useCallback((seconds: number): number => {
    return (seconds / SECONDS_IN_DAY) * 100
  }, [])

  // Converter posição do mouse para tempo
  const positionToTime = useCallback((clientX: number): number => {
    if (!timelineRef.current) return 0
    const rect = timelineRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(1, x / rect.width))
    return Math.floor(percent * SECONDS_IN_DAY)
  }, [])

  // Handle mouse events para scrubbing
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      const time = positionToTime(e.clientX)
      onTimeChange(time)
    },
    [positionToTime, onTimeChange]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const time = positionToTime(e.clientX)
      setHoverTime(time)

      if (isDragging) {
        onTimeChange(time)
      }
    },
    [isDragging, positionToTime, onTimeChange]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    setHoverTime(null)
  }, [])

  // Processar segmentos para renderização
  const processedSegments = useMemo(() => {
    return segments.map((segment) => {
      const startSeconds = timestampToSeconds(segment.startTime)
      const endSeconds = timestampToSeconds(segment.endTime)
      return {
        ...segment,
        startPercent: timeToPercent(startSeconds),
        widthPercent: timeToPercent(endSeconds - startSeconds),
      }
    })
  }, [segments, timeToPercent])

  // Processar gaps para renderização
  const processedGaps = useMemo(() => {
    return gaps.map((gap) => {
      const startSeconds = timestampToSeconds(gap.startTime)
      const endSeconds = timestampToSeconds(gap.endTime)
      return {
        ...gap,
        startPercent: timeToPercent(startSeconds),
        widthPercent: timeToPercent(endSeconds - startSeconds),
      }
    })
  }, [gaps, timeToPercent])

  // Processar eventos para renderização
  const processedEvents = useMemo(() => {
    return events.map((event) => {
      const seconds = timestampToSeconds(event.timestamp)
      return {
        ...event,
        positionPercent: timeToPercent(seconds),
      }
    })
  }, [events, timeToPercent])

  // Horas para labels
  const hourLabels = useMemo(() => {
    return Array.from({ length: HOURS_IN_DAY + 1 }, (_, i) => ({
      hour: i,
      percent: (i / HOURS_IN_DAY) * 100,
    }))
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-20 bg-muted animate-pulse rounded-lg" />
        <div className="h-12 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-2">
        {/* Histograma de atividade */}
        <div className="relative h-12 bg-muted/30 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-end">
            {activityHistogram.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-brand-primary/30 transition-all"
                style={{ height: `${value}%` }}
                title={`${formatHour(index)}: ${value}% atividade`}
              />
            ))}
          </div>
          <div className="absolute top-1 left-2 text-xs text-muted-foreground">Atividade</div>
        </div>

        {/* Timeline principal */}
        <div
          ref={timelineRef}
          className="relative h-16 bg-muted/20 rounded-lg cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          role="slider"
          aria-label="Timeline de gravação"
          aria-valuemin={0}
          aria-valuemax={SECONDS_IN_DAY}
          aria-valuenow={currentTime}
          tabIndex={0}
        >
          {/* Fundo com grid de horas */}
          <div className="absolute inset-0 flex">
            {hourLabels.slice(0, -1).map(({ hour }) => (
              <div
                key={hour}
                className={cn(
                  'flex-1 border-r border-gray-700/30',
                  hour % 6 === 0 && 'border-gray-600/50'
                )}
              />
            ))}
          </div>

          {/* Gaps (áreas sem gravação) */}
          {processedGaps.map((gap, index) => (
            <Tooltip key={`gap-${index}`}>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-0 h-full opacity-70"
                  style={{
                    left: `${gap.startPercent}%`,
                    width: `${gap.widthPercent}%`,
                    backgroundColor: gapReasonColors[gap.reason] || gapReasonColors.UNKNOWN,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{gapReasonLabels[gap.reason]}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(timestampToSeconds(gap.startTime))} - {formatTime(timestampToSeconds(gap.endTime))}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Segmentos de gravação */}
          {processedSegments.map((segment) => (
            <Tooltip key={segment.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    'absolute top-1 h-[calc(100%-0.5rem)] rounded-sm transition-opacity',
                    segment.hasEvents ? 'bg-green-600' : 'bg-green-700/60'
                  )}
                  style={{
                    left: `${segment.startPercent}%`,
                    width: `${segment.widthPercent}%`,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{segment.cameraName}</p>
                <p className="text-xs">
                  {formatTime(timestampToSeconds(segment.startTime))} - {formatTime(timestampToSeconds(segment.endTime))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {segment.quality} | {segment.fps}fps | {Math.round(segment.sizeBytes / 1024 / 1024)}MB
                </p>
                {segment.hasEvents && (
                  <p className="text-xs text-green-400">{segment.eventCount} eventos</p>
                )}
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Marcadores de eventos */}
          <div className="absolute bottom-0 left-0 right-0 h-4">
            {processedEvents.map((event) => (
              <Tooltip key={event.id}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute bottom-0 w-1 h-4 rounded-t cursor-pointer hover:h-6 transition-all"
                    style={{
                      left: `${event.positionPercent}%`,
                      backgroundColor: eventTypeColors[event.type],
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTimeChange(timestampToSeconds(event.timestamp))
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{eventTypeLabels[event.type]}</p>
                  <p className="text-xs">{event.cameraName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(timestampToSeconds(event.timestamp))}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Indicador de posição atual */}
          <div
            className="absolute top-0 h-full w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${timeToPercent(currentTime)}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-red-500" />
          </div>

          {/* Indicador de hover */}
          {hoverTime !== null && !isDragging && (
            <div
              className="absolute top-0 h-full w-px bg-white/30 pointer-events-none"
              style={{ left: `${timeToPercent(hoverTime)}%` }}
            >
              <div className="absolute -top-6 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {formatTime(hoverTime)}
              </div>
            </div>
          )}
        </div>

        {/* Labels de hora */}
        <div className="relative h-4">
          {hourLabels.map(({ hour, percent }) => (
            <span
              key={hour}
              className={cn(
                'absolute text-xs text-muted-foreground -translate-x-1/2',
                hour % 3 === 0 ? 'opacity-100' : 'opacity-0 md:opacity-60'
              )}
              style={{ left: `${percent}%` }}
            >
              {formatHour(hour)}
            </span>
          ))}
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-600" />
            <span>Com eventos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-green-700/60" />
            <span>Gravação</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-500/70" />
            <span>Sem gravação</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
})
