import { AreaType, AreaStatus, type Area } from '@/modules/shared/types/area';

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

const MOCK_AREAS: Area[] = [
  {
    id: '1',
    name: 'Recepção Principal',
    description: 'Área de recepção e atendimento',
    type: AreaType.RECEPTION,
    status: AreaStatus.ACTIVE,
    tenantId: '1',
    tenantName: 'Empresa ABC Ltda',
    siteId: '1',
    siteName: 'Matriz São Paulo',
    floor: 'Térreo',
    capacity: 50,
    squareMeters: 120,
    totalCameras: 3,
    onlineCameras: 3,
    offlineCameras: 0,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    createdByName: 'Admin Master'
  }
];

class AreasService {
  async list(filters?: AreasFilters): Promise<Area[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    let areas = [...MOCK_AREAS];

    if (filters?.siteId) {
      areas = areas.filter(a => a.siteId === filters.siteId);
    }
    if (filters?.tenantId) {
      areas = areas.filter(a => a.tenantId === filters.tenantId);
    }
    if (filters?.type && filters.type !== 'ALL_TYPES') {
      areas = areas.filter(a => a.type === filters.type);
    }
    if (filters?.status && filters.status !== 'ALL') {
      areas = areas.filter(a => a.status === filters.status);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      areas = areas.filter(a =>
        a.name.toLowerCase().includes(searchLower) ||
        a.description?.toLowerCase().includes(searchLower)
      );
    }

    return areas;
  }

  async getById(id: string): Promise<Area> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const area = MOCK_AREAS.find(a => a.id === id);
    if (!area) throw new Error('Área não encontrada');
    return area;
  }

  async create(data: CreateAreaDTO): Promise<Area> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newArea: Area = {
      id: `area-${Date.now()}`,
      name: data.name,
      description: data.description,
      type: data.type,
      status: AreaStatus.ACTIVE,
      tenantId: '1',
      tenantName: 'Cliente Mock',
      siteId: data.siteId,
      siteName: 'Local Mock',
      floor: data.floor,
      capacity: data.capacity,
      squareMeters: data.squareMeters,
      totalCameras: 0,
      onlineCameras: 0,
      offlineCameras: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1',
      createdByName: 'Admin Master'
    };
    return newArea;
  }

  async update(id: string, data: UpdateAreaDTO): Promise<Area> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const area = await this.getById(id);
    return {
      ...area,
      ...data,
      updatedAt: new Date().toISOString()
    };
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const area = await this.getById(id);
    if (area.totalCameras > 0) {
      throw new Error(`Não é possível deletar esta área pois ela possui ${area.totalCameras} câmera(s) vinculada(s).`);
    }
  }
}

export const areasService = new AreasService();
