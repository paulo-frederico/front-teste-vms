/**
 * Painel de Eventos para o Módulo de Investigação
 * Lista de eventos com filtros e ações
 */

import { useState, useCallback, memo } from 'react'
import {
  Clock,
  Camera,
  Filter,
  ChevronRight,
  AlertTriangle,
  Check,
  Plus,
  Eye,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import type { Event } from '@/modules/shared/types/investigation'
import { EventType, EventSeverity } from '@/modules/shared/types/investigation'
import {
  eventTypeLabels,
  eventSeverityLabels,
  eventSeverityColors,
  eventTypeColors,
} from '@/mocks/events.mock'

interface EventsPanelProps {
  events: Event[]
  isLoading?: boolean
  onGoToTime: (event: Event) => void
  onAddToCase: (event: Event) => void
  selectedEventId?: string | null
}

// Formatar timestamp
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const formatFullDate = (timestamp: string): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Componente de item de evento
const EventItem = memo(function EventItem({
  event,
  isSelected,
  onGoToTime,
  onAddToCase,
  onViewDetails,
}: {
  event: Event
  isSelected: boolean
  onGoToTime: () => void
  onAddToCase: () => void
  onViewDetails: () => void
}) {
  return (
    <div
      className={cn(
        'group p-3 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer',
        isSelected && 'bg-muted'
      )}
      onClick={onViewDetails}
    >
      <div className="flex items-start gap-3">
        {/* Indicador de tipo */}
        <div
          className="mt-1 w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: eventTypeColors[event.type] }}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0">
          {/* Header do evento */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium truncate">
              {eventTypeLabels[event.type]}
            </span>
            <Badge
              variant="outline"
              className={cn('text-[10px] h-5', eventSeverityColors[event.severity])}
            >
              {eventSeverityLabels[event.severity]}
            </Badge>
            {event.acknowledged && (
              <Check className="h-3 w-3 text-green-500" aria-label="Reconhecido" />
            )}
          </div>

          {/* Info secundária */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimestamp(event.timestamp)}
            </span>
            <span className="flex items-center gap-1 truncate">
              <Camera className="h-3 w-3" />
              {event.cameraName}
            </span>
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onGoToTime()
            }}
            aria-label="Ir para o tempo"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCase()
            }}
            aria-label="Adicionar ao caso"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
})

