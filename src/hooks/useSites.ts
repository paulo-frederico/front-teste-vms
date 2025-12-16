import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sitesService, CreateSiteDTO, UpdateSiteDTO, SitesFilters } from '@/services/api/sites.service';
import { toast } from 'react-toastify';

export const useSites = (filters?: SitesFilters) => {
  return useQuery({
    queryKey: ['sites', filters],
    queryFn: () => sitesService.list(filters),
    staleTime: 30000,
    retry: 1
  });
};

export const useSite = (id: string) => {
  return useQuery({
    queryKey: ['site', id],
    queryFn: () => sitesService.getById(id),
    enabled: !!id,
    staleTime: 30000,
    retry: 1
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sitesService.create,
    onSuccess: () => {
      toast.success('Local cadastrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar local');
    }
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSiteDTO }) =>
      sitesService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Local atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['site', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar local');
    }
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sitesService.delete,
    onSuccess: () => {
      toast.success('Local removido com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover local');
    }
  });
};

export const useAddressByZipCode = () => {
  return useMutation({
    mutationFn: sitesService.getAddressByZipCode,
    onSuccess: () => {
      toast.success('Endereço encontrado!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'CEP não encontrado');
    }
  });
};
