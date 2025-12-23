import { TenantStatus } from '@/modules/shared/types/tenant'
import type { Tenant, TenantPlan, TenantLimits } from '@/modules/shared/types/tenant'
import { mockTenants as initialMockTenants } from '@/fixtures/tenants.fixture'

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

// “Banco” em memória (mock)
let tenantsDb: Tenant[] = [...initialMockTenants]

class TenantsService {
  async list(filters?: TenantFilters): Promise<TenantListResponse> {
    let filtered = [...tenantsDb]

    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status)
    }

    if (filters?.plan) {
      filtered = filtered.filter((t) => t.plan === filters.plan)
    }

    if (filters?.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) => t.name.toLowerCase().includes(s) || t.fiscalData.cnpj.includes(filters.search!)
      )
    }

    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 10
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / limit))

    const startIndex = (page - 1) * limit
    const tenants = filtered.slice(startIndex, startIndex + limit)

    return { tenants, total, page, totalPages }
  }

  async getById(id: string): Promise<Tenant> {
    const tenant = tenantsDb.find((t) => t.id === id)
    if (!tenant) throw new Error(`Tenant ${id} não encontrado`)
    return tenant
  }

  async create(data: CreateTenantDTO): Promise<Tenant> {
    const now = new Date().toISOString()
    const newTenant: Tenant = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      name: data.name,
      plan: data.plan,
      status: TenantStatus.ACTIVE,
      limits: data.limits,
      fiscalData: data.fiscalData,
      primaryContact: data.primaryContact,
      contractDate: data.contractDate,
      expirationDate: data.expirationDate,
      createdAt: now,
      updatedAt: now,
      stats: {
        activeCameras: 0,
        sites: 0,
        users: 0,
        storageUsedGB: 0,
        eventsLast30Days: 0,
      },
    }

    tenantsDb = [newTenant, ...tenantsDb]
    return newTenant
  }

  async update(id: string, data: UpdateTenantDTO): Promise<Tenant> {
    const idx = tenantsDb.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error(`Tenant ${id} não encontrado`)

    const updated: Tenant = {
      ...tenantsDb[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    tenantsDb = tenantsDb.map((t) => (t.id === id ? updated : t))
    return updated
  }

  async changeStatus(id: string, status: TenantStatus): Promise<Tenant> {
    return this.update(id, { status } as UpdateTenantDTO)
  }

  async delete(id: string): Promise<void> {
    tenantsDb = tenantsDb.filter((t) => t.id !== id)
  }

  async getStats(id: string): Promise<unknown> {
    // mock estático
    void id
    return {
      activeCameras: 24,
      sites: 3,
      users: 12,
      storageUsedGB: 245,
      eventsLast30Days: 1523,
    }
  }

  async updateLimits(id: string, limits: TenantLimits): Promise<Tenant> {
    return this.update(id, { limits } as UpdateTenantDTO)
  }

  async changePlan(id: string, plan: TenantPlan): Promise<Tenant> {
    return this.update(id, { plan } as UpdateTenantDTO)
  }
}

export const tenantsService = new TenantsService()
