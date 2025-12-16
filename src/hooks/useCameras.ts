import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { camerasService, type CreateCameraDTO } from '@/services/api/cameras.service';
import type { CameraFilters } from '@/services/api/cameras.service';
import type { CameraStatus } from '@/modules/shared/types/camera';
import { toast } from 'react-toastify';

export const useCameras = (filters?: CameraFilters) => {
  return useQuery({
    queryKey: ['cameras', filters],
    queryFn: () => camerasService.list(filters),
    staleTime: 30000,
    retry: 1
  });
};

export const useCamera = (id: string) => {
  return useQuery({
    queryKey: ['camera', id],
    queryFn: () => camerasService.getById(id),
    enabled: !!id,
    retry: 1
  });
};

export const useCreateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: camerasService.create,
    onSuccess: () => {
      toast.success('Câmera cadastrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao cadastrar câmera');
    }
  });
};

export const useUpdateCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCameraDTO> }) => 
      camerasService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Câmera atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
      queryClient.invalidateQueries({ queryKey: ['camera', variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar câmera');
    }
  });
};

export const useDeleteCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: camerasService.delete,
    onSuccess: () => {
      toast.success('Câmera removida com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao remover câmera');
    }
  });
};

export const useChangeCameraStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CameraStatus }) =>
      camerasService.changeStatus(id, status),
    onSuccess: () => {
      toast.success('Status alterado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao alterar status');
    }
  });
};

/**
 * ⚠️ Teste de conexão com a câmera
 */
export const useTestConnection = () => {
  return useMutation({
    mutationFn: camerasService.testConnection,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`Conexão bem-sucedida! Latência: ${result.latencyMs}ms`);
      } else {
        toast.error(`Falha na conexão: ${result.errorMessage}`);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao testar conexão');
    }
  });
};

/**
 * Capturar snapshot da câmera
 */
export const useCaptureSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: camerasService.captureSnapshot,
    onSuccess: (_, cameraId) => {
      toast.success('Snapshot capturado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['camera', cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao capturar snapshot');
    }
  });
};

/**
 * Obter estatísticas da câmera
 */
export const useCameraStats = (id: string) => {
  return useQuery({
    queryKey: ['camera-stats', id],
    queryFn: () => camerasService.getStats(id),
    enabled: !!id,
    staleTime: 10000, // Atualizar a cada 10 segundos
    refetchInterval: 10000,
    retry: 1
  });
};
