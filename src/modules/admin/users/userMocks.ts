import { mockTenants } from '@/fixtures/tenants.fixture'
import { UserRole } from '@/modules/shared/types/auth'
import type { User, UserStatus } from '@/modules/admin/users/userTypes'

const tenantMap = Object.fromEntries(mockTenants.map((tenant) => [tenant.id, tenant.name]))

const userStore: User[] = [
  {
    id: 'user-global-001',
    name: 'Laura Hoffmann',
    email: 'laura.hoffmann@unifique.com.br',
    role: UserRole.ADMIN_MASTER,
    status: 'ACTIVE',
    createdAt: '2022-04-10T10:00:00-03:00',
    lastLoginAt: '2025-12-07T07:55:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: true,
      canManageCameras: true,
      canManageIA: true,
      canManageUsers: true,
    },
  },
  {
    id: 'user-admin-001',
    name: 'Eduardo Farias',
    email: 'eduardo.farias@unifique.com.br',
    role: UserRole.ADMIN,
    status: 'ACTIVE',
    createdAt: '2023-06-15T11:15:00-03:00',
    lastLoginAt: '2025-12-06T16:05:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: true,
      canManageCameras: true,
      canManageIA: true,
      canManageUsers: true,
    },
  },
  {
    id: 'user-tenant-admin-hq',
    name: 'Beatriz Andrade',
    email: 'beatriz.andrade@unifique.com.br',
    phone: '+55 47 99888-2233',
    role: UserRole.CLIENT_MASTER,
    status: 'ACTIVE',
    tenantId: 'tenant-unifique-hq',
    tenantName: tenantMap['tenant-unifique-hq'],
    createdAt: '2023-01-18T14:20:00-03:00',
    lastLoginAt: '2025-12-06T19:30:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: true,
      canManageCameras: true,
      canManageIA: true,
      canManageUsers: true,
    },
  },
  {
    id: 'user-tenant-admin-retail',
    name: 'Juliano Ribeiro',
    email: 'juliano.ribeiro@retailpark.com',
    role: UserRole.CLIENT_MASTER,
    status: 'ACTIVE',
    tenantId: 'tenant-retail-park',
    tenantName: tenantMap['tenant-retail-park'],
    createdAt: '2023-11-05T09:00:00-03:00',
    lastLoginAt: '2025-12-05T18:10:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: true,
      canManageCameras: true,
      canManageIA: true,
      canManageUsers: true,
    },
  },
  {
    id: 'user-tech-floripa',
    name: 'Equipe Campo Floripa',
    email: 'campo.floripa@unifique.com.br',
    role: UserRole.TECHNICIAN,
    status: 'ACTIVE',
    tenantId: 'tenant-unifique-hq',
    tenantName: tenantMap['tenant-unifique-hq'],
    createdAt: '2024-04-02T12:45:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: false,
      canManageCameras: true,
      canManageIA: false,
      canManageUsers: false,
    },
  },
  {
    id: 'user-tech-retail',
    name: 'Operação Retail Park',
    email: 'operacao@retailpark.com',
    role: UserRole.TECHNICIAN,
    status: 'SUSPENDED',
    tenantId: 'tenant-retail-park',
    tenantName: tenantMap['tenant-retail-park'],
    createdAt: '2024-07-22T15:10:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: false,
      canManageCameras: true,
      canManageIA: false,
      canManageUsers: false,
    },
  },
  {
    id: 'user-client-hq-1',
    name: 'Patrícia Nunes',
    email: 'patricia.nunes@vidaplena.org',
    role: UserRole.MANAGER,
    status: 'ACTIVE',
    tenantId: 'tenant-vida-plena',
    tenantName: tenantMap['tenant-vida-plena'],
    createdAt: '2024-01-11T09:35:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: false,
      canManageCameras: false,
      canManageIA: false,
      canManageUsers: false,
    },
  },
  {
    id: 'user-client-hq-2',
    name: 'Daniel Souza',
    email: 'daniel.souza@colegiohorizonte.edu',
    role: UserRole.VIEWER,
    status: 'INVITED',
    tenantId: 'tenant-horizonte-edu',
    tenantName: tenantMap['tenant-horizonte-edu'],
    createdAt: '2025-10-01T13:25:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: false,
      canManageCameras: false,
      canManageIA: false,
      canManageUsers: false,
    },
  },
  {
    id: 'user-client-retail-1',
    name: 'Lívia Costa',
    email: 'livia.costa@retailpark.com',
    role: UserRole.VIEWER,
    status: 'ACTIVE',
    tenantId: 'tenant-retail-park',
    tenantName: tenantMap['tenant-retail-park'],
    createdAt: '2023-05-19T08:10:00-03:00',
    lastLoginAt: '2025-12-01T10:22:00-03:00',
    permissions: {
      canViewLive: true,
      canViewRecordings: true,
      canExportVideos: true,
      canManageCameras: false,
      canManageIA: false,
      canManageUsers: false,
    },
  },
]

export let USER_MOCKS = userStore

function generateUserId() {
  return `user-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`
}

export function listUsersMock(options?: {
  tenantId?: string
  role?: UserRole
  status?: UserStatus
}): Promise<User[]> {
  const result = userStore.filter((user) => {
    if (options?.tenantId && user.tenantId !== options.tenantId) {
      return false
    }
    if (options?.role && user.role !== options.role) {
      return false
    }
    if (options?.status && user.status !== options.status) {
      return false
    }
    return true
  })

  return Promise.resolve([...result])
}

export function getUserByIdMock(id: string): Promise<User | undefined> {
  return Promise.resolve(userStore.find((user) => user.id === id))
}

export function createUserMock(data: Omit<User, 'id' | 'createdAt' | 'lastLoginAt'>): Promise<User> {
  const newUser: User = {
    ...data,
    id: generateUserId(),
    createdAt: new Date().toISOString(),
  }

  userStore.push(newUser)
  USER_MOCKS = userStore
  return Promise.resolve(newUser)
}

export function updateUserMock(id: string, data: Partial<User>): Promise<User | undefined> {
  const index = userStore.findIndex((user) => user.id === id)

  if (index === -1) {
    return Promise.resolve(undefined)
  }

  const updatedUser: User = {
    ...userStore[index],
    ...data,
  }

  userStore[index] = updatedUser
  USER_MOCKS = userStore
  return Promise.resolve(updatedUser)
}
