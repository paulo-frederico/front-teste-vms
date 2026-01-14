/**
 * Página de Playback/Gravações
 * Permite revisar gravações com timeline interativa
 */

import { useState, useCallback, useMemo } from 'react'
import { format, startOfDay, subDays, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Camera,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  AlertTriangle,
  Play,
  Bookmark,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { Timeline } from '../components/Timeline'
import { VideoPlayer } from '../components/VideoPlayer'
import { ExportClipDialog } from '../components/ExportClipDialog'
import type { RecordingSegment, TimelineEvent } from '../types'

// Mock data de câmeras
const mockCameras = [
  { id: 'cam-001', name: 'Entrada Principal', site: 'Prédio A', status: 'online' },
  { id: 'cam-002', name: 'Recepção', site: 'Prédio A', status: 'online' },
  { id: 'cam-003', name: 'Estacionamento', site: 'Área Externa', status: 'online' },
  { id: 'cam-004', name: 'Corredor 1º Andar', site: 'Prédio A', status: 'offline' },
  { id: 'cam-005', name: 'Sala de Reuniões', site: 'Prédio A', status: 'online' },
  { id: 'cam-006', name: 'Depósito', site: 'Prédio B', status: 'online' },
]

// Gerar segmentos de gravação mock para um dia
const generateMockSegments = (date: Date): RecordingSegment[] => {
  const segments: RecordingSegment[] = []
  const dayStart = startOfDay(date)

  // Gravação contínua das 00:00 às 06:00
  segments.push({
    id: 'seg-1',
    startTime: new Date(dayStart.getTime()),
    endTime: new Date(dayStart.getTime() + 6 * 60 * 60 * 1000),
    type: 'continuous',
    hasAudio: true,
  })

  // Movimento das 07:30 às 08:15
  segments.push({
    id: 'seg-2',
    startTime: new Date(dayStart.getTime() + 7.5 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 8.25 * 60 * 60 * 1000),
    type: 'motion',
    hasAudio: true,
  })

  // Gravação contínua das 08:00 às 12:00
  segments.push({
    id: 'seg-3',
    startTime: new Date(dayStart.getTime() + 8 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 12 * 60 * 60 * 1000),
    type: 'continuous',
    hasAudio: true,
  })

  // Alerta às 10:30
  segments.push({
    id: 'seg-4',
    startTime: new Date(dayStart.getTime() + 10.5 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 10.6 * 60 * 60 * 1000),
    type: 'alert',
    hasAudio: true,
  })

  // Gravação contínua das 13:00 às 18:00
  segments.push({
    id: 'seg-5',
    startTime: new Date(dayStart.getTime() + 13 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 18 * 60 * 60 * 1000),
    type: 'continuous',
    hasAudio: true,
  })

  // Movimento das 15:00 às 15:30
  segments.push({
    id: 'seg-6',
    startTime: new Date(dayStart.getTime() + 15 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 15.5 * 60 * 60 * 1000),
    type: 'motion',
    hasAudio: false,
  })

  // Gravação contínua das 19:00 às 23:59
  segments.push({
    id: 'seg-7',
    startTime: new Date(dayStart.getTime() + 19 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1),
    type: 'continuous',
    hasAudio: true,
  })

  return segments
}

// Gerar eventos mock
const generateMockEvents = (date: Date): TimelineEvent[] => {
  const dayStart = startOfDay(date)
  return [
    {
      id: 'evt-1',
      time: new Date(dayStart.getTime() + 8 * 60 * 60 * 1000),
      type: 'motion',
      label: 'Movimento detectado',
      severity: 'low',
    },
    {
      id: 'evt-2',
      time: new Date(dayStart.getTime() + 10.5 * 60 * 60 * 1000),
      type: 'alert',
      label: 'Alerta de intrusão',
      severity: 'high',
    },
    {
      id: 'evt-3',
      time: new Date(dayStart.getTime() + 14 * 60 * 60 * 1000),
      type: 'bookmark',
      label: 'Marcador do usuário',
    },
    {
      id: 'evt-4',
      time: new Date(dayStart.getTime() + 16 * 60 * 60 * 1000),
      type: 'motion',
      label: 'Movimento detectado',
      severity: 'medium',
    },
  ]
}

export function PlaybackPage() {
  // Estado de seleção
  const [selectedCamera, setSelectedCamera] = useState(mockCameras[0])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState('')

  // Estado de playback
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date()
    now.setHours(10, 30, 0, 0)
    return now
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Estado de UI
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [sidebarView, setSidebarView] = useState<'cameras' | 'events'>('cameras')

  // Dados mock
  const segments = useMemo(() => generateMockSegments(selectedDate), [selectedDate])
  const events = useMemo(() => generateMockEvents(selectedDate), [selectedDate])

  // Filtrar câmeras
  const filteredCameras = mockCameras.filter(cam =>
    cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cam.site.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handlers
  const handleTimeChange = useCallback((time: Date) => {
    setCurrentTime(time)
  }, [])

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(prev => new Date(prev.getTime() + seconds * 1000))
  }, [])

  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1))
  }

  const handleNextDay = () => {
    const tomorrow = addDays(selectedDate, 1)
    if (tomorrow <= new Date()) {
      setSelectedDate(tomorrow)
    }
  }

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleAddBookmark = useCallback(() => {
    console.log('Bookmark added at:', currentTime)
    // TODO: Implementar adição de bookmark
  }, [currentTime])

  const handleExport = useCallback((config: any) => {
    console.log('Export config:', config)
    // TODO: Implementar exportação real
  }, [])

  // Calcular estatísticas do dia
  const totalRecordingHours = segments.reduce((acc, seg) => {
    return acc + (seg.endTime.getTime() - seg.startTime.getTime()) / (1000 * 60 * 60)
  }, 0)

  const alertCount = events.filter(e => e.type === 'alert').length
  const motionCount = events.filter(e => e.type === 'motion').length

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-deep">Gravações</h1>
          <p className="text-muted-foreground">Revise gravações e exporte clips</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            disabled={addDays(selectedDate, 1) > new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sidebar */}
        <Card className="w-72 shrink-0 flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {sidebarView === 'cameras' ? 'Câmeras' : 'Eventos'}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={sidebarView === 'cameras' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSidebarView('cameras')}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  variant={sidebarView === 'events' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setSidebarView('events')}
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {sidebarView === 'cameras' && (
              <>
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar câmera..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
                <ScrollArea className="flex-1">
                  <div className="space-y-1">
                    {filteredCameras.map((camera) => (
                      <div
                        key={camera.id}
                        className={cn(
                          'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                          selectedCamera.id === camera.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted'
                        )}
                        onClick={() => setSelectedCamera(camera)}
                      >
                        <span className={cn(
                          'h-2 w-2 rounded-full shrink-0',
                          camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{camera.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{camera.site}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}

            {sidebarView === 'events' && (
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => setCurrentTime(event.time)}
                    >
                      <div className={cn(
                        'mt-0.5 p-1 rounded',
                        event.type === 'alert' && 'bg-red-100 text-red-600',
                        event.type === 'motion' && 'bg-blue-100 text-blue-600',
                        event.type === 'bookmark' && 'bg-yellow-100 text-yellow-600'
                      )}>
                        {event.type === 'alert' && <AlertTriangle className="h-3 w-3" />}
                        {event.type === 'motion' && <Play className="h-3 w-3" />}
                        {event.type === 'bookmark' && <Bookmark className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(event.time, 'HH:mm:ss')}
                        </p>
                      </div>
                      {event.severity && (
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-[10px] shrink-0',
                            event.severity === 'high' && 'text-red-600 border-red-200',
                            event.severity === 'medium' && 'text-yellow-600 border-yellow-200',
                            event.severity === 'low' && 'text-green-600 border-green-200'
                          )}
                        >
                          {event.severity === 'high' && 'Alta'}
                          {event.severity === 'medium' && 'Média'}
                          {event.severity === 'low' && 'Baixa'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Player e Timeline */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Stats do dia */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-bold">{totalRecordingHours.toFixed(1)}h</p>
                    <p className="text-xs text-muted-foreground">Gravadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-lg font-bold">{alertCount}</p>
                    <p className="text-xs text-muted-foreground">Alertas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-lg font-bold">{motionCount}</p>
                    <p className="text-xs text-muted-foreground">Movimentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Player */}
          <Card className="flex-1">
            <CardContent className="p-4 h-full flex flex-col">
              <VideoPlayer
                cameraName={selectedCamera.name}
                currentTime={currentTime}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                volume={volume}
                isMuted={isMuted}
                onPlayPause={handlePlayPause}
                onSpeedChange={setPlaybackSpeed}
                onVolumeChange={setVolume}
                onMuteToggle={() => setIsMuted(!isMuted)}
                onSeek={handleSeek}
                onExportClip={() => setShowExportDialog(true)}
                onAddBookmark={handleAddBookmark}
                onFullscreenToggle={handleFullscreenToggle}
                isFullscreen={isFullscreen}
                className="flex-1"
              />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="p-4">
              <Timeline
                date={selectedDate}
                segments={segments}
                events={events}
                currentTime={currentTime}
                onTimeChange={handleTimeChange}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportClipDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        cameraName={selectedCamera.name}
        startTime={currentTime}
        onExport={handleExport}
      />
    </div>
  )
}
