import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cameraConfigService, type UpdateConfigDTO } from '@/services/api/camera-config.service';
import type { CodecConfig, ImageAdjustment, AIConfig, DeviceInfo } from '@/modules/shared/types/camera-config';
import { toast } from 'react-toastify';

/**
 * Hook para buscar configuração de uma câmera
 */
export const useCameraConfig = (cameraId: string) => {
  return useQuery({
    queryKey: ['camera-config', cameraId],
    queryFn: () => cameraConfigService.getConfig(cameraId),
    enabled: !!cameraId,
    staleTime: 30000,
    retry: 1
  });
};

/**
 * Hook para atualizar configuração completa
 */
export const useUpdateCameraConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId, data }: { cameraId: string; data: UpdateConfigDTO }) =>
      cameraConfigService.updateConfig(cameraId, data),
    onSuccess: (_, variables) => {
      toast.success('Configuração atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['camera-config', variables.cameraId] });
      queryClient.invalidateQueries({ queryKey: ['camera', variables.cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar configuração');
    }
  });
};

/**
 * Hook para atualizar apenas CODEC
 */
export const useUpdateCodec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId, codec }: { cameraId: string; codec: Partial<CodecConfig> }) =>
      cameraConfigService.updateCodec(cameraId, codec),
    onSuccess: (_, variables) => {
      toast.success('Configurações de CODEC atualizadas!');
      queryClient.invalidateQueries({ queryKey: ['camera-config', variables.cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar CODEC');
    }
  });
};

/**
 * Hook para atualizar apenas ajustes de imagem
 */
export const useUpdateImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId, image }: { cameraId: string; image: Partial<ImageAdjustment> }) =>
      cameraConfigService.updateImage(cameraId, image),
    onSuccess: (_, variables) => {
      toast.success('Ajustes de imagem atualizados!');
      queryClient.invalidateQueries({ queryKey: ['camera-config', variables.cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar imagem');
    }
  });
};

/**
 * Hook para atualizar apenas configurações de IA
 */
export const useUpdateAI = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId, ai }: { cameraId: string; ai: Partial<AIConfig> }) =>
      cameraConfigService.updateAI(cameraId, ai),
    onSuccess: (_, variables) => {
      toast.success('Configurações de IA atualizadas!');
      queryClient.invalidateQueries({ queryKey: ['camera-config', variables.cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar IA');
    }
  });
};

/**
 * Hook para atualizar apenas informações de dispositivo
 */
export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cameraId, device }: { cameraId: string; device: Partial<DeviceInfo> }) =>
      cameraConfigService.updateDevice(cameraId, device),
    onSuccess: (_, variables) => {
      toast.success('Informações de dispositivo atualizadas!');
      queryClient.invalidateQueries({ queryKey: ['camera-config', variables.cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar dispositivo');
    }
  });
};

/**
 * ⚠️ Hook para bloquear câmera
 */
export const useLockCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cameraConfigService.lockCamera,
    onSuccess: (_, cameraId) => {
      toast.success('Câmera bloqueada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['camera', cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao bloquear câmera');
    }
  });
};

/**
 * ⚠️ Hook para reiniciar câmera
 */
export const useRebootCamera = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cameraConfigService.rebootCamera,
    onSuccess: (_, cameraId) => {
      toast.success('Câmera reiniciada com sucesso! Aguarde alguns segundos para reconexão.');
      queryClient.invalidateQueries({ queryKey: ['camera', cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao reiniciar câmera');
    }
  });
};

/**
 * Hook para resetar configuração para padrão de fábrica
 */
export const useResetToFactory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cameraConfigService.resetToFactory,
    onSuccess: (_, cameraId) => {
      toast.success('Configuração resetada para padrão de fábrica!');
      queryClient.invalidateQueries({ queryKey: ['camera-config', cameraId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao resetar configuração');
    }
  });
};
