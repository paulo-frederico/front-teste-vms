import type { Technician, TemporaryAccess } from '@/modules/shared/types/technician';
import { TechnicianStatus, TechnicianSpecialty } from '@/modules/shared/types/technician';

export interface CreateTechnicianDTO {
  name: string;
  email: string;
  phone: string;
  specialty: TechnicianSpecialty;
  region?: string;
  assignedTenants: string[];
}

export interface UpdateTechnicianDTO {
  name?: string;
  email?: string;
  phone?: string;
  specialty?: TechnicianSpecialty;
  region?: string;
  assignedTenants?: string[];
}

export interface TechnicianFilters {
  status?: TechnicianStatus;
  specialty?: TechnicianSpecialty;
  tenantId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TechnicianListResponse {
  technicians: Technician[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GrantAccessDTO {
  technicianId: string;
  tenantId: string;
  durationMinutes: number;
  reason: string;
  allowedActions: string[];
  cameraIds?: string[];
  siteIds?: string[];
}

// Mock data
const MOCK_TECHNICIANS: Technician[] = [
  {
    id: '1',
    name: 'Pedro Instalador',
    email: 'pedro@unifique.com',
    phone: '(11) 98888-7777',
    specialty: TechnicianSpecialty.INSTALLATION,
    region: 'São Paulo - Zona Sul',
    status: TechnicianStatus.ACTIVE,
    assignedTenants: ['1', '2'],
    stats: {
      totalInstallations: 45,
      totalMaintenances: 12,
      averageRating: 4.8,
      lastActivity: '2024-12-12T10:30:00Z'
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-12-01T14:20:00Z',
    createdBy: '1',
    createdByName: 'Admin Master'
  },
  {
    id: '2',
    name: 'Lucas Redes',
    email: 'lucas@unifique.com',
    phone: '(21) 97777-6666',
    specialty: TechnicianSpecialty.NETWORK,
    region: 'Rio de Janeiro',
    status: TechnicianStatus.ACTIVE,
    assignedTenants: ['1', '3'],
    stats: {
      totalInstallations: 28,
      totalMaintenances: 34,
      averageRating: 4.9,
      lastActivity: '2024-12-11T16:45:00Z'
    },
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-11-28T11:15:00Z',
    createdBy: '1',
    createdByName: 'Admin Master'
  },
  {
    id: '3',
    name: 'Ana Manutenção',
    email: 'ana@unifique.com',
    phone: '(31) 96666-5555',
    specialty: TechnicianSpecialty.MAINTENANCE,
    region: 'Belo Horizonte',
    status: TechnicianStatus.INACTIVE,
    assignedTenants: ['2'],
    stats: {
      totalInstallations: 15,
      totalMaintenances: 67,
      averageRating: 4.7,
      lastActivity: '2024-11-20T09:30:00Z'
    },
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-11-20T09:30:00Z',
    createdBy: '1',
    createdByName: 'Admin Master'
  }
];

const MOCK_TEMPORARY_ACCESSES: TemporaryAccess[] = [
  {
    id: '1',
    technicianId: '1',
    technicianName: 'Pedro Instalador',
    tenantId: '1',
    tenantName: 'Empresa ABC Ltda',
    grantedBy: '1',
    grantedByName: 'Admin Master',
    grantedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutos atrás
    expiresAt: new Date(Date.now() + 50 * 60 * 1000).toISOString(), // expira em 50 minutos
    reason: 'Instalação de 5 câmeras no setor administrativo',
    allowedActions: ['install_camera', 'test_connection', 'configure_onvif'],
    cameraIds: [],
    siteIds: ['site-1'],
    isActive: true
  }
];

class TechniciansService {
  async list(filters?: TechnicianFilters): Promise<TechnicianListResponse> {
    console.log('📋 [TechniciansService] Carregando lista de técnicos (FIXTURES)');
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredTechnicians = [...MOCK_TECHNICIANS];

    // Aplicar filtros
    if (filters?.status) {
      filteredTechnicians = filteredTechnicians.filter(t => t.status === filters.status);
    }

    if (filters?.specialty) {
      filteredTechnicians = filteredTechnicians.filter(t => 
        t.specialty === filters.specialty || t.specialty === 'ALL'
      );
    }

    if (filters?.tenantId) {
      filteredTechnicians = filteredTechnicians.filter(t => 
        t.assignedTenants.includes(filters.tenantId!)
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTechnicians = filteredTechnicians.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.email.toLowerCase().includes(searchLower) ||
        t.region?.toLowerCase().includes(searchLower)
      );
    }

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTechnicians = filteredTechnicians.slice(startIndex, endIndex);

    console.log('✅ [TechniciansService] Resposta:', paginatedTechnicians.length, 'técnicos');

    return {
      technicians: paginatedTechnicians,
      total: filteredTechnicians.length,
      page: page,
      totalPages: Math.ceil(filteredTechnicians.length / limit)
    };
  }

  async getById(id: string): Promise<Technician> {
    console.log('🔍 [TechniciansService] Buscando técnico:', id);
    await new Promise(resolve => setTimeout(resolve, 200));

    const technician = MOCK_TECHNICIANS.find(t => t.id === id);
    if (!technician) throw new Error(`Técnico ${id} não encontrado`);

    // Verificar se tem acesso temporário ativo
    const activeAccess = MOCK_TEMPORARY_ACCESSES.find(
      a => a.technicianId === id && a.isActive && new Date(a.expiresAt) > new Date()
    );

    return {
      ...technician,
      currentAccess: activeAccess
    };
  }

  async create(data: CreateTechnicianDTO): Promise<Technician> {
    console.log('➕ [TechniciansService] Simulando criação de técnico:', data.name);
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      region: data.region,
      status: TechnicianStatus.ACTIVE,
      assignedTenants: data.assignedTenants,
      stats: {
        totalInstallations: 0,
        totalMaintenances: 0,
        averageRating: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1',
      createdByName: 'Admin Master'
    };
  }

  async update(id: string, data: UpdateTechnicianDTO): Promise<Technician> {
    console.log('✏️ [TechniciansService] Simulando atualização de técnico:', id);
    await new Promise(resolve => setTimeout(resolve, 500));

    const technician = MOCK_TECHNICIANS.find(t => t.id === id);
    if (!technician) throw new Error(`Técnico ${id} não encontrado`);

    return { 
      ...technician, 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
  }

  async changeStatus(id: string, status: TechnicianStatus): Promise<Technician> {
    console.log('🔄 [TechniciansService] Simulando mudança de status:', id, '→', status);
    await new Promise(resolve => setTimeout(resolve, 300));

    const technician = MOCK_TECHNICIANS.find(t => t.id === id);
    if (!technician) throw new Error(`Técnico ${id} não encontrado`);

    return { 
      ...technician, 
      status, 
      updatedAt: new Date().toISOString() 
    };
  }

  async delete(id: string): Promise<void> {
    console.log('🗑️ [TechniciansService] Simulando remoção de técnico:', id);
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('✅ [TechniciansService] Técnico removido (simulado)');
  }

  /**
   * ⚠️ LGPD - Conceder acesso temporário ao técnico
   */
  async grantTemporaryAccess(data: GrantAccessDTO): Promise<TemporaryAccess> {
    console.log('🔑 [TechniciansService] Concedendo acesso temporário:', data);
    await new Promise(resolve => setTimeout(resolve, 500));

    const technician = MOCK_TECHNICIANS.find(t => t.id === data.technicianId);
    if (!technician) throw new Error('Técnico não encontrado');

    const grantedAt = new Date();
    const expiresAt = new Date(grantedAt.getTime() + data.durationMinutes * 60 * 1000);

    const access: TemporaryAccess = {
      id: Date.now().toString(),
      technicianId: data.technicianId,
      technicianName: technician.name,
      tenantId: data.tenantId,
      tenantName: 'Cliente Mock', // Em produção, buscar nome real
      grantedBy: '1',
      grantedByName: 'Admin Master',
      grantedAt: grantedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      reason: data.reason,
      allowedActions: data.allowedActions,
      cameraIds: data.cameraIds,
      siteIds: data.siteIds,
      isActive: true
    };

    console.log('✅ [TechniciansService] Acesso concedido até:', expiresAt.toLocaleString('pt-BR'));
    return access;
  }

  /**
   * ⚠️ LGPD - Revogar acesso temporário antes de expirar
   */
  async revokeTemporaryAccess(accessId: string): Promise<void> {
    console.log('🚫 [TechniciansService] Revogando acesso temporário:', accessId);
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('✅ [TechniciansService] Acesso revogado (simulado)');
  }

  /**
   * Listar acessos temporários ativos
   */
  async listActiveAccesses(): Promise<TemporaryAccess[]> {
    console.log('📋 [TechniciansService] Listando acessos temporários ativos');
    await new Promise(resolve => setTimeout(resolve, 200));

    const now = new Date();
    const activeAccesses = MOCK_TEMPORARY_ACCESSES.filter(
      a => a.isActive && new Date(a.expiresAt) > now && !a.revokedAt
    );

    console.log('✅ [TechniciansService]', activeAccesses.length, 'acessos ativos');
    return activeAccesses;
  }

  /**
   * Verificar se técnico tem acesso ativo a um tenant
   */
  async checkActiveAccess(technicianId: string, tenantId: string): Promise<TemporaryAccess | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const now = new Date();
    const access = MOCK_TEMPORARY_ACCESSES.find(
      a => a.technicianId === technicianId &&
           a.tenantId === tenantId &&
           a.isActive &&
           new Date(a.expiresAt) > now &&
           !a.revokedAt
    );

    return access || null;
  }
}

export const techniciansService = new TechniciansService();
