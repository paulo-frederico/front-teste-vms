import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  usersService,
  type UpdateUserDTO,
  type UserFilters,
} from '@/services/api/users.service'

export const useUsers = (filters?: UserFilters) =>
  useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.list(filters),
    staleTime: 30_000,
  })

export const useUser = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getById(id),
    enabled: Boolean(id),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar usuário')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      usersService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Usuário atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar usuário')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      toast.success('Usuário removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover usuário')
    },
  })
}

export const useResetUserPassword = () =>
  useMutation({
    mutationFn: (id: string) => usersService.resetPassword(id),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao redefinir senha')
    },
  })
