import type { AdminUserRow } from '@/modules/admin/users/mockUsers'
import { SystemRole } from '@/modules/shared/types/auth'

export const mockAdminUsers: AdminUserRow[] = [
  {
    id: 'usr-001',
    name: 'Laura Hoffmann',
    email: 'laura.hoffmann@unifique.com.br',
    role: SystemRole.ADMIN_MASTER,
    status: 'active',
    tenantId: 'tnt-001',
    tenantName: 'Unifique Headquarters',
    createdAt: '2022-04-10',
    lastAccessAt: '2025-12-07 07:55'
  },
  {
    id: 'usr-002',
    name: 'Eduardo Farias',
    email: 'eduardo.farias@unifique.com.br',
    role: SystemRole.ADMIN,
    status: 'active',
    tenantId: 'tnt-001',
    tenantName: 'Unifique Headquarters',
    createdAt: '2023-06-15',
    lastAccessAt: '2025-12-06 16:05'
  },
  {
    id: 'usr-003',
    name: 'Letícia Gomes',
    email: 'leticia.gomes@unifique.com.br',
    role: SystemRole.CLIENT_MASTER,
    status: 'active',
    tenantId: 'tnt-001',
    tenantName: 'Unifique Headquarters',
    createdAt: '2023-01-18',
    lastAccessAt: '2025-12-06 19:30'
  },
  {
    id: 'usr-004',
    name: 'Rafael Dias',
    email: 'rafael.dias@retailpark.com',
    role: SystemRole.CLIENT_MASTER,
    status: 'active',
    tenantId: 'tnt-002',
    tenantName: 'Retail Park Brasil',
    createdAt: '2023-09-05',
    lastAccessAt: '2025-12-05 18:10'
  },
  {
    id: 'usr-005',
    name: 'Operação Retail Park',
    email: 'operacao@retailpark.com',
    role: SystemRole.TECHNICIAN,
    status: 'suspended',
    tenantId: 'tnt-002',
    tenantName: 'Retail Park Brasil',
    createdAt: '2024-07-22',
    lastAccessAt: '2025-10-02 08:45'
  },
  {
    id: 'usr-006',
    name: 'Beatriz Andrade',
    email: 'beatriz.andrade@vidaplena.org',
    role: SystemRole.MANAGER,
    status: 'active',
    tenantId: 'tnt-003',
    tenantName: 'Hospital Vida Plena',
    createdAt: '2024-01-11',
    lastAccessAt: '2025-12-01 07:10'
  },
  {
    id: 'usr-007',
    name: 'Daniel Souza',
    email: 'daniel.souza@colegiohorizonte.edu',
    role: SystemRole.VIEWER,
    status: 'invited',
    tenantId: 'tnt-004',
    tenantName: 'Colégio Horizonte',
    createdAt: '2025-10-01'
  },
  {
    id: 'usr-008',
    name: 'Equipe Campo Florianópolis',
    email: 'campo.fl@unifique.com.br',
    role: SystemRole.TECHNICIAN,
    status: 'active',
    tenantId: 'tnt-001',
    tenantName: 'Unifique Headquarters',
    createdAt: '2024-04-02',
    lastAccessAt: '2025-12-03 12:22'
  },
  {
    id: 'usr-009',
    name: 'Lívia Costa',
    email: 'livia.costa@retailpark.com',
    role: SystemRole.VIEWER,
    status: 'pending',
    tenantId: 'tnt-002',
    tenantName: 'Retail Park Brasil',
    createdAt: '2025-11-14'
  },
  {
    id: 'usr-010',
    name: 'Patrícia Nunes',
    email: 'patricia.nunes@vidaplena.org',
    role: SystemRole.CLIENT_MASTER,
    status: 'active',
    tenantId: 'tnt-003',
    tenantName: 'Hospital Vida Plena',
    createdAt: '2021-01-19',
    lastAccessAt: '2025-12-08 09:10'
  }
]
