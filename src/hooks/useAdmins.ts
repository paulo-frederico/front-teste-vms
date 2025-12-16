import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminsService, type CreateAdminDTO, type AdminFilters } from '@/services/api/admins.service';
import { toast } from 'react-toastify';

export const useAdmins = (filters?: AdminFilters) => {
  return useQuery({
    queryKey: ['admins', filters],
    queryFn: () => adminsService.list(filters),
    staleTime: 30000,
    retry: 1
  });
};

export const useAdmin = (id: string) => {
  return useQuery({
    queryKey: ['admin', id],
    queryFn: () => adminsService.getById(id),
    enabled: !!id,
    retry: 1
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminsService.create,
    onSuccess: () => {
      toast.success('Admin criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao criar admin');
    }
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAdminDTO> }) => 
      adminsService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Admin atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      queryClient.invalidateQueries({ queryKey: ['admin', variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar admin');
    }
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminsService.delete,
    onSuccess: () => {
      toast.success('Admin removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover admin');
    }
  });
};

export const useChangeAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' }) =>
      adminsService.changeStatus(id, status),
    onSuccess: () => {
      toast.success('Status alterado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status');
    }
  });
};

export const useResetAdminPassword = () => {
  return useMutation({
    mutationFn: adminsService.resetPassword,
    onSuccess: () => {
      toast.success('Senha resetada com sucesso! Nova senha enviada por email.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao resetar senha');
    }
  });
};
