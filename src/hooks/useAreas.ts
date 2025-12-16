import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { areasService } from '@/services/api/areas.service';
import { toast } from 'react-toastify';

// Definir as interfaces
export interface CreateAreaDTO {
  name: string;
  type: 'RECEPTION' | 'PARKING' | 'PRODUCTION' | 'WAREHOUSE' | 'OFFICE' | 'FACTORY' | 'DATACENTER' | 'OTHER';
  tenantId: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateAreaDTO extends Partial<CreateAreaDTO> {
  id: string;
}

export interface AreasFilters {
  search?: string;
  type?: string;
  tenantId?: string;
  page?: number;
  limit?: number;
}

// Implementar os hooks

// Hook para listar áreas com filtros opcionais
export const useAreas = (filters?: AreasFilters) => {
  return useQuery({
    queryKey: ['areas', filters],
    queryFn: () => areasService.list(filters),
    staleTime: 30000,
    retry: 1
  });
};

// Hook para buscar uma área específica por ID
export const useArea = (id: string) => {
  return useQuery({
    queryKey: ['area', id],
    queryFn: () => areasService.getById(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 1
  });
};

// Hook para criar nova área
export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: areasService.create,
    onSuccess: () => {
      toast.success('Área cadastrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar área');
    }
  });
};

// Hook para atualizar área existente
export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaDTO }) =>
      areasService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Área atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['area', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar área');
    }
  });
};

// Hook para deletar área
export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: areasService.delete,
    onSuccess: () => {
      toast.success('Área removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover área');
    }
  });
};
