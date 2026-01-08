/**
 * Mock de Gravações para o Módulo de Investigação
 */

import type { RecordingSegment, RecordingGap, TimelineData } from '@/modules/shared/types/investigation'
import { RecordingStatus } from '@/modules/shared/types/investigation'

// Helper para gerar timestamps de hoje
const getToday = (): string => {
  return new Date().toISOString().split('T')[0]
}

// Helper para gerar timestamp de hora específica
const getTimestampForHour = (date: string, hour: number, minute = 0): string => {
  return `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`
}

// Helper para gerar ID único
const generateId = (prefix: string, cameraId: string, index: number): string => {
  return `${prefix}-${cameraId}-${String(index).padStart(3, '0')}`
}

// Gerar segmentos de gravação para uma câmera em um dia
const generateSegmentsForCamera = (cameraId: string, cameraName: string, date: string): RecordingSegment[] => {
  const segments: RecordingSegment[] = []
  let segmentIndex = 0

  // Simular gravação contínua com algumas interrupções
  // Padrão: gravação de 00:00 a 06:00 (gap), 06:30 a 12:00, 12:30 a 18:00, 18:30 a 23:59
  const recordingPeriods = [
    { start: 0, end: 6, hasGap: true },
    { start: 6, startMin: 30, end: 12, hasGap: false },
    { start: 12, startMin: 30, end: 18, hasGap: false },
    { start: 18, startMin: 30, end: 23, endMin: 59, hasGap: false },
  ]

  for (const period of recordingPeriods) {
    const startHour = period.start
    const startMin = period.startMin || 0
    const endHour = period.end
    const endMin = period.endMin || 0

    // Criar segmentos de 1 hora
    for (let hour = startHour; hour < endHour; hour++) {
      const segmentStartMin = hour === startHour ? startMin : 0
      const segmentEndMin = hour === endHour - 1 && endMin > 0 ? endMin : 59

      const startTime = getTimestampForHour(date, hour, segmentStartMin)
      const endTime = getTimestampForHour(date, hour, segmentEndMin)
      const durationSeconds = (segmentEndMin - segmentStartMin + 1) * 60

      // Alguns segmentos têm eventos
      const hasEvents = Math.random() > 0.6
      const eventCount = hasEvents ? Math.floor(Math.random() * 5) + 1 : 0

      segments.push({
        id: generateId('rec', cameraId, segmentIndex),
        cameraId,
        cameraName,
        startTime,
        endTime,
        durationSeconds,
        status: RecordingStatus.AVAILABLE,
        sizeBytes: durationSeconds * 250000, // ~250KB/s
        hasAudio: Math.random() > 0.3,
        quality: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
        fps: Math.random() > 0.5 ? 30 : 15,
        hasEvents,
        eventCount,
        streamUrl: `/api/recordings/${cameraId}/${date}/${hour}`,
        thumbnailUrl: '/api/placeholder/320/180',
      })

      segmentIndex++
    }
  }

  return segments
}

// Gerar gaps de gravação para uma câmera
const generateGapsForCamera = (cameraId: string, date: string): RecordingGap[] => {
  const gaps: RecordingGap[] = [
    {
      cameraId,
      startTime: getTimestampForHour(date, 6, 0),
      endTime: getTimestampForHour(date, 6, 30),
      reason: 'OFFLINE',
    },
    {
      cameraId,
      startTime: getTimestampForHour(date, 12, 0),
      endTime: getTimestampForHour(date, 12, 30),
      reason: 'DISABLED',
    },
    {
      cameraId,
      startTime: getTimestampForHour(date, 18, 0),
      endTime: getTimestampForHour(date, 18, 30),
      reason: 'ERROR',
    },
  ]

  return gaps
}

// Gerar histograma de atividade (24 horas)
const generateActivityHistogram = (): number[] => {
  // Simular padrão típico de atividade: baixa à noite, alta durante o dia
  return [
    5, 3, 2, 2, 3, 5,      // 00:00 - 05:59 (madrugada - baixa atividade)
    15, 35, 65, 80, 85, 90, // 06:00 - 11:59 (manhã - crescente)
    70, 85, 90, 88, 75, 60, // 12:00 - 17:59 (tarde - alta)
    45, 55, 50, 35, 20, 10, // 18:00 - 23:59 (noite - decrescente)
  ]
}

