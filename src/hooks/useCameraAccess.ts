import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cameraAccessService } from '@/services/api/camera-access.service';
import type { CameraAccessRequest } from '@/modules/shared/types/camera-access';
import { toast } from 'react-toastify';

/**
 * Hook para solicitar acesso LGPD a uma câmera
 */
export const useRequestCameraAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CameraAccessRequest) => cameraAccessService.requestAccess(request),
    onSuccess: (session) => {
      toast.success(`Acesso concedido por 30 minutos (expira às ${new Date(session.expiresAt).toLocaleTimeString('pt-BR')})`);
      queryClient.invalidateQueries({ queryKey: ['camera-access-session'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao solicitar acesso');
    }
  });
};

/**
 * Hook para obter sessão ativa de uma câmera
 */
export const useCameraAccessSession = (cameraId: string) => {
  return useQuery({
    queryKey: ['camera-access-session', cameraId],
    queryFn: () => cameraAccessService.getActiveSession(cameraId),
    enabled: !!cameraId,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
    retry: false
  });
};

/**
 * Hook para encerrar acesso a uma câmera
 */
export const useEndCameraAccess = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cameraId: string) => cameraAccessService.endAccess(cameraId),
    onSuccess: () => {
      toast.success('Acesso encerrado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['camera-access-session'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao encerrar acesso');
    }
  });
};
