/**
 * Página de Investigação (Modo Investigação)
 * Playback, Timeline, Eventos e Gestão de Casos
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Calendar, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { InvestigationPlayer } from '../components/InvestigationPlayer'
import { InvestigationTimeline } from '../components/InvestigationTimeline'
import { EventsPanel } from '../components/EventsPanel'
import { CasePanel } from '../components/CasePanel'

import { eventsService } from '@/services/api/events.service'
import { recordingsService } from '@/services/api/recordings.service'
import { casesService } from '@/services/api/cases.service'

import type { Event, Case, TimelineData } from '@/modules/shared/types/investigation'
import { CasePriority } from '@/modules/shared/types/investigation'

export function InvestigationPage() {
  // Estado de data e tempo
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentTime, setCurrentTime] = useState(0) // seconds from start of day

  // Estado do player
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2 | 4>(1)

  // Estados de dados
  const [events, setEvents] = useState<Event[]>([])
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null)
  const [cases, setCases] = useState<Case[]>([])
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [cameras, setCameras] = useState<Array<{ id: string; name: string }>>([])

  // Estados de loading
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false)
  const [isLoadingCases, setIsLoadingCases] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Formatar data selecionada
  const formattedDate = useMemo(() => {
    return format(selectedDate, "yyyy-MM-dd")
  }, [selectedDate])

  // Carregar câmeras disponíveis
  useEffect(() => {
    const loadCameras = async () => {
      try {
        const camerasData = await recordingsService.getCamerasWithRecording()
        setCameras(camerasData)
        if (camerasData.length > 0 && !selectedCameraId) {
          setSelectedCameraId(camerasData[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar câmeras:', error)
      }
    }
    loadCameras()
  }, [selectedCameraId])

  // Carregar eventos
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true)
      try {
        const startTime = new Date(selectedDate)
        startTime.setHours(0, 0, 0, 0)
        const endTime = new Date(selectedDate)
        endTime.setHours(23, 59, 59, 999)

        const filters = selectedCameraId
          ? { cameraIds: [selectedCameraId], startTime: startTime.toISOString(), endTime: endTime.toISOString() }
          : { startTime: startTime.toISOString(), endTime: endTime.toISOString() }

        const eventsData = await eventsService.list(filters)
        setEvents(eventsData)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      } finally {
        setIsLoadingEvents(false)
      }
    }
    loadEvents()
  }, [selectedDate, selectedCameraId])

  // Carregar dados da timeline
  useEffect(() => {
    if (!selectedCameraId) {
      setTimelineData(null)
      return
    }

    const loadTimeline = async () => {
      setIsLoadingTimeline(true)
      setHasError(false)
      try {
        const data = await recordingsService.getTimelineData(selectedCameraId, formattedDate)
        setTimelineData(data)
      } catch (error) {
        console.error('Erro ao carregar timeline:', error)
        setHasError(true)
      } finally {
        setIsLoadingTimeline(false)
      }
    }
    loadTimeline()
  }, [selectedCameraId, formattedDate])

  // Carregar casos
  useEffect(() => {
    const loadCases = async () => {
      setIsLoadingCases(true)
      try {
        const casesData = await casesService.list()
        setCases(casesData)
      } catch (error) {
        console.error('Erro ao carregar casos:', error)
      } finally {
        setIsLoadingCases(false)
      }
    }
    loadCases()
  }, [])

  // Simular playback
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + playbackSpeed
        if (newTime >= 86400) {
          setIsPlaying(false)
          return 86399
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se estiver em input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault()
          setIsPlaying((prev) => !prev)
          break
        case 'j':
          e.preventDefault()
          setCurrentTime((prev) => Math.max(0, prev - 10))
          break
        case 'k':
          e.preventDefault()
          setIsPlaying(false)
          break
        case 'l':
          e.preventDefault()
          setCurrentTime((prev) => Math.min(86399, prev + 10))
          break
        case 'f':
          e.preventDefault()
          // Fullscreen é tratado no player
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handlers
  const handleGoToTime = useCallback((event: Event) => {
    const date = new Date(event.timestamp)
    setSelectedDate(date)
    setCurrentTime(date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds())
    if (event.cameraId) {
      setSelectedCameraId(event.cameraId)
    }
  }, [])

  const handleAddEventToCase = useCallback(
    async (event: Event) => {
      if (!selectedCase) {
        // TODO: Mostrar toast de erro
        console.log('Selecione um caso primeiro')
        return
      }
      try {
        await casesService.addEvent(
          { caseId: selectedCase.id, eventId: event.id },
          'user-001',
          'Usuário Atual'
        )
        // Recarregar caso
        const updatedCase = await casesService.getById(selectedCase.id)
        if (updatedCase) {
          setSelectedCase(updatedCase)
          setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)))
        }
      } catch (error) {
        console.error('Erro ao adicionar evento ao caso:', error)
      }
    },
    [selectedCase]
  )

  const handleCreateCase = useCallback(
    async (title: string, description: string, priority: CasePriority) => {
      try {
        const newCase = await casesService.create(
          { title, description, priority },
          'user-001',
          'Usuário Atual'
        )
        setCases((prev) => [newCase, ...prev])
        setSelectedCase(newCase)
      } catch (error) {
        console.error('Erro ao criar caso:', error)
      }
    },
    []
  )

  const handleAddNote = useCallback(async (caseId: string, content: string) => {
    try {
      await casesService.addNote({ caseId, content }, 'user-001', 'Usuário Atual')
      const updatedCase = await casesService.getById(caseId)
      if (updatedCase) {
        setSelectedCase(updatedCase)
        setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)))
      }
    } catch (error) {
      console.error('Erro ao adicionar nota:', error)
    }
  }, [])

  const handleRemoveClip = useCallback(async (caseId: string, clipId: string) => {
    try {
      await casesService.removeClip(caseId, clipId, 'user-001', 'Usuário Atual')
      const updatedCase = await casesService.getById(caseId)
      if (updatedCase) {
        setSelectedCase(updatedCase)
        setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)))
      }
    } catch (error) {
      console.error('Erro ao remover clipe:', error)
    }
  }, [])

  const handleRemoveEvent = useCallback(async (caseId: string, eventId: string) => {
    try {
      await casesService.removeEvent(caseId, eventId, 'user-001', 'Usuário Atual')
      const updatedCase = await casesService.getById(caseId)
      if (updatedCase) {
        setSelectedCase(updatedCase)
        setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)))
      }
    } catch (error) {
      console.error('Erro ao remover evento:', error)
    }
  }, [])

  const handleExport = useCallback(async (caseId: string) => {
    try {
      const result = await casesService.exportCase(caseId)
      console.log('Export URL:', result.downloadUrl)
      // TODO: Download do arquivo
    } catch (error) {
      console.error('Erro ao exportar caso:', error)
    }
  }, [])

  const handleShare = useCallback(async (caseId: string) => {
    try {
      const result = await casesService.shareCase(caseId, ['email@example.com'], 'user-001', 'Usuário Atual')
      console.log('Share link:', result.shareLink)
      // TODO: Mostrar modal com link
    } catch (error) {
      console.error('Erro ao compartilhar caso:', error)
    }
  }, [])

  // Preparar câmeras para o player
  const cameraOptions = useMemo(() => {
    return cameras.map((c) => ({
      id: c.id,
      name: c.name,
      status: 'online' as const, // Mock - todas online
    }))
  }, [cameras])

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
      {/* Área principal (Player + Timeline) */}
      <div className="flex-1 flex flex-col min-w-0 gap-4">
        {/* Header com seletor de data */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Modo Investigação</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Player */}
        <div className="shrink-0">
          <InvestigationPlayer
            cameras={cameraOptions}
            selectedCameraId={selectedCameraId}
            onCameraChange={setSelectedCameraId}
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            isPlaying={isPlaying}
            onPlayPauseToggle={() => setIsPlaying((prev) => !prev)}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            isLoading={isLoadingTimeline}
            hasError={hasError}
            onRetry={() => {
              setHasError(false)
              // Trigger reload
            }}
          />
        </div>

        {/* Timeline */}
        <div className="shrink-0">
          {isLoadingTimeline ? (
            <div className="flex items-center justify-center h-32 bg-muted/30 rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : timelineData ? (
            <InvestigationTimeline
              segments={timelineData.segments}
              gaps={timelineData.gaps}
              events={events}
              activityHistogram={timelineData.activityHistogram}
              currentTime={currentTime}
              onTimeChange={setCurrentTime}
              selectedDate={formattedDate}
            />
          ) : (
            <div className="flex items-center justify-center h-32 bg-muted/30 rounded-lg text-muted-foreground">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Selecione uma câmera para ver a timeline
            </div>
          )}
        </div>

        {/* Atalhos de teclado */}
        <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">Space</kbd> Play/Pause</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">J</kbd> -10s</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">K</kbd> Pausar</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">L</kbd> +10s</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-muted">F</kbd> Fullscreen</span>
        </div>
      </div>

      {/* Painel lateral (Eventos + Caso) */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col border rounded-lg bg-card overflow-hidden">
        <Tabs defaultValue="events" className="flex flex-col h-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
            <TabsTrigger
              value="events"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Eventos
            </TabsTrigger>
            <TabsTrigger
              value="case"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Caso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="flex-1 m-0 overflow-hidden">
            <EventsPanel
              events={events}
              isLoading={isLoadingEvents}
              onGoToTime={handleGoToTime}
              onAddToCase={handleAddEventToCase}
            />
          </TabsContent>

          <TabsContent value="case" className="flex-1 m-0 overflow-hidden">
            <CasePanel
              cases={cases}
              selectedCase={selectedCase}
              onSelectCase={setSelectedCase}
              onCreateCase={handleCreateCase}
              onAddNote={handleAddNote}
              onRemoveClip={handleRemoveClip}
              onRemoveEvent={handleRemoveEvent}
              onExport={handleExport}
              onShare={handleShare}
              isLoading={isLoadingCases}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
