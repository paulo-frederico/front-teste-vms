import type { Tenant } from './tenantTypes'

const tenantStore: Tenant[] = [
  {
    id: 'tenant-unifique-hq',
    name: 'Unifique Headquarters',
    document: '12.345.678/0001-99',
    contactName: 'Letícia Gomes',
    contactEmail: 'leticia.gomes@unifique.com',
    contactPhone: '+55 47 99999-1010',
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2023-04-12T10:00:00-03:00',
    updatedAt: '2025-11-20T09:45:00-03:00',
    limits: {
      maxCameras: 400,
      maxStreamsExtra: 120,
      defaultRetentionDays: 35,
      iaEnabled: true,
      lprEnabled: true,
      epiEnabled: true,
    },
    camerasCount: 356,
    sitesCount: 12,
    activeUsersCount: 78,
  },
  {
    id: 'tenant-retail-park',
    name: 'Retail Park Brasil',
    document: '27.901.222/0001-45',
    contactName: 'Rafael Dias',
    contactEmail: 'rafael.dias@retailpark.com',
    contactPhone: '+55 11 98888-4545',
    status: 'ACTIVE',
    plan: 'ADVANCED',
    createdAt: '2022-09-05T14:20:00-03:00',
    limits: {
      maxCameras: 220,
      maxStreamsExtra: 60,
      defaultRetentionDays: 25,
      iaEnabled: true,
      lprEnabled: true,
      epiEnabled: false,
    },
    camerasCount: 184,
    sitesCount: 7,
    activeUsersCount: 42,
  },
  {
    id: 'tenant-vida-plena',
    name: 'Hospital Vida Plena',
    document: '05.444.301/0001-02',
    contactName: 'Patrícia Nunes',
    contactEmail: 'patricia.nunes@vidaplena.org',
    contactPhone: '+55 21 97777-1212',
    status: 'SUSPENDED',
    plan: 'STANDARD',
    createdAt: '2021-01-19T08:40:00-03:00',
    updatedAt: '2025-10-03T15:10:00-03:00',
    limits: {
      maxCameras: 150,
      maxStreamsExtra: 30,
      defaultRetentionDays: 20,
      iaEnabled: false,
      lprEnabled: true,
      epiEnabled: false,
    },
    camerasCount: 112,
    sitesCount: 3,
    activeUsersCount: 25,
  },
  {
    id: 'tenant-horizonte-edu',
    name: 'Colégio Horizonte',
    document: '88.210.333/0001-66',
    contactName: 'Daniel Souza',
    contactEmail: 'daniel.souza@colegiohorizonte.edu',
    contactPhone: '+55 31 96666-9090',
    status: 'ACTIVE',
    plan: 'STANDARD',
    createdAt: '2024-02-27T11:30:00-03:00',
    limits: {
      maxCameras: 90,
      maxStreamsExtra: 18,
      defaultRetentionDays: 15,
      iaEnabled: true,
      lprEnabled: false,
      epiEnabled: false,
    },
    camerasCount: 74,
    sitesCount: 4,
    activeUsersCount: 19,
  },
  {
    id: 'tenant-inativa-tech',
    name: 'Inativa Tecnologia',
    document: '41.888.002/0001-11',
    contactName: 'Gustavo Prado',
    contactEmail: 'gustavo.prado@inativatech.com',
    status: 'INACTIVE',
    plan: 'BASIC',
    createdAt: '2020-07-02T16:05:00-03:00',
    limits: {
      maxCameras: 40,
      maxStreamsExtra: 8,
      defaultRetentionDays: 10,
      iaEnabled: false,
      lprEnabled: false,
      epiEnabled: false,
    },
    camerasCount: 0,
    sitesCount: 0,
    activeUsersCount: 0,
  },
]

function generateTenantId() {
  return `tenant-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

export function listTenantsMock(): Promise<Tenant[]> {
  return Promise.resolve([...tenantStore])
}

export function getTenantByIdMock(id: string): Promise<Tenant | undefined> {
  return Promise.resolve(tenantStore.find((tenant) => tenant.id === id))
}

export function createTenantMock(data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> {
  const newTenant: Tenant = {
    ...data,
    id: generateTenantId(),
    createdAt: new Date().toISOString(),
  }

  tenantStore.push(newTenant)
  return Promise.resolve(newTenant)
}

export function updateTenantMock(id: string, data: Partial<Tenant>): Promise<Tenant | undefined> {
  const index = tenantStore.findIndex((tenant) => tenant.id === id)

  if (index === -1) {
    return Promise.resolve(undefined)
  }

  const updatedTenant: Tenant = {
    ...tenantStore[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  tenantStore[index] = updatedTenant
  return Promise.resolve(updatedTenant)
}
