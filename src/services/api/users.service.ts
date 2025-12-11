import { apiClient } from './client'
import type { User, SystemRole, UserStatus, UserScope, UserPermissions } from '@/modules/shared/types/auth'

export interface CreateUserDTO {
  name: string
  email: string
  password: string
  role: SystemRole
  tenantId?: string
  scope: UserScope
  permissions: UserPermissions
  phone?: string
}

export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, 'password'>> {
  status?: UserStatus
}

export interface UserFilters {
  role?: SystemRole
  status?: UserStatus
  tenantId?: string
  search?: string
  page?: number
  limit?: number
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  totalPages: number
}

class UsersService {
  async list(filters?: UserFilters): Promise<UserListResponse> {
    return apiClient.get<UserListResponse>('/admin-master/users', {
      params: filters,
    })
  }

  async getById(id: string): Promise<User> {
    return apiClient.get<User>(`/admin-master/users/${id}`)
  }

  async create(data: CreateUserDTO): Promise<User> {
    return apiClient.post<User>('/admin-master/users', data)
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return apiClient.put<User>(`/admin-master/users/${id}`, data)
  }

  async changeStatus(id: string, status: UserStatus): Promise<User> {
    return apiClient.patch<User>(`/admin-master/users/${id}/status`, { status })
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/admin-master/users/${id}`)
  }

  async resetPassword(id: string): Promise<void> {
    return apiClient.post(`/admin-master/users/${id}/reset-password`)
  }

  async updatePermissions(id: string, permissions: UserPermissions): Promise<User> {
    return apiClient.put<User>(`/admin-master/users/${id}/permissions`, permissions)
  }

  async updateScope(id: string, scope: UserScope): Promise<User> {
    return apiClient.put<User>(`/admin-master/users/${id}/scope`, scope)
  }
}

export const usersService = new UsersService()
