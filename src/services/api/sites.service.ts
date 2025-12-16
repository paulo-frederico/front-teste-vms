import type { Site, Address } from '@/modules/shared/types/site';
import { SiteType, SiteStatus } from '@/modules/shared/types/site';

// DTOs
export interface CreateSiteDTO {
  name: string;
  description?: string;
  type: SiteType;
  tenantId: string;
  address: Address;
  contact: {
    phone: string;
    email: string;
    manager: string;
  };
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
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

// Mock Data
export const MOCK_SITES: Site[] = [
  {
    id: 'site-001',
    name: 'Matriz São Paulo',
    description: 'Sede principal da empresa',
    type: SiteType.HEADQUARTERS,
    status: SiteStatus.ACTIVE,
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    address: {
      zipCode: '01311-100',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Sala 1200',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
    },
    contactName: 'João Silva',
    contactPhone: '(11) 3133-1000',
    contactEmail: 'matriz@unifique.com.br',
    totalAreas: 3,
    totalCameras: 12,
    onlineCameras: 11,
    offlineCameras: 1,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
  {
    id: 'site-002',
    name: 'Filial Rio de Janeiro',
    description: 'Filial no Rio de Janeiro',
    type: SiteType.BRANCH,
    status: SiteStatus.ACTIVE,
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    address: {
      zipCode: '22620-901',
      street: 'Avenida Lúcio Costa',
      number: '500',
      complement: 'Bloco B',
      neighborhood: 'Barra da Tijuca',
      city: 'Rio de Janeiro',
      state: 'RJ',
      country: 'Brasil',
    },
    contactName: 'Maria Santos',
    contactPhone: '(21) 2431-8000',
    contactEmail: 'filial.rj@unifique.com.br',
    totalAreas: 2,
    totalCameras: 8,
    onlineCameras: 7,
    offlineCameras: 1,
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
  {
    id: 'site-003',
    name: 'Galpão Logística',
    description: 'Centro de distribuição',
    type: SiteType.WAREHOUSE,
    status: SiteStatus.ACTIVE,
    tenantId: 'tenant-001',
    tenantName: 'Unifique',
    address: {
      zipCode: '25900-200',
      street: 'Rodovia Presidente Dutra',
      number: '5000',
      complement: '',
      neighborhood: 'Engenheiro Passos',
      city: 'Itaboraí',
      state: 'RJ',
      country: 'Brasil',
    },
    contactName: 'Pedro Costa',
    contactPhone: '(24) 3838-3000',
    contactEmail: 'logistica@unifique.com.br',
    totalAreas: 5,
    totalCameras: 20,
    onlineCameras: 18,
    offlineCameras: 2,
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString(),
    createdBy: 'admin-001',
    createdByName: 'Administrador',
  },
];

class SitesService {
  private sites: Site[] = [...MOCK_SITES];
  private nextId = 4;

  async list(filters?: SitesFilters): Promise<Site[]> {
    console.log('📋 [SitesService] Listando locais...', filters);
    
    await this.simulateDelay();

    let result = [...this.sites];

    if (filters?.tenantId) {
      result = result.filter((site) => site.tenantId === filters.tenantId);
    }

    if (filters?.type && filters.type !== 'ALL_TYPES') {
      result = result.filter((site) => site.type === filters.type);
    }

    if (filters?.status && filters.status !== 'ALL') {
      result = result.filter((site) => site.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (site) =>
          site.name.toLowerCase().includes(searchLower) ||
          site.description?.toLowerCase().includes(searchLower) ||
          site.address.city.toLowerCase().includes(searchLower) ||
          site.address.state.toLowerCase().includes(searchLower)
      );
    }

    console.log(`📋 [SitesService] ${result.length} locais encontrados`);
    return result;
  }

  async getById(id: string): Promise<Site> {
    console.log(`🔍 [SitesService] Buscando local com ID: ${id}`);
    
    await this.simulateDelay();

    const site = this.sites.find((s) => s.id === id);
    if (!site) {
      console.error(`❌ [SitesService] Local não encontrado: ${id}`);
      throw new Error(`Local com ID ${id} não encontrado`);
    }

    console.log(`✅ [SitesService] Local encontrado: ${site.name}`);
    return site;
  }

  async create(data: CreateSiteDTO): Promise<Site> {
    console.log('➕ [SitesService] Criando novo local...', data.name);
    
    await this.simulateDelay();

    const newSite: Site = {
      id: `site-${String(this.nextId++).padStart(3, '0')}`,
      ...data,
      tenantName: 'Unifique',
      status: SiteStatus.ACTIVE,
      totalAreas: 0,
      totalCameras: 0,
      onlineCameras: 0,
      offlineCameras: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin-001',
      createdByName: 'Sistema',
    };

    this.sites.push(newSite);
    console.log(`✅ [SitesService] Local criado com ID: ${newSite.id}`);
    return newSite;
  }

  async update(id: string, data: UpdateSiteDTO): Promise<Site> {
    console.log(`✏️ [SitesService] Atualizando local: ${id}`, data);
    
    await this.simulateDelay();

    const siteIndex = this.sites.findIndex((s) => s.id === id);
    if (siteIndex === -1) {
      console.error(`❌ [SitesService] Local não encontrado para atualização: ${id}`);
      throw new Error(`Local com ID ${id} não encontrado`);
    }

    const updatedSite: Site = {
      ...this.sites[siteIndex],
      ...data,
      id, // Garante que ID não é alterado
      updatedAt: new Date().toISOString(),
    };

    this.sites[siteIndex] = updatedSite;
    console.log(`✅ [SitesService] Local atualizado: ${updatedSite.name}`);
    return updatedSite;
  }

  async delete(id: string): Promise<void> {
    console.log(`🗑️ [SitesService] Deletando local: ${id}`);
    
    await this.simulateDelay();

    const site = this.sites.find((s) => s.id === id);
    if (!site) {
      console.error(`❌ [SitesService] Local não encontrado para deleção: ${id}`);
      throw new Error(`Local com ID ${id} não encontrado`);
    }

    // Validar dependências
    if (site.totalAreas > 0) {
      const errorMsg = `Não é possível deletar este local pois ele possui ${site.totalAreas} área(s) vinculada(s). Remova as áreas antes de deletar o local.`;
      console.error(`❌ [SitesService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    if (site.totalCameras > 0) {
      const errorMsg = `Não é possível deletar este local pois ele possui ${site.totalCameras} câmera(s) vinculada(s). Remova as câmeras antes de deletar o local.`;
      console.error(`❌ [SitesService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    this.sites = this.sites.filter((s) => s.id !== id);
    console.log(`✅ [SitesService] Local deletado: ${site.name}`);
  }

  async getAddressByZipCode(zipCode: string): Promise<Partial<Address>> {
    console.log(`🔍 [SitesService] Buscando endereço para CEP: ${zipCode}`);
    
    // Limpar e validar CEP
    const cleanedCep = zipCode.replace(/\D/g, '');
    
    if (cleanedCep.length !== 8) {
      const errorMsg = 'CEP deve conter exatamente 8 dígitos';
      console.error(`❌ [SitesService] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    try {
      // Chamada real para ViaCEP API
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCep}/json/`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao consultar API ViaCEP');
      }

      const data: ViaCEPResponse = await response.json();

      if (data.erro) {
        const errorMsg = 'CEP não encontrado';
        console.error(`❌ [SitesService] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const address: Partial<Address> = {
        zipCode: data.cep,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        country: 'Brasil',
      };

      console.log(`✅ [SitesService] Endereço encontrado:`, address);
      return address;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao buscar CEP';
      console.error(`❌ [SitesService] ${errorMsg}`);
      throw new Error(errorMsg);
    }
  }

  private simulateDelay(): Promise<void> {
    const delay = Math.random() * 500 + 300; // 300-800ms
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export const sitesService = new SitesService();
