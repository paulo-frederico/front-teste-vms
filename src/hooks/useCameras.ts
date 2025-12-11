import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import {
  camerasService,
  type CameraFilters,
  type UpdateCameraDTO,
} from '@/services/api/cameras.service'
import type { StreamProfile } from '@/modules/shared/types/camera'

export const useCameras = (filters?: CameraFilters) =>
  useQuery({
    queryKey: ['cameras', filters],
    queryFn: () => camerasService.list(filters),
    staleTime: 30_000,
  })

export const useCamera = (id: string) =>
  useQuery({
    queryKey: ['camera', id],
    queryFn: () => camerasService.getById(id),
    enabled: Boolean(id),
  })

export const useCreateCamera = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: camerasService.create,
    onSuccess: () => {
      toast.success('Câmera cadastrada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['cameras'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao cadastrar câmera')
    },
  })
}

export const useUpdateCamera = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCameraDTO }) =>
      camerasService.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Câmera atualizada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['cameras'] })
      queryClient.invalidateQueries({ queryKey: ['camera', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar câmera')
    },
  })
}

export const useDeleteCamera = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: camerasService.delete,
    onSuccess: () => {
      toast.success('Câmera removida com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['cameras'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover câmera')
    },
  })
}

export const useTestCameraConnection = () =>
  useMutation({
    mutationFn: (id: string) => camerasService.testConnection(id),
    onSuccess: () => {
      toast.success('Conexão testada com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Falha ao testar conexão')
    },
  })

export const useUpdateStreamProfiles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, profiles }: { id: string; profiles: StreamProfile[] }) =>
      camerasService.updateStreamProfiles(id, profiles),
    onSuccess: (_, variables) => {
      toast.success('Perfis de stream atualizados!')
      queryClient.invalidateQueries({ queryKey: ['camera', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar perfis de stream')
    },
  })
}

export const useEnableCameraAI = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, modules }: { id: string; modules: string[] }) =>
      camerasService.enableAI(id, modules),
    onSuccess: (_, variables) => {
      toast.success('IA habilitada para a câmera!')
      queryClient.invalidateQueries({ queryKey: ['camera', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao habilitar IA')
    },
  })
}

export const useDisableCameraAI = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => camerasService.disableAI(id),
    onSuccess: (_, id) => {
      toast.success('IA desabilitada para a câmera!')
      queryClient.invalidateQueries({ queryKey: ['camera', id] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao desabilitar IA')
    },
  })
}
