import { apiClient } from './client'
import type { Camera, CameraStatus, StreamProfile } from '@/modules/shared/types/camera'

export interface CreateCameraDTO {
  name: string
  tenantId: string
  siteId: string
  areaId?: string
  protocol: 'ONVIF' | 'RTSP' | 'RTMP'
  onvifEndpoint?: string
  rtspUrl?: string
  rtmpUrl?: string
  manufacturer?: string
  model?: string
  streamProfiles: StreamProfile[]
  aiEnabled: boolean
  aiModules: string[]
  recordingEnabled: boolean
  retentionDays: number
}

export type UpdateCameraDTO = Partial<CreateCameraDTO>

export interface CameraFilters {
  tenantId?: string
  siteId?: string
  areaId?: string
  status?: CameraStatus
  search?: string
  page?: number
  limit?: number
}

export interface CameraListResponse {
  cameras: Camera[]
  total: number
  page: number
  totalPages: number
}

class CamerasService {
  async list(filters?: CameraFilters): Promise<CameraListResponse> {
    return apiClient.get<CameraListResponse>('/admin-master/cameras', {
      params: filters,
    })
  }

  async getById(id: string): Promise<Camera> {
    return apiClient.get<Camera>(`/admin-master/cameras/${id}`)
  }

  async create(data: CreateCameraDTO): Promise<Camera> {
    return apiClient.post<Camera>('/admin-master/cameras', data)
  }

  async update(id: string, data: UpdateCameraDTO): Promise<Camera> {
    return apiClient.put<Camera>(`/admin-master/cameras/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    return apiClient.delete(`/admin-master/cameras/${id}`)
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`/admin-master/cameras/${id}/test-connection`)
  }

  async updateStreamProfiles(id: string, profiles: StreamProfile[]): Promise<Camera> {
    return apiClient.put<Camera>(`/admin-master/cameras/${id}/stream-profiles`, { profiles })
  }

  async enableAI(id: string, modules: string[]): Promise<Camera> {
    return apiClient.patch<Camera>(`/admin-master/cameras/${id}/ai`, { enabled: true, modules })
  }

  async disableAI(id: string): Promise<Camera> {
    return apiClient.patch<Camera>(`/admin-master/cameras/${id}/ai`, { enabled: false })
  }
}

export const camerasService = new CamerasService()
