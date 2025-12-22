import { SiteType, SiteStatus, type Site, type Address } from '@/modules/shared/types/site';

export { SiteType };

export interface CreateSiteDTO {
  name: string;
  description?: string;
  type: SiteType;
  tenantId: string;
  address: Address;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateSiteDTO extends Partial<CreateSiteDTO> {
  status?: SiteStatus;
}

export interface SitesFilters {
  tenantId?: string;
  type?: SiteType | 'ALL_TYPES';
  status?: SiteStatus | 'ALL';
  search?: string;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const MOCK_SITES: Site[] = [
  {
    id: '1',
    name: 'Matriz São Paulo',
    description: 'Sede principal da empresa',
    type: SiteType.HEADQUARTERS,
    status: SiteStatus.ACTIVE,
    tenantId: '1',
    tenantName: 'Empresa ABC Ltda',
    address: {
      zipCode: '01310-100',
      street: 'Avenida Paulista',
      number: '1578',
      complement: 'Andar 10',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil'
    },
    contactName: 'João Silva',
    contactPhone: '(11) 98765-4321',
    contactEmail: 'joao.silva@empresaabc.com.br',
    totalAreas: 5,
    totalCameras: 12,
    onlineCameras: 10,
    offlineCameras: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    createdByName: 'Admin Master'
  }
];

class SitesService {
  async list(filters?: SitesFilters): Promise<Site[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    let sites = [...MOCK_SITES];

    if (filters?.tenantId) {
      sites = sites.filter(s => s.tenantId === filters.tenantId);
    }
    if (filters?.type && filters.type !== 'ALL_TYPES') {
      sites = sites.filter(s => s.type === filters.type);
    }
    if (filters?.status && filters.status !== 'ALL') {
      sites = sites.filter(s => s.status === filters.status);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      sites = sites.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        s.address.city.toLowerCase().includes(searchLower)
      );
    }

    return sites;
  }

  async getById(id: string): Promise<Site> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const site = MOCK_SITES.find(s => s.id === id);
    if (!site) throw new Error('Site não encontrado');
    return site;
  }

  async create(data: CreateSiteDTO): Promise<Site> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSite: Site = {
      id: `site-${Date.now()}`,
      name: data.name,
      description: data.description,
      type: data.type,
      status: SiteStatus.ACTIVE,
      tenantId: data.tenantId,
      tenantName: 'Cliente Mock',
      address: data.address,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      totalAreas: 0,
      totalCameras: 0,
      onlineCameras: 0,
      offlineCameras: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1',
      createdByName: 'Admin Master'
    };
    return newSite;
  }

  async update(id: string, data: UpdateSiteDTO): Promise<Site> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const site = await this.getById(id);
    return {
      ...site,
      ...data,
      address: data.address ? { ...site.address, ...data.address } : site.address,
      updatedAt: new Date().toISOString()
    };
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const site = await this.getById(id);
    if (site.totalAreas > 0) {
      throw new Error(`Não é possível deletar este local pois ele possui ${site.totalAreas} área(s) vinculada(s).`);
    }
  }

  async getAddressByZipCode(zipCode: string): Promise<Partial<Address>> {
    const cleanZipCode = zipCode.replace(/\D/g, '');
    if (cleanZipCode.length !== 8) throw new Error('CEP inválido');

    const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
    if (!response.ok) throw new Error('Erro ao buscar CEP');

    const data: ViaCEPResponse = await response.json();
    if (data.erro) throw new Error('CEP não encontrado');

    return {
      zipCode: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      country: 'Brasil'
    };
  }
}

export const sitesService = new SitesService();
