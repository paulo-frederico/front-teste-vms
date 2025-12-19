// Mock data para Sistema de Incidentes/Tickets

export interface Incident {
  id: string
  title: string
  description: string
  type: 'camera-offline' | 'ai-error' | 'performance' | 'security' | 'maintenance' | 'other'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'waiting-customer' | 'resolved' | 'closed'
  cameraId?: string
  cameraName?: string
  assignedTechnicianId?: string
  assignedTechnicianName?: string
  assignedTechnicianEmail?: string
  createdAt: string
  createdBy: string
  updatedAt: string
  resolvedAt?: string
  resolutionNotes?: string
  attachments: string[] // URLs de arquivos
  comments: IncidentComment[]
}

export interface IncidentComment {
  id: string
  authorId: string
  authorName: string
  authorEmail: string
  text: string
  createdAt: string
}

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'incident-001',
    title: 'Câmera de entrada offline há 2 horas',
    description:
      'A câmera PTZ da entrada perdeu conexão com o servidor e não está respondendo aos pings. Necessário diagnóstico de conectividade.',
    type: 'camera-offline',
    priority: 'critical',
    status: 'in-progress',
    cameraId: 'cam-001',
    cameraName: 'Câmera Entrada',
    assignedTechnicianId: 'tech-001',
    assignedTechnicianName: 'João Silva',
    assignedTechnicianEmail: 'joao.silva@unifique.com',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    attachments: [],
    comments: [
      {
        id: 'comment-001',
        authorId: 'tech-001',
        authorName: 'João Silva',
        authorEmail: 'joao.silva@unifique.com',
        text: 'Chegando no local em 15 minutos para diagnóstico',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'incident-002',
    title: 'Detecção de pessoa falhando em corredor',
    description:
      'A IA está falhando em detectar pessoas que passam no corredor com luz fraca. Taxa de detecção caiu 40%.',
    type: 'ai-error',
    priority: 'high',
    status: 'open',
    cameraId: 'cam-002',
    cameraName: 'Câmera Corredor',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    comments: []
  },
  {
    id: 'incident-003',
    title: 'Servidor de gravação com CPU acima de 95%',
    description:
      'Servidor primário atingindo 95% de utilização de CPU. Gravações podem ser perdidas se problema não for resolvido em 1 hora.',
    type: 'performance',
    priority: 'critical',
    status: 'waiting-customer',
    assignedTechnicianId: 'tech-003',
    assignedTechnicianName: 'Carlos Mendes',
    assignedTechnicianEmail: 'carlos.mendes@unifique.com',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    attachments: [],
    comments: [
      {
        id: 'comment-003',
        authorId: 'tech-003',
        authorName: 'Carlos Mendes',
        authorEmail: 'carlos.mendes@unifique.com',
        text: 'Aguardando autorização do cliente para reiniciar o serviço de gravação',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'incident-004',
    title: 'Tentativas de acesso não autorizadas detectadas',
    description:
      'Sistema detectou 47 tentativas de login com senhas inválidas na conta admin em 10 minutos. Conta temporariamente bloqueada.',
    type: 'security',
    priority: 'critical',
    status: 'resolved',
    assignedTechnicianId: 'tech-004',
    assignedTechnicianName: 'Ana Costa',
    assignedTechnicianEmail: 'ana.costa@unifique.com',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system@unifique.com',
    updatedAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionNotes:
      'Senha alterada, conta desbloqueada, firewall atualizado para bloquear IP suspeito',
    attachments: [],
    comments: [
      {
        id: 'comment-004',
        authorId: 'tech-004',
        authorName: 'Ana Costa',
        authorEmail: 'ana.costa@unifique.com',
        text: 'Incidente resolvido com sucesso. IP 203.0.113.45 bloqueado no firewall.',
        createdAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'incident-005',
    title: 'Manutenção preventiva agendada - Servidor 2',
    description:
      'Manutenção preventiva do Servidor 2 agendada para quinta-feira 22h. Necessário verificar gravações críticas antes disso.',
    type: 'maintenance',
    priority: 'medium',
    status: 'closed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    resolutionNotes: 'Manutenção concluída com sucesso. Sistema operacional atualizado.',
    attachments: [],
    comments: []
  }
]
