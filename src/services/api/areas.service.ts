import type { Area } from '@/modules/shared/types/area';
import { AreaType, AreaStatus } from '@/modules/shared/types/area';

// DTOs
export interface CreateAreaDTO {
  name: string;
  description?: string;
  type: AreaType;
  siteId: string;
  floor?: string;
  capacity?: number;
  squareMeters?: number;
}

export interface UpdateAreaDTO extends Partial<CreateAreaDTO> {
  status?: AreaStatus;
}

export interface AreasFilters {
  siteId?: string;
  tenantId?: string;
  type?: AreaType | 'ALL_TYPES';
  status?: AreaStatus | 'ALL';
  search?: string;
}

// Mock Data
export const MOCK_AREAS: Area[] = [
  {
    id: 'area-001',
    name: 'Recepção Principal',
    description: 'Área de recepção e atendimento',
    type: AreaType.RECEPTION,
    status: AreaStatus.ACTIVE,
    siteId: 'site-001',
    siteName: 'Matriz São Paulo',
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    floor: 'Térreo',
    capacity: 20,
    squareMeters: 50,
    totalCameras: 2,
    onlineCameras: 2,
    offlineCameras: 0,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
  {
    id: 'area-002',
    name: 'Estacionamento',
    description: 'Estacionamento coberto',
    type: AreaType.PARKING,
    status: AreaStatus.ACTIVE,
    siteId: 'site-001',
    siteName: 'Matriz São Paulo',
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    floor: 'Subsolo',
    capacity: 100,
    squareMeters: 500,
    totalCameras: 4,
    onlineCameras: 4,
    offlineCameras: 0,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
  {
    id: 'area-003',
    name: 'Produção - Linha 1',
    description: 'Linha de produção principal',
    type: AreaType.PRODUCTION,
    status: AreaStatus.ACTIVE,
    siteId: 'site-001',
    siteName: 'Matriz São Paulo',
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    floor: '2º Andar',
    capacity: 150,
    squareMeters: 800,
    totalCameras: 6,
    onlineCameras: 5,
    offlineCameras: 1,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
  {
    id: 'area-004',
    name: 'Recepção (RJ)',
    description: 'Área de recepção filial Rio',
    type: AreaType.RECEPTION,
    status: AreaStatus.ACTIVE,
    siteId: 'site-002',
    siteName: 'Filial Rio de Janeiro',
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    floor: 'Térreo',
    capacity: 15,
    squareMeters: 40,
    totalCameras: 1,
    onlineCameras: 1,
    offlineCameras: 0,
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
  {
    id: 'area-005',
    name: 'Almoxarifado',
    description: 'Área de armazenagem',
    type: AreaType.WAREHOUSE,
    status: AreaStatus.ACTIVE,
    siteId: 'site-003',
    siteName: 'Galpão Logística',
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    floor: 'Térreo',
    capacity: 200,
    squareMeters: 1000,
    totalCameras: 7,
    onlineCameras: 7,
    offlineCameras: 0,
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2024-03-10').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
];

class AreasService {
  private areas: Area[] = [...MOCK_AREAS];
  private nextId = 6;

  async list(filters?: AreasFilters): Promise<Area[]> {
    console.log('📋 [AreasService] Listando áreas...', filters);
    
    await this.simulateDelay();

    let result = [...this.areas];

    if (filters?.siteId) {
      result = result.filter((area) => area.siteId === filters.siteId);
    }

    if (filters?.tenantId) {
      result = result.filter((area) => area.tenantId === filters.tenantId);
    }

    if (filters?.type && filters.type !== 'ALL_TYPES') {
      result = result.filter((area) => area.type === filters.type);
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((area) => area.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (area) =>
          area.name.toLowerCase().includes(searchLower) ||
          area.description?.toLowerCase().includes(searchLower) ||
          area.type.toLowerCase().includes(searchLower)
      );
    }

    console.log(`📋 [AreasService] ${result.length} áreas encontradas`);
    return result;
  }

  async getById(id: string): Promise<Area> {
    console.log(`🔍 [AreasService] Buscando área com ID: ${id}`);
    
    await this.simulateDelay();

    const area = this.areas.find((a) => a.id === id);
    if (!area) {
      console.error(`❌ [AreasService] Área não encontrada: ${id}`);
      throw new Error(`Área com ID ${id} não encontrada`);
    }

    console.log(`✅ [AreasService] Área encontrada: ${area.name}`);
    return area;
  }

  async create(data: CreateAreaDTO): Promise<Area> {
    console.log('➕ [AreasService] Criando nova área...', data.name);
    
    await this.simulateDelay();

    const newArea: Area = {
      id: `area-${String(this.nextId++).padStart(3, '0')}`,
      ...data,
      tenantName: 'Unifique',
      siteName: 'Site Padrão',
      status: AreaStatus.ACTIVE,
      tenantId: '', // Será preenchido pelo hook baseado no contexto
      totalCameras: 0,
      onlineCameras: 0,
      offlineCameras: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin-001',
      createdByName: 'Sistema',
    };

    this.areas.push(newArea);
    console.log(`✅ [AreasService] Área criada com ID: ${newArea.id}`);
    return newArea;
  }

  async update(id: string, data: UpdateAreaDTO): Promise<Area> {
    console.log(`✏️ [AreasService] Atualizando área: ${id}`, data);
    
    await this.simulateDelay();

    const areaIndex = this.areas.findIndex((a) => a.id === id);
    if (areaIndex === -1) {
      console.error(`❌ [AreasService] Área não encontrada para atualização: ${id}`);
      throw new Error(`Área com ID ${id} não encontrada`);
    }

    const updatedArea: Area = {
      ...this.areas[areaIndex],
      ...data,
      id, // Garante que ID não é alterado
      updatedAt: new Date().toISOString(),
    };

    this.areas[areaIndex] = updatedArea;
    console.log(`✅ [AreasService] Área atualizada: ${updatedArea.name}`);
    return updatedArea;
  }

  async delete(id: string): Promise<void> {
    console.log(`🗑️ [AreasService] Deletando área: ${id}`);
    
    await this.simulateDelay();

    const area = this.areas.find((a) => a.id === id);
    if (!area) {
      console.error(`❌ [AreasService] Área não encontrada para deleção: ${id}`);
      throw new Error(`Área com ID ${id} não encontrada`);
    }

    // Validar dependências
    if (area.totalCameras > 0) {
      const errorMsg = `Não é possível deletar esta área pois ela possui ${area.totalCameras} câmera(s) vinculada(s). Remova as câmeras antes de deletar a área.`;
      console.error(`❌ [AreasService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    this.areas = this.areas.filter((a) => a.id !== id);
    console.log(`✅ [AreasService] Área deletada: ${area.name}`);
  }

  private simulateDelay(): Promise<void> {
    const delay = Math.random() * 500 + 300; // 300-800ms
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export const areasService = new AreasService();
