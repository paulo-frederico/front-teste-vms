import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  tenantsService,
  type TenantFilters,
  type UpdateTenantDTO,
} from '@/services/api/tenants.service'
import type { TenantStatus } from '@/modules/shared/types/tenant'

export const useTenants = (filters?: TenantFilters) => {
  console.log('🎣 [useTenants] Hook chamado com filtros:', filters)
  
  return useQuery({
    queryKey: ['tenants', filters],
    queryFn: async () => {
      console.log('⚡ [useTenants] Executando queryFn...')
      const result = await tenantsService.list(filters)
      console.log('✅ [useTenants] queryFn completou:', result)
      return result
    },
    staleTime: 30_000,
    retry: 1, // ✅ Tentar apenas 1 vez
  })
}

export const useTenant = (id: string) =>
  useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantsService.getById(id),
    enabled: Boolean(id),
    retry: 1,
  })

export const useCreateTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tenantsService.create,
    onSuccess: () => {
      toast.success('Cliente criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar cliente')
    },
  })
}

export const useUpdateTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTenantDTO }) =>
      tenantsService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Cliente atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar cliente')
    },
  })
}

export const useDeleteTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tenantsService.delete,
    onSuccess: () => {
      toast.success('Cliente removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover cliente')
    },
  })
}

export const useChangeStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TenantStatus }) =>
      tenantsService.changeStatus(id, status),
    onSuccess: () => {
      toast.success('Status alterado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao alterar status')
    },
  })
}
