/**
 * Service para Eventos do Módulo de Investigação
 */

import type { Event, EventFilters } from '@/modules/shared/types/investigation'
import { mockEvents } from '@/mocks/events.mock'

// Simular latência de rede
const simulateLatency = (min = 200, max = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

class EventsService {
  /**
   * Listar eventos com filtros
   */
  async list(filters?: EventFilters): Promise<Event[]> {
    await simulateLatency()

    let events = [...mockEvents]

    if (filters) {
      // Filtrar por câmeras
      if (filters.cameraIds?.length) {
        events = events.filter((e) => filters.cameraIds!.includes(e.cameraId))
      }

      // Filtrar por sites
      if (filters.siteIds?.length) {
        events = events.filter((e) => e.siteId && filters.siteIds!.includes(e.siteId))
      }

      // Filtrar por áreas
      if (filters.areaIds?.length) {
        events = events.filter((e) => e.areaId && filters.areaIds!.includes(e.areaId))
      }

      // Filtrar por tipos
      if (filters.types?.length) {
        events = events.filter((e) => filters.types!.includes(e.type))
      }

      // Filtrar por severidades
      if (filters.severities?.length) {
        events = events.filter((e) => filters.severities!.includes(e.severity))
      }

      // Filtrar por período
      if (filters.startTime) {
        events = events.filter((e) => new Date(e.timestamp) >= new Date(filters.startTime!))
      }
      if (filters.endTime) {
        events = events.filter((e) => new Date(e.timestamp) <= new Date(filters.endTime!))
      }

      // Filtrar por acknowledged
      if (filters.acknowledged !== undefined) {
        events = events.filter((e) => e.acknowledged === filters.acknowledged)
      }

      // Filtrar por tags
      if (filters.tags?.length) {
        events = events.filter((e) => e.tags.some((tag) => filters.tags!.includes(tag)))
      }

      // Busca textual
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        events = events.filter(
          (e) =>
            e.cameraName.toLowerCase().includes(searchLower) ||
            e.siteName?.toLowerCase().includes(searchLower) ||
            e.areaName?.toLowerCase().includes(searchLower) ||
            e.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
            e.notes?.toLowerCase().includes(searchLower)
        )
      }
    }

    // Ordenar por timestamp decrescente (mais recentes primeiro)
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return events
  }

  /**
   * Buscar evento por ID
   */
  async getById(id: string): Promise<Event | null> {
    await simulateLatency(100, 200)

    const event = mockEvents.find((e) => e.id === id)
    return event || null
  }

  /**
   * Buscar eventos por câmera em um período
   */
  async getByCameraAndPeriod(cameraId: string, startTime: string, endTime: string): Promise<Event[]> {
    await simulateLatency()

    return mockEvents.filter(
      (e) =>
        e.cameraId === cameraId &&
        new Date(e.timestamp) >= new Date(startTime) &&
        new Date(e.timestamp) <= new Date(endTime)
    )
  }

  /**
   * Marcar evento como acknowledged
   */
  async acknowledge(id: string, userId: string): Promise<Event> {
    await simulateLatency(100, 200)

    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error('Evento não encontrado')
    }

    // Simular atualização
    const updatedEvent: Event = {
      ...event,
      acknowledged: true,
      acknowledgedBy: userId,
      acknowledgedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return updatedEvent
  }

  /**
   * Adicionar nota a um evento
   */
  async addNote(id: string, note: string): Promise<Event> {
    await simulateLatency(100, 200)

    const event = mockEvents.find((e) => e.id === id)
    if (!event) {
      throw new Error('Evento não encontrado')
    }

    const updatedEvent: Event = {
      ...event,
      notes: note,
      updatedAt: new Date().toISOString(),
    }

    return updatedEvent
  }

  /**
   * Obter estatísticas de eventos
   */
  async getStats(filters?: EventFilters): Promise<{
    total: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
    acknowledged: number
    pending: number
  }> {
    await simulateLatency(100, 300)

    const events = await this.list(filters)

    const byType: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}

    for (const event of events) {
      byType[event.type] = (byType[event.type] || 0) + 1
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1
    }

    return {
      total: events.length,
      byType,
      bySeverity,
      acknowledged: events.filter((e) => e.acknowledged).length,
      pending: events.filter((e) => !e.acknowledged).length,
    }
  }
}

export const eventsService = new EventsService()
