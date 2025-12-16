import type {
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import type { Area } from '@/modules/shared/types/area';
import type {
  CreateAreaDTO,
  UpdateAreaDTO,
  AreasFilters,
} from '@/services/api/areas.service';
import { areasService } from '@/services/api/areas.service';

export function useAreas(
  filters?: AreasFilters
): UseQueryResult<Area[], Error> {
  return useQuery({
    queryKey: ['areas', filters],
    queryFn: () => areasService.list(filters),
    staleTime: 30000, // 30 segundos
    retry: 1,
  });
}

export function useArea(id: string): UseQueryResult<Area, Error> {
  return useQuery({
    queryKey: ['area', id],
    queryFn: () => areasService.getById(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  });
}

export function useCreateArea(): UseMutationResult<Area, Error, CreateAreaDTO> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAreaDTO) => areasService.create(data),
    onSuccess: (newArea) => {
      console.log('✅ [useCreateArea] Área criada com sucesso:', newArea);
      toast.success('Área cadastrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar área';
      console.error('❌ [useCreateArea] Erro:', message);
      toast.error(message);
    },
  });
}

export function useUpdateArea(): UseMutationResult<
  Area,
  Error,
  { id: string; data: UpdateAreaDTO }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAreaDTO }) =>
      areasService.update(id, data),
    onSuccess: (updatedArea, variables) => {
      console.log('✅ [useUpdateArea] Área atualizada com sucesso:', updatedArea);
      toast.success('Área atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['area', variables.id] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar área';
      console.error('❌ [useUpdateArea] Erro:', message);
      toast.error(message);
    },
  });
}

export function useDeleteArea(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => areasService.delete(id),
    onSuccess: () => {
      console.log('✅ [useDeleteArea] Área removida com sucesso');
      toast.success('Área removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao remover área';
      console.error('❌ [useDeleteArea] Erro:', message);
      toast.error(message);
    },
  });
}