// Componente de detalhes do evento
const EventDetails = memo(function EventDetails({
  event,
  open,
  onClose,
  onGoToTime,
  onAddToCase,
}: {
  event: Event | null
  open: boolean
  onClose: () => void
  onGoToTime: () => void
  onAddToCase: () => void
}) {
  if (!event) return null

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: eventTypeColors[event.type] }}
            />
            {eventTypeLabels[event.type]}
          </SheetTitle>
          <SheetDescription>{event.cameraName}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Preview (placeholder) */}
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Eye className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">Preview do evento</span>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Severidade</span>
              <Badge className={eventSeverityColors[event.severity]}>
                {eventSeverityLabels[event.severity]}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Data/Hora</span>
              <span>{formatFullDate(event.timestamp)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Câmera</span>
              <span className="truncate max-w-[200px]">{event.cameraName}</span>
            </div>
            {event.siteName && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Local</span>
                <span>{event.siteName}</span>
              </div>
            )}
            {event.areaName && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Área</span>
                <span>{event.areaName}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="flex items-center gap-1">
                {event.acknowledged ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    Reconhecido
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    Pendente
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Metadados */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Metadados</h4>
              <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                {event.metadata.confidence && (
                  <div className="flex justify-between">
                    <span>Confiança</span>
                    <span>{Math.round(event.metadata.confidence * 100)}%</span>
                  </div>
                )}
                {event.metadata.licensePlate && (
                  <div className="flex justify-between">
                    <span>Placa</span>
                    <span className="font-mono">{event.metadata.licensePlate}</span>
                  </div>
                )}
                {event.metadata.vehicleType && (
                  <div className="flex justify-between">
                    <span>Tipo de veículo</span>
                    <span>{event.metadata.vehicleType}</span>
                  </div>
                )}
                {event.metadata.objectCount && (
                  <div className="flex justify-between">
                    <span>Objetos detectados</span>
                    <span>{event.metadata.objectCount}</span>
                  </div>
                )}
                {event.metadata.direction && (
                  <div className="flex justify-between">
                    <span>Direção</span>
                    <span>
                      {event.metadata.direction === 'in' ? 'Entrada' : event.metadata.direction === 'out' ? 'Saída' : 'Desconhecido'}
                    </span>
                  </div>
                )}
                {event.metadata.duration && (
                  <div className="flex justify-between">
                    <span>Duração</span>
                    <span>{Math.floor(event.metadata.duration / 60)}min</span>
                  </div>
                )}
                {event.metadata.zoneName && (
                  <div className="flex justify-between">
                    <span>Zona</span>
                    <span>{event.metadata.zoneName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {event.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Notas</h4>
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                {event.notes}
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={onGoToTime}>
              <ChevronRight className="h-4 w-4 mr-2" />
              Ir para o tempo
            </Button>
            <Button variant="outline" className="flex-1" onClick={onAddToCase}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar ao caso
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
})

export const EventsPanel = memo(function EventsPanel({
  events,
  isLoading = false,
  onGoToTime,
  onAddToCase,
  selectedEventId,
}: EventsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [selectedSeverities, setSelectedSeverities] = useState<EventSeverity[]>([])
  const [showAcknowledged, setShowAcknowledged] = useState(true)
  const [detailsEvent, setDetailsEvent] = useState<Event | null>(null)

  // Filtrar eventos
  const filteredEvents = events.filter((event) => {
    // Busca textual
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        event.cameraName.toLowerCase().includes(query) ||
        event.siteName?.toLowerCase().includes(query) ||
        event.areaName?.toLowerCase().includes(query) ||
        event.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        eventTypeLabels[event.type].toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Filtro de tipos
    if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
      return false
    }

    // Filtro de severidade
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(event.severity)) {
      return false
    }

    // Filtro de acknowledged
    if (!showAcknowledged && event.acknowledged) {
      return false
    }

    return true
  })

  const handleTypeToggle = useCallback((type: EventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const handleSeverityToggle = useCallback((severity: EventSeverity) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedTypes([])
    setSelectedSeverities([])
    setShowAcknowledged(true)
  }, [])

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedSeverities.length > 0 || !showAcknowledged

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header com busca e filtros */}
      <div className="p-3 border-b space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn('h-8 gap-1', hasActiveFilters && 'border-primary')}
              >
                <Filter className="h-3.5 w-3.5" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                    {(selectedTypes.length || 0) +
                      (selectedSeverities.length || 0) +
                      (!showAcknowledged ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tipo de Evento</DropdownMenuLabel>
              {Object.values(EventType).map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: eventTypeColors[type] }}
                    />
                    {eventTypeLabels[type]}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Severidade</DropdownMenuLabel>
              {Object.values(EventSeverity).map((severity) => (
                <DropdownMenuCheckboxItem
                  key={severity}
                  checked={selectedSeverities.includes(severity)}
                  onCheckedChange={() => handleSeverityToggle(severity)}
                >
                  {eventSeverityLabels[severity]}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showAcknowledged}
                onCheckedChange={(checked) => setShowAcknowledged(checked)}
              >
                Mostrar reconhecidos
              </DropdownMenuCheckboxItem>
              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={clearFilters}
                  >
                    <X className="h-3 w-3 mr-2" />
                    Limpar filtros
                  </Button>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contador de resultados */}
        <div className="text-xs text-muted-foreground">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''}
          {hasActiveFilters && ` (filtrado de ${events.length})`}
        </div>
      </div>

      {/* Lista de eventos */}
      <ScrollArea className="flex-1">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <span className="text-sm">Nenhum evento encontrado</span>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2 text-primary underline">
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              isSelected={event.id === selectedEventId}
              onGoToTime={() => onGoToTime(event)}
              onAddToCase={() => onAddToCase(event)}
              onViewDetails={() => setDetailsEvent(event)}
            />
          ))
        )}
      </ScrollArea>

      {/* Modal de detalhes */}
      <EventDetails
        event={detailsEvent}
        open={!!detailsEvent}
        onClose={() => setDetailsEvent(null)}
        onGoToTime={() => {
          if (detailsEvent) {
            onGoToTime(detailsEvent)
            setDetailsEvent(null)
          }
        }}
        onAddToCase={() => {
          if (detailsEvent) {
            onAddToCase(detailsEvent)
            setDetailsEvent(null)
          }
        }}
      />
    </div>
  )
})
