import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { techniciansService, type CreateTechnicianDTO } from '@/services/api/technicians.service';
import type { TechnicianFilters } from '@/services/api/technicians.service';
import type { TechnicianStatus } from '@/modules/shared/types/technician';
import { toast } from 'react-toastify';

export const useTechnicians = (filters?: TechnicianFilters) => {
  return useQuery({
    queryKey: ['technicians', filters],
    queryFn: () => techniciansService.list(filters),
    staleTime: 30000,
    retry: 1
  });
};

export const useTechnician = (id: string) => {
  return useQuery({
    queryKey: ['technician', id],
    queryFn: () => techniciansService.getById(id),
    enabled: !!id,
    retry: 1
  });
};

export const useCreateTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: techniciansService.create,
    onSuccess: () => {
      toast.success('Técnico criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar técnico');
    }
  });
};

export const useUpdateTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTechnicianDTO> }) => 
      techniciansService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Técnico atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      queryClient.invalidateQueries({ queryKey: ['technician', variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar técnico');
    }
  });
};

export const useDeleteTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: techniciansService.delete,
    onSuccess: () => {
      toast.success('Técnico removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover técnico');
    }
  });
};

export const useChangeTechnicianStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TechnicianStatus }) =>
      techniciansService.changeStatus(id, status),
    onSuccess: () => {
      toast.success('Status alterado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status');
    }
  });
};

/**
 * ⚠️ LGPD - Conceder acesso temporário
 */
export const useGrantTemporaryAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: techniciansService.grantTemporaryAccess,
    onSuccess: (access) => {
      const expiresAt = new Date(access.expiresAt);
      const duration = Math.round((expiresAt.getTime() - Date.now()) / 60000);

      toast.success(
        `Acesso temporário concedido!\nExpira em ${duration} minutos (${expiresAt.toLocaleTimeString('pt-BR')})`
      );

      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      queryClient.invalidateQueries({ queryKey: ['temporary-accesses'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao conceder acesso temporário');
    }
  });
};

/**
 * ⚠️ LGPD - Revogar acesso temporário
 */
export const useRevokeTemporaryAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: techniciansService.revokeTemporaryAccess,
    onSuccess: () => {
      toast.success('Acesso temporário revogado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      queryClient.invalidateQueries({ queryKey: ['temporary-accesses'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao revogar acesso');
    }
  });
};

/**
 * Listar acessos temporários ativos
 */
export const useActiveAccesses = () => {
  return useQuery({
    queryKey: ['temporary-accesses'],
    queryFn: () => techniciansService.listActiveAccesses(),
    staleTime: 10000, // Atualizar a cada 10 segundos (countdown)
    refetchInterval: 10000, // Refetch automático
    retry: 1
  });
};

/**
 * Verificar acesso ativo de um técnico a um tenant
 */
export const useCheckActiveAccess = (technicianId: string, tenantId: string) => {
  return useQuery({
    queryKey: ['check-access', technicianId, tenantId],
    queryFn: () => techniciansService.checkActiveAccess(technicianId, tenantId),
    enabled: !!technicianId && !!tenantId,
    staleTime: 5000,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
    retry: 1
  });
};
