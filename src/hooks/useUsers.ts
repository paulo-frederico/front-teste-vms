import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  type CreateUserDTO,
  type UpdateUserDTO,
  type UserFilters,
  type UserListResponse,
} from '@/services/api/users.service'
import { mockUsers } from '@/modules/admin/users/mockUsers'
import { UserStatus, type User } from '@/modules/shared/types/auth'

// Fixtures temporários até backend estar pronto
const mockUsersFixture = async (filters?: UserFilters): Promise<UserListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredUsers = [...mockUsers]

  if (filters?.role) {
    filteredUsers = filteredUsers.filter((u) => u.role === filters.role)
  }

  if (filters?.status) {
    filteredUsers = filteredUsers.filter((u) => String(u.status) === String(filters.status))
  }

  if (filters?.tenantId) {
    filteredUsers = filteredUsers.filter((u) => u.tenantId === filters.tenantId)
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filteredUsers = filteredUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.tenantName.toLowerCase().includes(search),
    )
  }

  return {
    users: filteredUsers as unknown as User[],
    total: filteredUsers.length,
    page: filters?.page || 1,
    totalPages: Math.ceil(filteredUsers.length / (filters?.limit || 10)),
  }
}

export const useUsers = (filters?: UserFilters) =>
  useQuery({
    queryKey: ['users', filters],
    queryFn: () => mockUsersFixture(filters),
    staleTime: 30_000,
  })

export const useUser = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const user = mockUsers.find((u) => u.id === id)
      if (!user) throw new Error('Usuário não encontrado')
      return user as unknown as User
    },
    enabled: Boolean(id),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateUserDTO) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id: `usr-${Date.now()}`, ...data }
    },
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar usuário')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDTO }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, ...data }
    },
    onSuccess: (_, variables) => {
      toast.success('Usuário atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar usuário')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      void id
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
    onSuccess: () => {
      toast.success('Usuário removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover usuário')
    },
  })
}

export const useResetUserPassword = () =>
  useMutation({
    mutationFn: async (id: string) => {
      void id
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao redefinir senha')
    },
  })

export const useSuspendUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, status: UserStatus.SUSPENDED }
    },
    onSuccess: (_, id) => {
      toast.success('Usuário suspenso com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao suspender usuário')
    },
  })
}

export const useReactivateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, status: UserStatus.ACTIVE }
    },
    onSuccess: (_, id) => {
      toast.success('Usuário reativado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao reativar usuário')
    },
  })
}
