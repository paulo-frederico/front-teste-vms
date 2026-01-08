/**
 * Service para Casos do Módulo de Investigação
 * Utiliza localStorage para persistência
 */

import type {
  Case,
  CaseFilters,
  CreateCaseDTO,
  UpdateCaseDTO,
  AddClipToCaseDTO,
  AddEventToCaseDTO,
  AddNoteToCaseDTO,
  CaseClip,
  CaseEvent,
  CaseNote,
  CaseAuditEntry,
} from '@/modules/shared/types/investigation'
import { CaseStatus } from '@/modules/shared/types/investigation'
import { mockCases } from '@/mocks/cases.mock'
import { mockEvents } from '@/mocks/events.mock'

const STORAGE_KEY = 'vms_investigation_cases'

// Simular latência de rede
const simulateLatency = (min = 100, max = 300): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// Helper para gerar ID único
const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

class CasesService {
  private getCasesFromStorage(): Case[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erro ao carregar casos do localStorage:', error)
    }
    // Retornar mock se não houver dados salvos
    return [...mockCases]
  }

  private saveCasesToStorage(cases: Case[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases))
    } catch (error) {
      console.error('Erro ao salvar casos no localStorage:', error)
    }
  }

  /**
   * Listar casos com filtros
   */
  async list(filters?: CaseFilters): Promise<Case[]> {
    await simulateLatency()

    let cases = this.getCasesFromStorage()

    if (filters) {
      // Filtrar por status
      if (filters.status?.length) {
        cases = cases.filter((c) => filters.status!.includes(c.status))
      }

      // Filtrar por prioridade
      if (filters.priority?.length) {
        cases = cases.filter((c) => filters.priority!.includes(c.priority))
      }

      // Filtrar por assignee
      if (filters.assigneeId) {
        cases = cases.filter((c) => c.assignees.some((a) => a.id === filters.assigneeId))
      }

      // Filtrar por período
      if (filters.startDate) {
        cases = cases.filter((c) => new Date(c.createdAt) >= new Date(filters.startDate!))
      }
      if (filters.endDate) {
        cases = cases.filter((c) => new Date(c.createdAt) <= new Date(filters.endDate!))
      }

      // Filtrar por tags
      if (filters.tags?.length) {
        cases = cases.filter((c) => c.tags.some((tag) => filters.tags!.includes(tag)))
      }

      // Busca textual
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        cases = cases.filter(
          (c) =>
            c.title.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower) ||
            c.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        )
      }
    }

    // Ordenar por data de criação (mais recentes primeiro)
    cases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return cases
  }

  /**
   * Buscar caso por ID
   */
  async getById(id: string): Promise<Case | null> {
    await simulateLatency(50, 150)

    const cases = this.getCasesFromStorage()
    return cases.find((c) => c.id === id) || null
  }

  /**
   * Criar novo caso
   */
  async create(data: CreateCaseDTO, userId: string, userName: string): Promise<Case> {
    await simulateLatency(150, 300)

    const now = new Date().toISOString()
    const newCase: Case = {
      id: generateId('case'),
      title: data.title,
      description: data.description,
      status: CaseStatus.OPEN,
      priority: data.priority,
      tags: data.tags || [],
      incidentStartTime: data.incidentStartTime,
      incidentEndTime: data.incidentEndTime,
      clips: [],
      events: [],
      notes: [],
      createdBy: userId,
      createdByName: userName,
      assignees: [
        {
          id: userId,
          name: userName,
          email: `${userId}@unifique.com`,
          role: 'Criador',
          assignedAt: now,
          assignedBy: userId,
        },
      ],
      auditTrail: [
        {
          id: generateId('audit'),
          action: 'CREATED',
          description: 'Caso criado',
          performedBy: userId,
          performedByName: userName,
          performedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    }

    const cases = this.getCasesFromStorage()
    cases.unshift(newCase)
    this.saveCasesToStorage(cases)

    return newCase
  }

  /**
   * Atualizar caso
   */
  async update(id: string, data: UpdateCaseDTO, userId: string, userName: string): Promise<Case> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const index = cases.findIndex((c) => c.id === id)

    if (index === -1) {
      throw new Error('Caso não encontrado')
    }

    const now = new Date().toISOString()
    const oldCase = cases[index]
    const updatedCase: Case = {
      ...oldCase,
      ...data,
      updatedAt: now,
      auditTrail: [
        ...oldCase.auditTrail,
        {
          id: generateId('audit'),
          action: 'UPDATED',
          description: 'Caso atualizado',
          performedBy: userId,
          performedByName: userName,
          performedAt: now,
          metadata: data as unknown as Record<string, unknown>,
        },
      ],
    }

    // Se status mudou para CLOSED
    if (data.status === CaseStatus.CLOSED && oldCase.status !== CaseStatus.CLOSED) {
      updatedCase.closedAt = now
      updatedCase.closedBy = userId
      updatedCase.closedByName = userName
      updatedCase.auditTrail.push({
        id: generateId('audit'),
        action: 'STATUS_CHANGED',
        description: `Status alterado de ${oldCase.status} para ${data.status}`,
        performedBy: userId,
        performedByName: userName,
        performedAt: now,
      })
    }

    cases[index] = updatedCase
    this.saveCasesToStorage(cases)

    return updatedCase
  }

  /**
   * Adicionar clipe ao caso
   */
  async addClip(data: AddClipToCaseDTO, userId: string, userName: string): Promise<CaseClip> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const caseIndex = cases.findIndex((c) => c.id === data.caseId)

    if (caseIndex === -1) {
      throw new Error('Caso não encontrado')
    }

    const now = new Date().toISOString()
    const startDate = new Date(data.startTime)
    const endDate = new Date(data.endTime)
    const durationSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000)

    const newClip: CaseClip = {
      id: generateId('clip'),
      cameraId: data.cameraId,
      cameraName: `Câmera ${data.cameraId}`, // Simplificado
      startTime: data.startTime,
      endTime: data.endTime,
      durationSeconds,
      thumbnailUrl: '/api/placeholder/320/180',
      videoUrl: `/api/clips/${generateId('video')}`,
      notes: data.notes,
      addedBy: userId,
      addedByName: userName,
      addedAt: now,
    }

    cases[caseIndex].clips.push(newClip)
    cases[caseIndex].updatedAt = now
    cases[caseIndex].auditTrail.push({
      id: generateId('audit'),
      action: 'CLIP_ADDED',
      description: `Clipe adicionado: ${newClip.cameraName}`,
      performedBy: userId,
      performedByName: userName,
      performedAt: now,
    })

    this.saveCasesToStorage(cases)

    return newClip
  }

  /**
   * Adicionar evento ao caso
   */
  async addEvent(data: AddEventToCaseDTO, userId: string, userName: string): Promise<CaseEvent> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const caseIndex = cases.findIndex((c) => c.id === data.caseId)

    if (caseIndex === -1) {
      throw new Error('Caso não encontrado')
    }

    const event = mockEvents.find((e) => e.id === data.eventId)
    if (!event) {
      throw new Error('Evento não encontrado')
    }

    const now = new Date().toISOString()
    const newCaseEvent: CaseEvent = {
      id: generateId('case-evt'),
      eventId: data.eventId,
      event: { ...event, addedToCase: data.caseId },
      notes: data.notes,
      addedBy: userId,
      addedByName: userName,
      addedAt: now,
    }

    cases[caseIndex].events.push(newCaseEvent)
    cases[caseIndex].updatedAt = now
    cases[caseIndex].auditTrail.push({
      id: generateId('audit'),
      action: 'EVENT_ADDED',
      description: `Evento adicionado: ${event.type}`,
      performedBy: userId,
      performedByName: userName,
      performedAt: now,
    })

    this.saveCasesToStorage(cases)

    return newCaseEvent
  }

  /**
   * Adicionar nota ao caso
   */
  async addNote(data: AddNoteToCaseDTO, userId: string, userName: string): Promise<CaseNote> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const caseIndex = cases.findIndex((c) => c.id === data.caseId)

    if (caseIndex === -1) {
      throw new Error('Caso não encontrado')
    }

    const now = new Date().toISOString()
    const newNote: CaseNote = {
      id: generateId('note'),
      content: data.content,
      createdBy: userId,
      createdByName: userName,
      createdAt: now,
      updatedAt: now,
    }

    cases[caseIndex].notes.push(newNote)
    cases[caseIndex].updatedAt = now
    cases[caseIndex].auditTrail.push({
      id: generateId('audit'),
      action: 'NOTE_ADDED',
      description: 'Nota adicionada',
      performedBy: userId,
      performedByName: userName,
      performedAt: now,
    })

    this.saveCasesToStorage(cases)

    return newNote
  }

  /**
   * Remover clipe do caso
   */
  async removeClip(caseId: string, clipId: string, userId: string, userName: string): Promise<void> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const caseIndex = cases.findIndex((c) => c.id === caseId)

    if (caseIndex === -1) {
      throw new Error('Caso não encontrado')
    }

    const clipIndex = cases[caseIndex].clips.findIndex((c) => c.id === clipId)
    if (clipIndex === -1) {
      throw new Error('Clipe não encontrado')
    }

    const removedClip = cases[caseIndex].clips[clipIndex]
    cases[caseIndex].clips.splice(clipIndex, 1)
    cases[caseIndex].updatedAt = new Date().toISOString()
    cases[caseIndex].auditTrail.push({
      id: generateId('audit'),
      action: 'UPDATED',
      description: `Clipe removido: ${removedClip.cameraName}`,
      performedBy: userId,
      performedByName: userName,
      performedAt: new Date().toISOString(),
    })

    this.saveCasesToStorage(cases)
  }

  /**
   * Remover evento do caso
   */
  async removeEvent(caseId: string, caseEventId: string, userId: string, userName: string): Promise<void> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const caseIndex = cases.findIndex((c) => c.id === caseId)

    if (caseIndex === -1) {
      throw new Error('Caso não encontrado')
    }

    const eventIndex = cases[caseIndex].events.findIndex((e) => e.id === caseEventId)
    if (eventIndex === -1) {
      throw new Error('Evento não encontrado no caso')
    }

    cases[caseIndex].events.splice(eventIndex, 1)
    cases[caseIndex].updatedAt = new Date().toISOString()
    cases[caseIndex].auditTrail.push({
      id: generateId('audit'),
      action: 'UPDATED',
      description: 'Evento removido do caso',
      performedBy: userId,
      performedByName: userName,
      performedAt: new Date().toISOString(),
    })

    this.saveCasesToStorage(cases)
  }

  /**
   * Deletar caso
   */
  async delete(id: string): Promise<void> {
    await simulateLatency(100, 200)

    const cases = this.getCasesFromStorage()
    const index = cases.findIndex((c) => c.id === id)

    if (index === -1) {
      throw new Error('Caso não encontrado')
    }

    cases.splice(index, 1)
    this.saveCasesToStorage(cases)
  }

  /**
   * Exportar caso (stub)
   */
  async exportCase(id: string, format: 'pdf' | 'zip' = 'pdf'): Promise<{ downloadUrl: string }> {
    await simulateLatency(500, 1000)

    const caseData = await this.getById(id)
    if (!caseData) {
      throw new Error('Caso não encontrado')
    }

    // Simular exportação
    return {
      downloadUrl: `/api/cases/${id}/export.${format}`,
    }
  }

  /**
   * Compartilhar caso (stub)
   */
  async shareCase(id: string, emails: string[], userId: string, userName: string): Promise<{ shareLink: string }> {
    await simulateLatency(200, 400)

    const cases = this.getCasesFromStorage()
    const caseIndex = cases.findIndex((c) => c.id === id)

    if (caseIndex === -1) {
      throw new Error('Caso não encontrado')
    }

    cases[caseIndex].auditTrail.push({
      id: generateId('audit'),
      action: 'SHARED',
      description: `Caso compartilhado com: ${emails.join(', ')}`,
      performedBy: userId,
      performedByName: userName,
      performedAt: new Date().toISOString(),
    })

    this.saveCasesToStorage(cases)

    // Simular link de compartilhamento
    return {
      shareLink: `${window.location.origin}/shared/case/${id}/${generateId('token')}`,
    }
  }

  /**
   * Obter audit trail do caso
   */
  async getAuditTrail(id: string): Promise<CaseAuditEntry[]> {
    await simulateLatency(50, 150)

    const caseData = await this.getById(id)
    if (!caseData) {
      throw new Error('Caso não encontrado')
    }

    return caseData.auditTrail.sort(
      (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    )
  }

  /**
   * Resetar casos para mock (útil para desenvolvimento)
   */
  async resetToMock(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export const casesService = new CasesService()
