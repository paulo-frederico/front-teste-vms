/**
 * Mock de Casos para o Módulo de Investigação
 */

import type { Case, CaseClip, CaseEvent, CaseNote, CaseAuditEntry } from '@/modules/shared/types/investigation'
import { CaseStatus, CasePriority } from '@/modules/shared/types/investigation'
import { mockEvents } from './events.mock'

// Helper para gerar timestamps
const generateTimestamp = (daysAgo: number, hoursOffset = 0): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(date.getHours() + hoursOffset)
  return date.toISOString()
}

// Mock de clipes
const mockClips: CaseClip[] = [
  {
    id: 'clip-0001',
    cameraId: 'cam-0001',
    cameraName: 'NOC - Hall Principal',
    startTime: generateTimestamp(2, -2),
    endTime: generateTimestamp(2, -1),
    durationSeconds: 3600,
    thumbnailUrl: '/api/placeholder/320/180',
    videoUrl: '/api/clips/clip-0001',
    notes: 'Clipe capturado durante incidente de intrusão',
    addedBy: 'user-001',
    addedByName: 'João Silva',
    addedAt: generateTimestamp(2),
  },
  {
    id: 'clip-0002',
    cameraId: 'cam-0005',
    cameraName: 'Retail Sul - Entrada A',
    startTime: generateTimestamp(2, -3),
    endTime: generateTimestamp(2, -2),
    durationSeconds: 3600,
    thumbnailUrl: '/api/placeholder/320/180',
    videoUrl: '/api/clips/clip-0002',
    notes: 'Veículo suspeito na entrada',
    addedBy: 'user-002',
    addedByName: 'Maria Santos',
    addedAt: generateTimestamp(1, -12),
  },
]

// Mock de eventos adicionados aos casos
const mockCaseEvents: CaseEvent[] = [
  {
    id: 'case-evt-0001',
    eventId: 'evt-0004',
    event: mockEvents.find((e) => e.id === 'evt-0004') || mockEvents[0],
    notes: 'Evento principal do incidente',
    addedBy: 'user-001',
    addedByName: 'João Silva',
    addedAt: generateTimestamp(2),
  },
  {
    id: 'case-evt-0002',
    eventId: 'evt-0016',
    event: mockEvents.find((e) => e.id === 'evt-0016') || mockEvents[0],
    notes: 'Marcação manual relacionada',
    addedBy: 'user-001',
    addedByName: 'João Silva',
    addedAt: generateTimestamp(1, -10),
  },
]

// Mock de notas
const mockNotes: CaseNote[] = [
  {
    id: 'note-0001',
    content: 'Incidente reportado pelo segurança do turno noturno. Necessário verificar acesso autorizado.',
    createdBy: 'user-001',
    createdByName: 'João Silva',
    createdAt: generateTimestamp(2),
    updatedAt: generateTimestamp(2),
  },
  {
    id: 'note-0002',
    content: 'Verificado com RH - técnico tinha autorização temporária. Caso pode ser fechado como falso positivo.',
    createdBy: 'user-002',
    createdByName: 'Maria Santos',
    createdAt: generateTimestamp(1, -5),
    updatedAt: generateTimestamp(1, -5),
  },
]

// Mock de audit trail
const mockAuditTrail: CaseAuditEntry[] = [
  {
    id: 'audit-0001',
    action: 'CREATED',
    description: 'Caso criado',
    performedBy: 'user-001',
    performedByName: 'João Silva',
    performedAt: generateTimestamp(2),
  },
  {
    id: 'audit-0002',
    action: 'CLIP_ADDED',
    description: 'Clipe adicionado: NOC - Hall Principal',
    performedBy: 'user-001',
    performedByName: 'João Silva',
    performedAt: generateTimestamp(2),
  },
  {
    id: 'audit-0003',
    action: 'EVENT_ADDED',
    description: 'Evento adicionado: Intrusão detectada',
    performedBy: 'user-001',
    performedByName: 'João Silva',
    performedAt: generateTimestamp(2),
  },
  {
    id: 'audit-0004',
    action: 'NOTE_ADDED',
    description: 'Nota adicionada',
    performedBy: 'user-001',
    performedByName: 'João Silva',
    performedAt: generateTimestamp(2),
  },
  {
    id: 'audit-0005',
    action: 'STATUS_CHANGED',
    description: 'Status alterado de OPEN para IN_PROGRESS',
    performedBy: 'user-002',
    performedByName: 'Maria Santos',
    performedAt: generateTimestamp(1, -10),
  },
  {
    id: 'audit-0006',
    action: 'CLIP_ADDED',
    description: 'Clipe adicionado: Retail Sul - Entrada A',
    performedBy: 'user-002',
    performedByName: 'Maria Santos',
    performedAt: generateTimestamp(1, -12),
  },
  {
    id: 'audit-0007',
    action: 'NOTE_ADDED',
    description: 'Nota adicionada',
    performedBy: 'user-002',
    performedByName: 'Maria Santos',
    performedAt: generateTimestamp(1, -5),
  },
]

