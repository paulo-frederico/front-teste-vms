import { TenantStatus } from '@/modules/shared/types/tenant'
import type { Tenant, TenantPlan, TenantLimits } from '@/modules/shared/types/tenant'

export interface CreateTenantDTO {
  name: string
  plan: TenantPlan
  limits: TenantLimits
  fiscalData: {
    cnpj: string
    companyName: string
    stateRegistration?: string
    address: {
      street: string
      number: string
      complement?: string
      neighborhood: string
      city: string
      state: string
      zipCode: string
    }
  }
  primaryContact: {
    name: string
    email: string
    phone: string
    position?: string
  }
  contractDate: string
  expirationDate: string
}

export type UpdateTenantDTO = Partial<CreateTenantDTO>

export interface TenantFilters {
  status?: TenantStatus
  plan?: TenantPlan
  search?: string
  page?: number
  limit?: number
}

export interface TenantListResponse {
  tenants: Tenant[]
  total: number
  page: number
  totalPages: number
}

class TenantsService {
  /**
   * ✅ USAR FIXTURES - NÃO CHAMAR API
   */
  async list(filters?: TenantFilters): Promise<TenantListResponse> {
    console.log('📋 [TenantsService] Carregando lista de tenants (FIXTURES)')

    // ✅ SEMPRE usar fixtures (não chamar API)
    try {
      // Importar fixtures dinamicamente
      const { mockTenants } = await import('@/fixtures/tenants.fixture')

      console.log('✅ [TenantsService] Fixtures carregados:', mockTenants.length, 'tenants')

      let filteredTenants = [...mockTenants]

      // Aplicar filtros
      if (filters?.status) {
        filteredTenants = filteredTenants.filter((t) => t.status === filters.status)
        console.log(
          '🔍 [TenantsService] Filtro status:',
          filters.status,
          '→',
          filteredTenants.length,
          'resultados'
        )
      }

      if (filters?.plan) {
        filteredTenants = filteredTenants.filter((t) => t.plan === filters.plan)
        console.log(
          '🔍 [TenantsService] Filtro plan:',
          filters.plan,
          '→',
          filteredTenants.length,
          'resultados'
        )
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        filteredTenants = filteredTenants.filter(
          (t) =>
            t.name.toLowerCase().includes(searchLower) ||
            t.fiscalData.cnpj.includes(filters.search!)
        )
        console.log(
          '🔍 [TenantsService] Filtro search:',
          filters.search,
          '→',
          filteredTenants.length,
          'resultados'
        )
      }

      // Paginação
      const page = filters?.page || 1
      const limit = filters?.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedTenants = filteredTenants.slice(startIndex, endIndex)

      const response = {
        tenants: paginatedTenants,
        total: filteredTenants.length,
        page: page,
        totalPages: Math.ceil(filteredTenants.length / limit),
      }

      console.log(
        '✅ [TenantsService] Resposta:',
        response.tenants.length,
        'tenants (página',
        page,
        'de',
        response.totalPages,
        ')'
      )

      return response
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao carregar fixtures:', error)

      // Retornar dados vazios em caso de erro
      return {
        tenants: [],
        total: 0,
        page: 1,
        totalPages: 0,
      }
    }
  }

  async getById(id: string): Promise<Tenant> {
    console.log('🔍 [TenantsService] Buscando tenant por ID (FIXTURES):', id)

    try {
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      console.log('✅ [TenantsService] Fixtures carregados para busca')

      const tenant = mockTenants.find((t) => t.id === id)

      if (!tenant) {
        console.error('❌ [TenantsService] Tenant não encontrado:', id)
        throw new Error(`Tenant ${id} não encontrado`)
      }

      console.log('✅ [TenantsService] Tenant encontrado:', tenant.name)
      return tenant
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao buscar tenant:', error)
      throw error
    }
  }

