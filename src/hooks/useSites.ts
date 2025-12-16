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
import type { Site } from '@/modules/shared/types/site';
import type {
  CreateSiteDTO,
  UpdateSiteDTO,
  SitesFilters,
} from '@/services/api/sites.service';
import { sitesService } from '@/services/api/sites.service';

export function useSites(
  filters?: SitesFilters
): UseQueryResult<Site[], Error> {
  return useQuery({
    queryKey: ['sites', filters],
    queryFn: () => sitesService.list(filters),
    staleTime: 30000, // 30 segundos
    retry: 1,
  });
}

export function useSite(id: string): UseQueryResult<Site, Error> {
  return useQuery({
    queryKey: ['site', id],
    queryFn: () => sitesService.getById(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 1,
  });
}

export function useCreateSite(): UseMutationResult<Site, Error, CreateSiteDTO> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSiteDTO) => sitesService.create(data),
    onSuccess: (newSite) => {
      console.log('✅ [useCreateSite] Local criado com sucesso:', newSite);
      toast.success('Local cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar local';
      console.error('❌ [useCreateSite] Erro:', message);
      toast.error(message);
    },
  });
}

export function useUpdateSite(): UseMutationResult<
  Site,
  Error,
  { id: string; data: UpdateSiteDTO }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteDTO }) =>
      sitesService.update(id, data),
    onSuccess: (updatedSite, variables) => {
      console.log('✅ [useUpdateSite] Local atualizado com sucesso:', updatedSite);
      toast.success('Local atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar local';
      console.error('❌ [useUpdateSite] Erro:', message);
      toast.error(message);
    },
  });
}

export function useDeleteSite(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sitesService.delete(id),
    onSuccess: () => {
      console.log('✅ [useDeleteSite] Local removido com sucesso');
      toast.success('Local removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Erro ao remover local';
      console.error('❌ [useDeleteSite] Erro:', message);
      toast.error(message);
    },
  });
}

export function useAddressByZipCode(): UseMutationResult<
  Partial<{
    zipCode: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
  }>,
  Error,
  string
> {
  return useMutation({
    mutationFn: (zipCode: string) => sitesService.getAddressByZipCode(zipCode),
    onSuccess: () => {
      console.log('✅ [useAddressByZipCode] Endereço encontrado!');
      toast.success('Endereço encontrado!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'CEP não encontrado';
      console.error('❌ [useAddressByZipCode] Erro:', message);
      toast.error(message);
    },
  });
}
