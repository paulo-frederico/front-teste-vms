import type { 
  Camera, 
  ConnectionTest,
  CameraStats 
} from '@/modules/shared/types/camera';
import { CameraStatus, CameraProtocol, StreamQuality, RecordingMode } from '@/modules/shared/types/camera';

export interface CreateCameraDTO {
  name: string;
  description?: string;
  tenantId: string;
  siteId?: string;
  areaId?: string;
  protocol: CameraProtocol;
  ipAddress: string;
  port: number;
  username: string;
  password: string;
  mainStreamUrl: string;
  subStreamUrl?: string;
  recordingMode: RecordingMode;
  retentionDays: number;
}

export interface UpdateCameraDTO {
  name?: string;
  description?: string;
  siteId?: string;
  areaId?: string;
  protocol?: CameraProtocol;
  ipAddress?: string;
  port?: number;
  username?: string;
  password?: string;
  mainStreamUrl?: string;
  subStreamUrl?: string;
  recordingMode?: RecordingMode;
  retentionDays?: number;
}

export interface CameraFilters {
  status?: CameraStatus | 'ALL'; // ⚠️ Usar 'ALL' ao invés de ''
  protocol?: CameraProtocol | 'ALL_PROTOCOLS'; // ⚠️ Usar 'ALL_PROTOCOLS'
  tenantId?: string;
  siteId?: string;
  areaId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CameraListResponse {
  cameras: Camera[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TestConnectionDTO {
  protocol: CameraProtocol;
  ipAddress: string;
  port: number;
  username: string;
  password: string;
}

// Mock data
const MOCK_CAMERAS: Camera[] = [
  {
    id: '1',
    name: 'Câmera Entrada Principal',
    description: 'Câmera fixa na entrada principal do prédio',
    tenantId: '1',
    tenantName: 'Empresa ABC Ltda',
    siteId: 'site-1',
    siteName: 'Matriz São Paulo',
    areaId: 'area-1',
    areaName: 'Entrada Principal',
    protocol: CameraProtocol.ONVIF,
    ipAddress: '192.168.1.100',
    port: 80,
    credentials: {
      username: 'admin',
      password: '********'
    },
    mainStreamUrl: 'rtsp://192.168.1.100:554/stream1',
    subStreamUrl: 'rtsp://192.168.1.100:554/stream2',
    streamProfiles: [
      {
        id: 'profile-1',
        name: 'Principal',
        quality: StreamQuality.HIGH,
        resolution: '1920x1080',
        fps: 30,
        bitrate: 2048,
        codec: 'H.264',
        url: 'rtsp://192.168.1.100:554/stream1'
      },
      {
        id: 'profile-2',
        name: 'Substream',
        quality: StreamQuality.MEDIUM,
        resolution: '1280x720',
        fps: 15,
        bitrate: 1024,
        codec: 'H.264',
        url: 'rtsp://192.168.1.100:554/stream2'
      }
    ],
    status: CameraStatus.ONLINE,
    lastOnline: new Date().toISOString(),
    hardwareInfo: {
      manufacturer: 'Hikvision',
      model: 'DS-2CD2143G0-I',
      firmwareVersion: 'V5.7.3',
      serialNumber: 'DS-2CD2143G0-I20210101AAWRD12345678',
      macAddress: '00:11:22:33:44:55'
    },
    ptzCapabilities: {
      supportsPTZ: false,
      canPan: false,
      canTilt: false,
      canZoom: false,
      presets: 0,
      tours: 0
    },
    recordingMode: RecordingMode.CONTINUOUS,
    retentionDays: 7,
    enabledAIModules: ['lpr', 'intrusion'],
    snapshotUrl: '/api/cameras/1/snapshot.jpg',
    snapshotUpdatedAt: new Date().toISOString(),
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    createdByName: 'Admin Master',
    installedBy: '1',
    installedByName: 'Pedro Instalador',
    installedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Câmera Estacionamento',
    description: 'Câmera PTZ no estacionamento',
    tenantId: '1',
    tenantName: 'Empresa ABC Ltda',
    siteId: 'site-1',
    siteName: 'Matriz São Paulo',
    areaId: 'area-2',
    areaName: 'Estacionamento',
    protocol: CameraProtocol.RTSP,
    ipAddress: '192.168.1.101',
    port: 554,
    credentials: {
      username: 'admin',
      password: '********'
    },
    mainStreamUrl: 'rtsp://192.168.1.101:554/live',
    streamProfiles: [
      {
        id: 'profile-3',
        name: 'Principal',
        quality: StreamQuality.HIGH,
        resolution: '1920x1080',
        fps: 25,
        bitrate: 2048,
        codec: 'H.265',
        url: 'rtsp://192.168.1.101:554/live'
      }
    ],
    status: CameraStatus.ONLINE,
    lastOnline: new Date().toISOString(),
    hardwareInfo: {
      manufacturer: 'Dahua',
      model: 'SD59230U-HNI',
      firmwareVersion: 'V2.800.0000000.28.R',
      serialNumber: 'SD59230U-HNI20210215AAWRD98765432',
      macAddress: 'AA:BB:CC:DD:EE:FF'
    },
    ptzCapabilities: {
      supportsPTZ: true,
      canPan: true,
      canTilt: true,
      canZoom: true,
      presets: 8,
      tours: 2
    },
    recordingMode: RecordingMode.EVENT_BASED,
    retentionDays: 15,
    enabledAIModules: ['lpr', 'line_crossing'],
    snapshotUrl: '/api/cameras/2/snapshot.jpg',
    snapshotUpdatedAt: new Date().toISOString(),
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    createdByName: 'Admin Master',
    installedBy: '1',
    installedByName: 'Pedro Instalador',
    installedAt: '2024-02-10T16:00:00Z'
  },
  {
    id: '3',
    name: 'Câmera Recepção',
    description: 'Câmera fixa na recepção',
    tenantId: '2',
    tenantName: 'Condomínio XYZ',
    siteId: 'site-2',
    siteName: 'Bloco A',
    areaId: 'area-3',
    areaName: 'Recepção',
    protocol: CameraProtocol.ONVIF,
    ipAddress: '192.168.2.100',
    port: 80,
    credentials: {
      username: 'admin',
      password: '********'
    },
    mainStreamUrl: 'rtsp://192.168.2.100:554/main',
    streamProfiles: [
      {
        id: 'profile-4',
        name: 'Principal',
        quality: StreamQuality.MEDIUM,
        resolution: '1280x720',
        fps: 20,
        bitrate: 1024,
        codec: 'H.264',
        url: 'rtsp://192.168.2.100:554/main'
      }
    ],
    status: CameraStatus.OFFLINE,
    lastOffline: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
    hardwareInfo: {
      manufacturer: 'Intelbras',
      model: 'VIP 1230 D',
      firmwareVersion: 'V6.5.1',
      macAddress: '11:22:33:44:55:66'
    },
    ptzCapabilities: {
      supportsPTZ: false,
      canPan: false,
      canTilt: false,
      canZoom: false,
      presets: 0,
      tours: 0
    },
    recordingMode: RecordingMode.CONTINUOUS,
    retentionDays: 7,
    enabledAIModules: ['intrusion'],
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    createdByName: 'Admin Master',
    installedBy: '2',
    installedByName: 'Lucas Redes',
    installedAt: '2024-03-05T13:00:00Z'
  }
];

class CamerasService {
  async list(filters?: CameraFilters): Promise<CameraListResponse> {
    console.log('📋 [CamerasService] Carregando lista de câmeras (FIXTURES)');
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredCameras = [...MOCK_CAMERAS];

    // ⚠️ Aplicar filtros (converter 'ALL' para vazio internamente)
    if (filters?.status && filters.status !== 'ALL') {
      filteredCameras = filteredCameras.filter(c => c.status === filters.status);
      console.log('🔍 [CamerasService] Filtro status:', filters.status, '→', filteredCameras.length, 'resultados');
    }

    if (filters?.protocol && filters.protocol !== 'ALL_PROTOCOLS') {
      filteredCameras = filteredCameras.filter(c => c.protocol === filters.protocol);
      console.log('🔍 [CamerasService] Filtro protocol:', filters.protocol, '→', filteredCameras.length, 'resultados');
    }

    if (filters?.tenantId) {
      filteredCameras = filteredCameras.filter(c => c.tenantId === filters.tenantId);
    }

    if (filters?.siteId) {
      filteredCameras = filteredCameras.filter(c => c.siteId === filters.siteId);
    }

    if (filters?.areaId) {
      filteredCameras = filteredCameras.filter(c => c.areaId === filters.areaId);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCameras = filteredCameras.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.ipAddress.includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower)
      );
      console.log('🔍 [CamerasService] Filtro search:', filters.search, '→', filteredCameras.length, 'resultados');
    }

    // Paginação
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCameras = filteredCameras.slice(startIndex, endIndex);

    console.log('✅ [CamerasService] Resposta:', paginatedCameras.length, 'câmeras');

    return {
      cameras: paginatedCameras,
      total: filteredCameras.length,
      page: page,
      totalPages: Math.ceil(filteredCameras.length / limit)
    };
  }

  async getById(id: string): Promise<Camera> {
    console.log('🔍 [CamerasService] Buscando câmera:', id);
    await new Promise(resolve => setTimeout(resolve, 200));

    const camera = MOCK_CAMERAS.find(c => c.id === id);
    if (!camera) throw new Error(`Câmera ${id} não encontrada`);

    console.log('✅ [CamerasService] Câmera encontrada:', camera.name);
    return camera;
  }

  async create(data: CreateCameraDTO): Promise<Camera> {
    console.log('➕ [CamerasService] Simulando criação de câmera:', data.name);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newCamera: Camera = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      tenantId: data.tenantId,
      tenantName: 'Cliente Mock', // Em produção, buscar nome real
      siteId: data.siteId,
      siteName: data.siteId ? 'Local Mock' : undefined,
      areaId: data.areaId,
      areaName: data.areaId ? 'Área Mock' : undefined,
      protocol: data.protocol,
      ipAddress: data.ipAddress,
      port: data.port,
      credentials: {
        username: data.username,
        password: data.password
      },
      mainStreamUrl: data.mainStreamUrl,
      subStreamUrl: data.subStreamUrl,
      streamProfiles: [
        {
          id: 'profile-new',
          name: 'Principal',
          quality: StreamQuality.HIGH,
          resolution: '1920x1080',
          fps: 30,
          bitrate: 2048,
          codec: 'H.264',
          url: data.mainStreamUrl
        }
      ],
      status: CameraStatus.CONFIGURING,
      recordingMode: data.recordingMode,
      retentionDays: data.retentionDays,
      enabledAIModules: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1',
      createdByName: 'Admin Master'
    };

    console.log('✅ [CamerasService] Câmera criada (simulado):', newCamera.id);
    return newCamera;
  }