// Mock de casos
export const mockCases: Case[] = [
  {
    id: 'case-0001',
    title: 'Intrusão detectada no NOC',
    description: 'Alerta de intrusão disparado na área restrita do NOC durante a madrugada. Necessário verificar se houve acesso não autorizado.',
    status: CaseStatus.IN_PROGRESS,
    priority: CasePriority.HIGH,
    tags: ['Intrusão', 'NOC', 'Segurança'],
    incidentStartTime: generateTimestamp(2, -2),
    incidentEndTime: generateTimestamp(2, -1),
    clips: mockClips,
    events: mockCaseEvents,
    notes: mockNotes,
    createdBy: 'user-001',
    createdByName: 'João Silva',
    assignees: [
      {
        id: 'user-001',
        name: 'João Silva',
        email: 'joao.silva@unifique.com',
        role: 'Analista de Segurança',
        assignedAt: generateTimestamp(2),
        assignedBy: 'user-001',
      },
      {
        id: 'user-002',
        name: 'Maria Santos',
        email: 'maria.santos@unifique.com',
        role: 'Supervisora de Segurança',
        assignedAt: generateTimestamp(1, -10),
        assignedBy: 'user-001',
      },
    ],
    auditTrail: mockAuditTrail,
    createdAt: generateTimestamp(2),
    updatedAt: generateTimestamp(1, -5),
  },
  {
    id: 'case-0002',
    title: 'Veículo suspeito no estacionamento',
    description: 'Veículo não identificado permaneceu no estacionamento por mais de 4 horas fora do horário comercial.',
    status: CaseStatus.OPEN,
    priority: CasePriority.MEDIUM,
    tags: ['Veículo', 'Estacionamento', 'Suspeito'],
    incidentStartTime: generateTimestamp(1, -8),
    incidentEndTime: generateTimestamp(1, -4),
    clips: [],
    events: [],
    notes: [
      {
        id: 'note-0003',
        content: 'Verificar com equipe de manutenção se havia serviço agendado.',
        createdBy: 'user-003',
        createdByName: 'Carlos Oliveira',
        createdAt: generateTimestamp(1, -2),
        updatedAt: generateTimestamp(1, -2),
      },
    ],
    createdBy: 'user-003',
    createdByName: 'Carlos Oliveira',
    assignees: [
      {
        id: 'user-003',
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@unifique.com',
        role: 'Operador de CFTV',
        assignedAt: generateTimestamp(1, -2),
        assignedBy: 'user-003',
      },
    ],
    auditTrail: [
      {
        id: 'audit-0008',
        action: 'CREATED',
        description: 'Caso criado',
        performedBy: 'user-003',
        performedByName: 'Carlos Oliveira',
        performedAt: generateTimestamp(1, -2),
      },
      {
        id: 'audit-0009',
        action: 'NOTE_ADDED',
        description: 'Nota adicionada',
        performedBy: 'user-003',
        performedByName: 'Carlos Oliveira',
        performedAt: generateTimestamp(1, -2),
      },
    ],
    createdAt: generateTimestamp(1, -2),
    updatedAt: generateTimestamp(1, -2),
  },
  {
    id: 'case-0003',
    title: 'Falha de conexão recorrente - Docas',
    description: 'Câmera das docas apresentando falhas de conexão frequentes. Possível problema de infraestrutura.',
    status: CaseStatus.CLOSED,
    priority: CasePriority.LOW,
    tags: ['Sistema', 'Conexão', 'Infraestrutura'],
    incidentStartTime: generateTimestamp(5),
    incidentEndTime: generateTimestamp(3),
    clips: [],
    events: [],
    notes: [
      {
        id: 'note-0004',
        content: 'Equipe de TI identificou problema no switch de rede. Substituição realizada.',
        createdBy: 'user-004',
        createdByName: 'Ana Costa',
        createdAt: generateTimestamp(3),
        updatedAt: generateTimestamp(3),
      },
    ],
    createdBy: 'user-001',
    createdByName: 'João Silva',
    assignees: [
      {
        id: 'user-004',
        name: 'Ana Costa',
        email: 'ana.costa@unifique.com',
        role: 'Técnica de Suporte',
        assignedAt: generateTimestamp(5),
        assignedBy: 'user-001',
      },
    ],
    auditTrail: [
      {
        id: 'audit-0010',
        action: 'CREATED',
        description: 'Caso criado',
        performedBy: 'user-001',
        performedByName: 'João Silva',
        performedAt: generateTimestamp(5),
      },
      {
        id: 'audit-0011',
        action: 'STATUS_CHANGED',
        description: 'Status alterado de OPEN para IN_PROGRESS',
        performedBy: 'user-004',
        performedByName: 'Ana Costa',
        performedAt: generateTimestamp(4),
      },
      {
        id: 'audit-0012',
        action: 'NOTE_ADDED',
        description: 'Nota adicionada',
        performedBy: 'user-004',
        performedByName: 'Ana Costa',
        performedAt: generateTimestamp(3),
      },
      {
        id: 'audit-0013',
        action: 'STATUS_CHANGED',
        description: 'Status alterado de IN_PROGRESS para CLOSED',
        performedBy: 'user-004',
        performedByName: 'Ana Costa',
        performedAt: generateTimestamp(3),
      },
    ],
    createdAt: generateTimestamp(5),
    updatedAt: generateTimestamp(3),
    closedAt: generateTimestamp(3),
    closedBy: 'user-004',
    closedByName: 'Ana Costa',
  },
]

