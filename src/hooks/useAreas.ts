import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { areasService } from '@/services/api/areas.service';
import { toast } from 'react-toastify';

// ✅ Importar APENAS os tipos do arquivo centralizado
import type {
  CreateAreaDTO,
  UpdateAreaDTO,
  AreasFilters,
  Area
} from '@/types/areas.types';

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
    mutationFn: (data: CreateAreaDTO) => areasService.create(data),
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
    mutationFn: (id: string) => areasService.delete(id),
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
