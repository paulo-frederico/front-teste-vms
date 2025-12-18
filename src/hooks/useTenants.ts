import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { tenantsService, type TenantFilters, type UpdateTenantDTO } from '@/services/api/tenants.service'
import { mockTenants } from '@/fixtures/tenants.fixture'
import { TenantStatus, TenantPlan, type TenantLimits } from '@/modules/shared/types/tenant'

// Hook para listar tenants com filtros
export const useTenants = (filters?: TenantFilters) => {
  return useQuery({
    queryKey: ['tenants', filters],
    queryFn: () => tenantsService.list(filters),
    staleTime: 30000,
  })
}

// Hook para buscar tenant específico
export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: async () => {
      const tenant = mockTenants.find((t) => t.id === id)
      if (!tenant) throw new Error('Tenant não encontrado')
      return tenant
    },
    enabled: Boolean(id),
    staleTime: 30000,
  })
}

// Hook para deletar tenant
export const useDeleteTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
    onSuccess: () => {
      toast.success('Tenant removido com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover tenant')
    },
  })
}

// Hook para mudar status do tenant
export const useChangeStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TenantStatus }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, status }
    },
    onSuccess: () => {
      toast.success('Status atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar status')
    },
  })
}

// Hook para mudar plano do tenant
export const useChangePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, plan }: { id: string; plan: TenantPlan }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, plan }
    },
    onSuccess: () => {
      toast.success('Plano atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar plano')
    },
  })
}

// Hook para atualizar limites do tenant
export const useUpdateLimits = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, limits }: { id: string; limits: TenantLimits }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, limits }
    },
    onSuccess: () => {
      toast.success('Limites atualizados com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar limites')
    },
  })
}

// Hook para criar tenant
export const useCreateTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id: `tnt-${Date.now()}`, ...data }
    },
    onSuccess: () => {
      toast.success('Tenant criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar tenant')
    },
  })
}

// Hook para atualizar tenant
export const useUpdateTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTenantDTO }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { id, ...data }
    },
    onSuccess: (_, variables) => {
      toast.success('Tenant atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', variables.id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar tenant')
    },
  })
}

// Hook para obter estatísticas do tenant
export const useTenantStats = (id: string) => {
  return useQuery({
    queryKey: ['tenant-stats', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {
        camerasCount: 45,
        sitesCount: 3,
        activeUsersCount: 12,
        storageUsedGB: 245,
        eventsLast30Days: 1523,
      }
    },
    enabled: Boolean(id),
    staleTime: 60000,
  })
}