  async create(data: CreateTenantDTO): Promise<Tenant> {
    console.log('➕ [TenantsService] Criando novo tenant (FIXTURES):', data.name)

    try {
      const newTenant: Tenant = {
        id: Date.now().toString(),
        name: data.name,
        plan: data.plan,
        status: TenantStatus.ACTIVE,
        limits: data.limits,
        fiscalData: data.fiscalData,
        primaryContact: data.primaryContact,
        contractDate: data.contractDate,
        expirationDate: data.expirationDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stats: {
          activeCameras: 0,
          sites: 0,
          users: 0,
          storageUsedGB: 0,
          eventsLast30Days: 0,
        },
      }

      console.log('✅ [TenantsService] Tenant criado com sucesso:', newTenant.id)
      return newTenant
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao criar tenant:', error)
      throw error
    }
  }

  async update(id: string, data: UpdateTenantDTO): Promise<Tenant> {
    console.log('✏️ [TenantsService] Atualizando tenant (FIXTURES):', id)

    try {
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)

      if (!tenant) {
        console.error('❌ [TenantsService] Tenant não encontrado para atualizar:', id)
        throw new Error(`Tenant ${id} não encontrado`)
      }

      const updatedTenant = {
        ...tenant,
        ...data,
        updatedAt: new Date().toISOString(),
      }

      console.log('✅ [TenantsService] Tenant atualizado:', updatedTenant.name)
      return updatedTenant
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao atualizar tenant:', error)
      throw error
    }
  }

  async changeStatus(id: string, status: TenantStatus): Promise<Tenant> {
    console.log('🔄 [TenantsService] Alterando status do tenant (FIXTURES):', id, '→', status)

    try {
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)

      if (!tenant) {
        console.error('❌ [TenantsService] Tenant não encontrado para mudar status:', id)
        throw new Error(`Tenant ${id} não encontrado`)
      }

      const updatedTenant = {
        ...tenant,
        status,
        updatedAt: new Date().toISOString(),
      }

      console.log('✅ [TenantsService] Status alterado:', tenant.name, '→', status)
      return updatedTenant
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao alterar status:', error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    console.log('🗑️ [TenantsService] Removendo tenant (FIXTURES):', id)

    try {
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)

      if (tenant) {
        console.log('✅ [TenantsService] Tenant removido:', tenant.name)
      } else {
        console.warn('⚠️ [TenantsService] Tenant não encontrado para remoção:', id)
      }
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao remover tenant:', error)
      throw error
    }
  }

  async getStats(id: string): Promise<unknown> {
    console.log('📊 [TenantsService] Buscando estatísticas do tenant (FIXTURES):', id)

    try {
      const stats = {
        activeCameras: 24,
        sites: 3,
        users: 12,
        storageUsedGB: 245,
        eventsLast30Days: 1523,
      }

      console.log('✅ [TenantsService] Estatísticas carregadas:', stats)
      return stats
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao buscar estatísticas:', error)
      throw error
    }
  }

  async updateLimits(id: string, limits: TenantLimits): Promise<Tenant> {
    console.log('⚙️ [TenantsService] Atualizando limites do tenant (FIXTURES):', id)

    try {
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)

      if (!tenant) {
        console.error('❌ [TenantsService] Tenant não encontrado para atualizar limites:', id)
        throw new Error(`Tenant ${id} não encontrado`)
      }

      const updatedTenant = {
        ...tenant,
        limits,
        updatedAt: new Date().toISOString(),
      }

      console.log('✅ [TenantsService] Limites atualizados:', tenant.name, limits)
      return updatedTenant
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao atualizar limites:', error)
      throw error
    }
  }

  async changePlan(id: string, plan: TenantPlan): Promise<Tenant> {
    console.log('💳 [TenantsService] Alterando plano do tenant (FIXTURES):', id, '→', plan)

    try {
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)

      if (!tenant) {
        console.error('❌ [TenantsService] Tenant não encontrado para mudar plano:', id)
        throw new Error(`Tenant ${id} não encontrado`)
      }

      const updatedTenant = {
        ...tenant,
        plan,
        updatedAt: new Date().toISOString(),
      }

      console.log('✅ [TenantsService] Plano alterado:', tenant.name, '→', plan)
      return updatedTenant
    } catch (error) {
      console.error('❌ [TenantsService] Erro ao alterar plano:', error)
      throw error
    }
  }
}

export const tenantsService = new TenantsService()