// Câmeras disponíveis para mock
const mockCamerasList = [
  { id: 'cam-0001', name: 'NOC - Hall Principal' },
  { id: 'cam-0003', name: 'Florianópolis - Recepção' },
  { id: 'cam-0005', name: 'Retail Sul - Entrada A' },
  { id: 'cam-0007', name: 'Logística Campinas - Docas' },
  { id: 'cam-0008', name: 'Logística Campinas - Portaria' },
  { id: 'cam-0011', name: 'Horizonte - Playground' },
  { id: 'cam-0012', name: 'Horizonte - Portaria Principal' },
  { id: 'cam-0015', name: 'Vila Olímpica - Lobby' },
  { id: 'cam-0016', name: 'Ferrovia - Pátio Leste' },
  { id: 'cam-0018', name: 'Ferrovia - COE Sala 4' },
]

// Gerar dados de timeline para todas as câmeras
export const generateTimelineData = (cameraId: string, date: string): TimelineData => {
  const camera = mockCamerasList.find((c) => c.id === cameraId) || {
    id: cameraId,
    name: `Câmera ${cameraId}`,
  }

  return {
    cameraId,
    date,
    segments: generateSegmentsForCamera(cameraId, camera.name, date),
    gaps: generateGapsForCamera(cameraId, date),
    events: [], // Eventos são carregados separadamente
    activityHistogram: generateActivityHistogram(),
  }
}

// Mock de dados de timeline para hoje
export const mockTimelineData: Record<string, TimelineData> = {}

// Inicializar dados para câmeras principais
const today = getToday()
for (const camera of mockCamerasList) {
  mockTimelineData[camera.id] = generateTimelineData(camera.id, today)
}

// Exportar segmentos de gravação flat
export const mockRecordingSegments: RecordingSegment[] = Object.values(mockTimelineData).flatMap(
  (timeline) => timeline.segments
)

// Exportar gaps de gravação flat
export const mockRecordingGaps: RecordingGap[] = Object.values(mockTimelineData).flatMap(
  (timeline) => timeline.gaps
)

// Exportar lista de câmeras com gravação
export const camerasWithRecording = mockCamerasList

// Labels para status de gravação
export const recordingStatusLabels: Record<RecordingStatus, string> = {
  [RecordingStatus.AVAILABLE]: 'Disponível',
  [RecordingStatus.RECORDING]: 'Gravando',
  [RecordingStatus.PROCESSING]: 'Processando',
  [RecordingStatus.CORRUPTED]: 'Corrompido',
  [RecordingStatus.DELETED]: 'Deletado',
}

// Cores para status de gravação
export const recordingStatusColors: Record<RecordingStatus, string> = {
  [RecordingStatus.AVAILABLE]: 'bg-green-100 text-green-800',
  [RecordingStatus.RECORDING]: 'bg-blue-100 text-blue-800',
  [RecordingStatus.PROCESSING]: 'bg-yellow-100 text-yellow-800',
  [RecordingStatus.CORRUPTED]: 'bg-red-100 text-red-800',
  [RecordingStatus.DELETED]: 'bg-gray-100 text-gray-800',
}

// Cores para gaps de gravação (razões)
export const gapReasonColors: Record<string, string> = {
  OFFLINE: '#EF4444',
  DISABLED: '#6B7280',
  STORAGE_FULL: '#F59E0B',
  ERROR: '#DC2626',
  UNKNOWN: '#9CA3AF',
}

// Labels para razões de gap
export const gapReasonLabels: Record<string, string> = {
  OFFLINE: 'Câmera Offline',
  DISABLED: 'Gravação Desabilitada',
  STORAGE_FULL: 'Armazenamento Cheio',
  ERROR: 'Erro de Gravação',
  UNKNOWN: 'Motivo Desconhecido',
}