// Labels para status de caso
export const caseStatusLabels: Record<CaseStatus, string> = {
  [CaseStatus.OPEN]: 'Aberto',
  [CaseStatus.IN_PROGRESS]: 'Em Andamento',
  [CaseStatus.PENDING_REVIEW]: 'Aguardando Revisão',
  [CaseStatus.CLOSED]: 'Fechado',
  [CaseStatus.ARCHIVED]: 'Arquivado',
}

// Cores para status de caso
export const caseStatusColors: Record<CaseStatus, string> = {
  [CaseStatus.OPEN]: 'bg-blue-100 text-blue-800',
  [CaseStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [CaseStatus.PENDING_REVIEW]: 'bg-purple-100 text-purple-800',
  [CaseStatus.CLOSED]: 'bg-green-100 text-green-800',
  [CaseStatus.ARCHIVED]: 'bg-gray-100 text-gray-800',
}

// Labels para prioridade de caso
export const casePriorityLabels: Record<CasePriority, string> = {
  [CasePriority.LOW]: 'Baixa',
  [CasePriority.MEDIUM]: 'Média',
  [CasePriority.HIGH]: 'Alta',
  [CasePriority.URGENT]: 'Urgente',
}

// Cores para prioridade de caso
export const casePriorityColors: Record<CasePriority, string> = {
  [CasePriority.LOW]: 'bg-gray-100 text-gray-800',
  [CasePriority.MEDIUM]: 'bg-blue-100 text-blue-800',
  [CasePriority.HIGH]: 'bg-orange-100 text-orange-800',
  [CasePriority.URGENT]: 'bg-red-100 text-red-800',
}

// Labels para ações de auditoria
export const auditActionLabels: Record<string, string> = {
  CREATED: 'Criado',
  UPDATED: 'Atualizado',
  CLIP_ADDED: 'Clipe Adicionado',
  EVENT_ADDED: 'Evento Adicionado',
  NOTE_ADDED: 'Nota Adicionada',
  STATUS_CHANGED: 'Status Alterado',
  EXPORTED: 'Exportado',
  SHARED: 'Compartilhado',
}
