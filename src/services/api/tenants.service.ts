import { apiClient } from './client'
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
  async list(filters?: TenantFilters): Promise<TenantListResponse> {
    // ✅ Em DEV: usar fixtures
    if (import.meta.env.DEV) {
      try {
        // Importar fixtures dinamicamente
        const { mockTenants } = await import('@/fixtures/tenants.fixture')

        let filteredTenants = [...mockTenants]

        // Aplicar filtros
        if (filters?.status) {
          filteredTenants = filteredTenants.filter((t) => t.status === filters.status)
        }

        if (filters?.plan) {
          filteredTenants = filteredTenants.filter((t) => t.plan === filters.plan)
        }

        if (filters?.search) {
          const searchLower = filters.search.toLowerCase()
          filteredTenants = filteredTenants.filter(
            (t) =>
              t.name.toLowerCase().includes(searchLower) ||
              t.fiscalData.cnpj.includes(filters.search!)
          )
        }

        // Paginação
        const page = filters?.page || 1
        const limit = filters?.limit || 10
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedTenants = filteredTenants.slice(startIndex, endIndex)

        return {
          tenants: paginatedTenants,
          total: filteredTenants.length,
          page: page,
          totalPages: Math.ceil(filteredTenants.length / limit),
        }
      } catch (error) {
        console.error('❌ Erro ao carregar fixtures de tenants:', error)
        // Retornar dados vazios em caso de erro
        return {
          tenants: [],
          total: 0,
          page: 1,
          totalPages: 0,
        }
      }
    }

    // ✅ Em PROD: chamar API real
    return apiClient.get<TenantListResponse>('/admin-master/tenants', {
      params: filters,
    })
  }

  async getById(id: string): Promise<Tenant> {
    if (import.meta.env.DEV) {
      try {
        const { mockTenants } = await import('@/fixtures/tenants.fixture')
        const tenant = mockTenants.find((t) => t.id === id)
        if (!tenant) {
          throw new Error(`Tenant ${id} não encontrado`)
        }
        return tenant
      } catch (error) {
        console.error('❌ Erro ao buscar tenant:', error)
        throw error
      }
    }

    return apiClient.get<Tenant>(`/admin-master/tenants/${id}`)
  }

  async create(data: CreateTenantDTO): Promise<Tenant> {
    if (import.meta.env.DEV) {
      console.info('🔧 DEV: Simulando criação de tenant', data)
      // Simular criação retornando um tenant mockado
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
      return newTenant
    }

    return apiClient.post<Tenant>('/admin-master/tenants', data)
  }

  async update(id: string, data: UpdateTenantDTO): Promise<Tenant> {
    if (import.meta.env.DEV) {
      console.info('🔧 DEV: Simulando atualização de tenant', id, data)
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)
      if (!tenant) {
        throw new Error(`Tenant ${id} não encontrado`)
      }
      return {
        ...tenant,
        ...data,
        updatedAt: new Date().toISOString(),
      }
    }

    return apiClient.put<Tenant>(`/admin-master/tenants/${id}`, data)
  }

  async changeStatus(id: string, status: TenantStatus): Promise<Tenant> {
    if (import.meta.env.DEV) {
      console.info('🔧 DEV: Simulando mudança de status', id, status)
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)
      if (!tenant) {
        throw new Error(`Tenant ${id} não encontrado`)
      }
      return {
        ...tenant,
        status,
        updatedAt: new Date().toISOString(),
      }
    }

    return apiClient.patch<Tenant>(`/admin-master/tenants/${id}/status`, { status })
  }

  async delete(id: string): Promise<void> {
    if (import.meta.env.DEV) {
      console.info('🔧 DEV: Simulando remoção de tenant', id)
      return
    }

    return apiClient.delete(`/admin-master/tenants/${id}`)
  }

  async getStats(id: string): Promise<any> {
    if (import.meta.env.DEV) {
      return {
        activeCameras: 24,
        sites: 3,
        users: 12,
        storageUsedGB: 245,
        eventsLast30Days: 1523,
      }
    }

    return apiClient.get(`/admin-master/tenants/${id}/stats`)
  }

  async updateLimits(id: string, limits: TenantLimits): Promise<Tenant> {
    if (import.meta.env.DEV) {
      console.info('🔧 DEV: Simulando atualização de limites', id, limits)
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)
      if (!tenant) {
        throw new Error(`Tenant ${id} não encontrado`)
      }
      return {
        ...tenant,
        limits,
        updatedAt: new Date().toISOString(),
      }
    }

    return apiClient.put<Tenant>(`/admin-master/tenants/${id}/limits`, limits)
  }

  async changePlan(id: string, plan: TenantPlan): Promise<Tenant> {
    if (import.meta.env.DEV) {
      console.info('🔧 DEV: Simulando mudança de plano', id, plan)
      const { mockTenants } = await import('@/fixtures/tenants.fixture')
      const tenant = mockTenants.find((t) => t.id === id)
      if (!tenant) {
        throw new Error(`Tenant ${id} não encontrado`)
      }
      return {
        ...tenant,
        plan,
        updatedAt: new Date().toISOString(),
      }
    }

    return apiClient.patch<Tenant>(`/admin-master/tenants/${id}/plan`, { plan })
  }
}

export const tenantsService = new TenantsService()