  async update(id: string, data: UpdateCameraDTO): Promise<Camera> {
    console.log('✏️ [CamerasService] Simulando atualização de câmera:', id);
    await new Promise(resolve => setTimeout(resolve, 500));

    const camera = MOCK_CAMERAS.find(c => c.id === id);
    if (!camera) throw new Error(`Câmera ${id} não encontrada`);

    const updatedCamera: Camera = { 
      ...camera, 
      ...data,
      credentials: data.username || data.password ? {
        username: data.username || camera.credentials.username,
        password: data.password || camera.credentials.password
      } : camera.credentials,
      updatedAt: new Date().toISOString() 
    };

    console.log('✅ [CamerasService] Câmera atualizada (simulado):', updatedCamera.name);
    return updatedCamera;
  }

  async changeStatus(id: string, status: CameraStatus): Promise<Camera> {
    console.log('🔄 [CamerasService] Simulando mudança de status:', id, '→', status);
    await new Promise(resolve => setTimeout(resolve, 300));

    const camera = MOCK_CAMERAS.find(c => c.id === id);
    if (!camera) throw new Error(`Câmera ${id} não encontrada`);

    const updatedCamera = { 
      ...camera, 
      status,
      lastOnline: status === 'ONLINE' ? new Date().toISOString() : camera.lastOnline,
      lastOffline: status === 'OFFLINE' ? new Date().toISOString() : camera.lastOffline,
      updatedAt: new Date().toISOString() 
    };

    console.log('✅ [CamerasService] Status alterado (simulado):', updatedCamera.status);
    return updatedCamera;
  }

