/**
 * Service para Gravações do Módulo de Investigação
 */

import type { RecordingSegment, RecordingGap, TimelineData, RecordingFilters } from '@/modules/shared/types/investigation'
import { mockTimelineData, generateTimelineData, mockRecordingSegments, camerasWithRecording } from '@/mocks/recordings.mock'

// Simular latência de rede
const simulateLatency = (min = 200, max = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

class RecordingsService {
  /**
   * Obter dados de timeline para uma câmera em uma data
   */
  async getTimelineData(cameraId: string, date: string): Promise<TimelineData> {
    await simulateLatency()

    // Verificar se já temos dados em cache
    if (mockTimelineData[cameraId] && mockTimelineData[cameraId].date === date) {
      return mockTimelineData[cameraId]
    }

    // Gerar novos dados para a data solicitada
    return generateTimelineData(cameraId, date)
  }

  /**
   * Listar segmentos de gravação com filtros
   */
  async listSegments(filters: RecordingFilters): Promise<RecordingSegment[]> {
    await simulateLatency()

    const timelineData = await this.getTimelineData(
      filters.cameraId,
      filters.startTime.split('T')[0]
    )

    let segments = timelineData.segments

    // Filtrar por período
    if (filters.startTime) {
      segments = segments.filter((s) => new Date(s.startTime) >= new Date(filters.startTime))
    }
    if (filters.endTime) {
      segments = segments.filter((s) => new Date(s.endTime) <= new Date(filters.endTime))
    }

    // Filtrar por eventos
    if (filters.hasEvents !== undefined) {
      segments = segments.filter((s) => s.hasEvents === filters.hasEvents)
    }

    // Filtrar por qualidade
    if (filters.quality?.length) {
      segments = segments.filter((s) => filters.quality!.includes(s.quality))
    }

    return segments
  }

  /**
   * Obter gaps de gravação para uma câmera em uma data
   */
  async getGaps(cameraId: string, date: string): Promise<RecordingGap[]> {
    await simulateLatency(100, 200)

    const timelineData = await this.getTimelineData(cameraId, date)
    return timelineData.gaps
  }

  /**
   * Obter histograma de atividade para uma câmera em uma data
   */
  async getActivityHistogram(cameraId: string, date: string): Promise<number[]> {
    await simulateLatency(100, 200)

    const timelineData = await this.getTimelineData(cameraId, date)
    return timelineData.activityHistogram
  }

  /**
   * Buscar segmento por ID
   */
  async getSegmentById(segmentId: string): Promise<RecordingSegment | null> {
    await simulateLatency(100, 200)

    const segment = mockRecordingSegments.find((s) => s.id === segmentId)
    return segment || null
  }

  /**
   * Obter URL de stream para um segmento
   */
  async getStreamUrl(segmentId: string): Promise<string> {
    await simulateLatency(100, 150)

    const segment = mockRecordingSegments.find((s) => s.id === segmentId)
    if (!segment) {
      throw new Error('Segmento não encontrado')
    }

    // Retornar URL mock
    return segment.streamUrl || `/api/recordings/stream/${segmentId}`
  }

  /**
   * Listar câmeras com gravação disponível
   */
  async getCamerasWithRecording(): Promise<Array<{ id: string; name: string }>> {
    await simulateLatency(100, 200)
    return camerasWithRecording
  }

  /**
   * Obter estatísticas de gravação
   */
  async getRecordingStats(cameraId: string, date: string): Promise<{
    totalDurationSeconds: number
    totalSizeBytes: number
    segmentCount: number
    gapCount: number
    averageFps: number
    hasAudioCount: number
    eventSegmentCount: number
  }> {
    await simulateLatency(100, 300)

    const timelineData = await this.getTimelineData(cameraId, date)

    const segments = timelineData.segments
    const totalDurationSeconds = segments.reduce((acc, s) => acc + s.durationSeconds, 0)
    const totalSizeBytes = segments.reduce((acc, s) => acc + s.sizeBytes, 0)
    const averageFps = segments.length > 0
      ? segments.reduce((acc, s) => acc + s.fps, 0) / segments.length
      : 0

    return {
      totalDurationSeconds,
      totalSizeBytes,
      segmentCount: segments.length,
      gapCount: timelineData.gaps.length,
      averageFps: Math.round(averageFps),
      hasAudioCount: segments.filter((s) => s.hasAudio).length,
      eventSegmentCount: segments.filter((s) => s.hasEvents).length,
    }
  }

  /**
   * Exportar gravação (stub)
   */
  async exportRecording(
    cameraId: string,
    _startTime: string,
    _endTime: string,
    format: 'mp4' | 'avi' | 'mkv' = 'mp4'
  ): Promise<{ jobId: string; estimatedTime: number; format: string }> {
    await simulateLatency(200, 400)

    // Simular criação de job de exportação
    // Em produção, startTime e endTime seriam usados para definir o período de exportação
    return {
      jobId: `export-${cameraId}-${Date.now()}`,
      estimatedTime: 120, // segundos
      format,
    }
  }

  /**
   * Verificar status de exportação (stub)
   */
  async getExportStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed'
    progress: number
    downloadUrl?: string
  }> {
    await simulateLatency(100, 200)

    // Simular status de exportação
    return {
      status: 'completed',
      progress: 100,
      downloadUrl: `/api/exports/${jobId}/download`,
    }
  }
}

export const recordingsService = new RecordingsService()
