// Mock data para Acesso Temporário de Técnicos

export interface TemporaryTechnicianAccess {
  id: string
  technicianId: string
  technicianName: string
  technicianEmail: string
  cameraIds: string[] // Câmeras que o técnico pode acessar
  accessType: 'full' | 'limited' // Full = todas as câmeras, Limited = específicas
  accessLevel: 'view-only' | 'view-livestream' | 'full-control'
  startTime: string // ISO timestamp
  endTime: string // ISO timestamp
  duration: number // em minutos
  reason: string
  status: 'active' | 'expired' | 'revoked'
  createdAt: string
  createdBy: string
  revokedAt?: string
  notes?: string
}

export const MOCK_TEMPORARY_ACCESS: TemporaryTechnicianAccess[] = [
  {
    id: 'temp-access-001',
    technicianId: 'tech-001',
    technicianName: 'João Silva',
    technicianEmail: 'joao.silva@unifique.com',
    cameraIds: ['cam-001', 'cam-002', 'cam-003'],
    accessType: 'limited',
    accessLevel: 'view-livestream',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 240,
    reason: 'Instalação de novos cabos de rede',
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    notes: 'Técnico está no local realizando manutenção de infraestrutura'
  },
  {
    id: 'temp-access-002',
    technicianId: 'tech-002',
    technicianName: 'Maria Santos',
    technicianEmail: 'maria.santos@unifique.com',
    cameraIds: [],
    accessType: 'full',
    accessLevel: 'view-only',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    duration: 720,
    reason: 'Verificação de câmeras danificadas',
    status: 'expired',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    notes: 'Acesso expirado após verificação concluída'
  },
  {
    id: 'temp-access-003',
    technicianId: 'tech-003',
    technicianName: 'Carlos Mendes',
    technicianEmail: 'carlos.mendes@unifique.com',
    cameraIds: ['cam-005', 'cam-006'],
    accessType: 'limited',
    accessLevel: 'full-control',
    startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    duration: 300,
    reason: 'Reconfiguração de câmeras PTZ',
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    notes: 'Acesso com controle total para reposicionar câmeras'
  },
  {
    id: 'temp-access-004',
    technicianId: 'tech-004',
    technicianName: 'Ana Costa',
    technicianEmail: 'ana.costa@unifique.com',
    cameraIds: ['cam-001'],
    accessType: 'limited',
    accessLevel: 'view-livestream',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 120,
    reason: 'Teste de qualidade de imagem',
    status: 'revoked',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin@unifique.com',
    revokedAt: new Date(Date.now() - 2.9 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Revogado manualmente após conclusão anterior ao agendado'
  }
]