  async delete(id: string): Promise<void> {
    console.log('🗑️ [CamerasService] Simulando remoção de câmera:', id);
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('✅ [CamerasService] Câmera removida (simulado)');
  }

  /**
   * ⚠️ Teste de conexão com a câmera
   */
  async testConnection(data: TestConnectionDTO): Promise<ConnectionTest> {
    console.log('🔌 [CamerasService] Testando conexão:', data.ipAddress);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simula teste demorado

    // Simular sucesso/falha aleatório
    const success = Math.random() > 0.2; // 80% de sucesso

    const test: ConnectionTest = {
      id: Date.now().toString(),
      cameraId: 'test',
      testedAt: new Date().toISOString(),
      testedBy: '1',
      testedByName: 'Admin Master',
      success: success,
      latencyMs: success ? Math.floor(Math.random() * 100) + 20 : undefined,
      errorMessage: success ? undefined : 'Timeout: Câmera não respondeu em 5 segundos',
      snapshotUrl: success ? '/api/cameras/test/snapshot.jpg' : undefined
    };

    if (success) {
      console.log('✅ [CamerasService] Conexão bem-sucedida! Latência:', test.latencyMs, 'ms');
    } else {
      console.log('❌ [CamerasService] Falha na conexão:', test.errorMessage);
    }

    return test;
  }

  /**
   * Capturar snapshot da câmera
   */
  async captureSnapshot(id: string): Promise<string> {
    console.log('📸 [CamerasService] Capturando snapshot:', id);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const snapshotUrl = `/api/cameras/${id}/snapshot.jpg?t=${Date.now()}`;
    console.log('✅ [CamerasService] Snapshot capturado:', snapshotUrl);
    return snapshotUrl;
  }

  /**
   * Obter estatísticas da câmera
   */
  async getStats(id: string): Promise<CameraStats> {
    console.log('📊 [CamerasService] Buscando estatísticas:', id);
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      cameraId: id,
      uptime: Math.floor(Math.random() * 30) + 70, // 70-100%
      totalEvents: Math.floor(Math.random() * 1000),
      storageUsedGB: Math.floor(Math.random() * 50) + 10,
      averageBitrate: Math.floor(Math.random() * 1000) + 1024,
      lastSnapshot: `/api/cameras/${id}/snapshot.jpg`
    };
  }
}

export const camerasService = new CamerasService();
