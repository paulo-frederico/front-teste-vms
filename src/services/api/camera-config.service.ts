import type {
  CameraConfiguration,
  CodecConfig,
  ImageAdjustment,
  AIConfig,
  DeviceInfo
} from '@/modules/shared/types/camera-config';
import {
  CodecType,
  Resolution,
  Encoder,
  StreamType,
  BitRateType,
  VideoStandard,
  OperationMode
} from '@/modules/shared/types/camera-config';

export interface UpdateConfigDTO {
  // CODEC
  codecType?: 'VIDEO_ONLY' | 'VIDEO_AUDIO';
  resolution?: string;
  encoder?: 'H264' | 'H265' | 'MJPEG';
  fps?: number;
  frameTime?: number;
  displayOSD?: string;
  streamType?: 'MAIN_STREAM' | 'SUB_STREAM';
  bitRateType?: 'CBR' | 'VBR';
  bitRate?: number;

  // Imagem
  brightness?: number;
  contrast?: number;
  saturation?: number;

  // IA
  enableAI?: boolean;
  recordOnMotionOnly?: boolean;
  faceDetect?: boolean;
  motionContours?: boolean;

  // Dispositivo
  videoStandard?: 'NTSC' | 'PAL';
  timezone?: string;
  operationMode?: 'ALL_DAYS' | 'SCHEDULED';
  operationTime?: string;

  // Manutenção
  maintenanceDate?: string;
}

// Mock data
const MOCK_CAMERA_CONFIGS: Record<string, CameraConfiguration> = {
  '1': {
    id: 'config-1',
    cameraId: '1',
    codec: {
      codecType: CodecType.VIDEO_ONLY,
      resolution: Resolution.HD,
      encoder: Encoder.H264,
      fps: 12,
      frameTime: 24,
      displayOSD: 'Câmera Entrada Principal',
      streamType: StreamType.MAIN_STREAM,
      bitRateType: BitRateType.CBR,
      bitRate: 1024
    },
    image: {
      brightness: 138,
      contrast: 128,
      saturation: 120
    },
    ai: {
      enableAI: true,
      recordOnMotionOnly: false,
      faceDetect: false,
      motionContours: true
    },
    device: {
      videoStandard: VideoStandard.NTSC,
      timezone: 'GMT-3:00',
      operationMode: OperationMode.ALL_DAYS,
      operationTime: '02:00'
    },
    maintenanceDate: '2025-03-15',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    updatedBy: '1',
    updatedByName: 'Admin Master'
  },
  '2': {
    id: 'config-2',
    cameraId: '2',
    codec: {
      codecType: CodecType.VIDEO_AUDIO,
      resolution: Resolution.FULL_HD,
      encoder: Encoder.H265,
      fps: 25,
      frameTime: 50,
      displayOSD: 'Câmera Estacionamento',
      streamType: StreamType.MAIN_STREAM,
      bitRateType: BitRateType.VBR,
      bitRate: 2048
    },
    image: {
      brightness: 145,
      contrast: 135,
      saturation: 125
    },
    ai: {
      enableAI: true,
      recordOnMotionOnly: true,
      faceDetect: false,
      motionContours: true
    },
    device: {
      videoStandard: VideoStandard.NTSC,
      timezone: 'GMT-3:00',
      operationMode: OperationMode.SCHEDULED,
      operationTime: '18:00'
    },
    maintenanceDate: '2025-04-20',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: new Date().toISOString(),
    updatedBy: '1',
    updatedByName: 'Admin Master'
  },
  '3': {
    id: 'config-3',
    cameraId: '3',
    codec: {
      codecType: CodecType.VIDEO_ONLY,
      resolution: Resolution.HD,
      encoder: Encoder.H264,
      fps: 15,
      frameTime: 30,
      displayOSD: 'Câmera Recepção',
      streamType: StreamType.SUB_STREAM,
      bitRateType: BitRateType.CBR,
      bitRate: 800
    },
    image: {
      brightness: 130,
      contrast: 120,
      saturation: 115
    },
    ai: {
      enableAI: false,
      recordOnMotionOnly: false,
      faceDetect: false,
      motionContours: false
    },
    device: {
      videoStandard: VideoStandard.PAL,
      timezone: 'GMT+0:00',
      operationMode: OperationMode.ALL_DAYS,
      operationTime: '03:00'
    },
    createdAt: '2024-03-05T09:00:00Z',
    updatedAt: new Date().toISOString(),
    updatedBy: '1',
    updatedByName: 'Admin Master'
  }
};

class CameraConfigService {
  /**
   * Buscar configuração de uma câmera
   */
  async getConfig(cameraId: string): Promise<CameraConfiguration> {
    console.log('🔍 [CameraConfigService] Buscando configuração da câmera:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 300));

    const config = MOCK_CAMERA_CONFIGS[cameraId];
    if (!config) {
      console.log('⚠️ [CameraConfigService] Configuração não encontrada, criando padrão');
      // Retornar configuração padrão
      return {
        id: `config-${cameraId}`,
        cameraId: cameraId,
        codec: {
          codecType: CodecType.VIDEO_ONLY,
          resolution: Resolution.HD,
          encoder: Encoder.H264,
          fps: 12,
          frameTime: 24,
          displayOSD: '',
          streamType: StreamType.MAIN_STREAM,
          bitRateType: BitRateType.CBR,
          bitRate: 1024
        },
        image: {
          brightness: 138,
          contrast: 128,
          saturation: 120
        },
        ai: {
          enableAI: false,
          recordOnMotionOnly: false,
          faceDetect: false,
          motionContours: true
        },
        device: {
          videoStandard: VideoStandard.NTSC,
          timezone: 'GMT-3:00',
          operationMode: OperationMode.ALL_DAYS,
          operationTime: '02:00'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: '1',
        updatedByName: 'Admin Master'
      };
    }

    console.log('✅ [CameraConfigService] Configuração encontrada');
    return config;
  }

  /**
   * Atualizar configuração completa
   */
  async updateConfig(cameraId: string, data: UpdateConfigDTO): Promise<CameraConfiguration> {
    console.log('✏️ [CameraConfigService] Atualizando configuração da câmera:', cameraId);
    console.log('📝 [CameraConfigService] Dados:', data);
    await new Promise(resolve => setTimeout(resolve, 800));

    const currentConfig = MOCK_CAMERA_CONFIGS[cameraId] || await this.getConfig(cameraId);

    const updatedConfig: CameraConfiguration = {
      ...currentConfig,
      codec: {
        ...currentConfig.codec,
        ...(data.codecType && { codecType: data.codecType as CodecType }),
        ...(data.resolution && { resolution: data.resolution as Resolution }),
        ...(data.encoder && { encoder: data.encoder as Encoder }),
        ...(data.fps !== undefined && { fps: data.fps }),
        ...(data.frameTime !== undefined && { frameTime: data.frameTime }),
        ...(data.displayOSD !== undefined && { displayOSD: data.displayOSD }),
        ...(data.streamType && { streamType: data.streamType as StreamType }),
        ...(data.bitRateType && { bitRateType: data.bitRateType as BitRateType }),
        ...(data.bitRate !== undefined && { bitRate: data.bitRate })
      },
      image: {
        ...currentConfig.image,
        ...(data.brightness !== undefined && { brightness: data.brightness }),
        ...(data.contrast !== undefined && { contrast: data.contrast }),
        ...(data.saturation !== undefined && { saturation: data.saturation })
      },
      ai: {
        ...currentConfig.ai,
        ...(data.enableAI !== undefined && { enableAI: data.enableAI }),
        ...(data.recordOnMotionOnly !== undefined && { recordOnMotionOnly: data.recordOnMotionOnly }),
        ...(data.faceDetect !== undefined && { faceDetect: data.faceDetect }),
        ...(data.motionContours !== undefined && { motionContours: data.motionContours })
      },
      device: {
        ...currentConfig.device,
        ...(data.videoStandard && { videoStandard: data.videoStandard as VideoStandard }),
        ...(data.timezone && { timezone: data.timezone }),
        ...(data.operationMode && { operationMode: data.operationMode as OperationMode }),
        ...(data.operationTime && { operationTime: data.operationTime })
      },
      ...(data.maintenanceDate !== undefined && { maintenanceDate: data.maintenanceDate }),
      updatedAt: new Date().toISOString(),
      updatedBy: '1',
      updatedByName: 'Admin Master'
    };

    console.log('✅ [CameraConfigService] Configuração atualizada (simulado)');
    return updatedConfig;
  }

  /**
   * Atualizar apenas configuração de CODEC
   */
  async updateCodec(cameraId: string, codec: Partial<CodecConfig>): Promise<CameraConfiguration> {
    console.log('🎬 [CameraConfigService] Atualizando CODEC da câmera:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 500));

    return this.updateConfig(cameraId, {
      codecType: codec.codecType,
      resolution: codec.resolution,
      encoder: codec.encoder,
      fps: codec.fps,
      frameTime: codec.frameTime,
      displayOSD: codec.displayOSD,
      streamType: codec.streamType,
      bitRateType: codec.bitRateType,
      bitRate: codec.bitRate
    });
  }

  /**
   * Atualizar apenas ajustes de imagem
   */
  async updateImage(cameraId: string, image: Partial<ImageAdjustment>): Promise<CameraConfiguration> {
    console.log('🖼️ [CameraConfigService] Atualizando ajustes de imagem:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 300));

    return this.updateConfig(cameraId, {
      brightness: image.brightness,
      contrast: image.contrast,
      saturation: image.saturation
    });
  }

  /**
   * Atualizar apenas configurações de IA
   */
  async updateAI(cameraId: string, ai: Partial<AIConfig>): Promise<CameraConfiguration> {
    console.log('🤖 [CameraConfigService] Atualizando configurações de IA:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 400));

    return this.updateConfig(cameraId, {
      enableAI: ai.enableAI,
      recordOnMotionOnly: ai.recordOnMotionOnly,
      faceDetect: ai.faceDetect,
      motionContours: ai.motionContours
    });
  }

  /**
   * Atualizar apenas informações de dispositivo
   */
  async updateDevice(cameraId: string, device: Partial<DeviceInfo>): Promise<CameraConfiguration> {
    console.log('📱 [CameraConfigService] Atualizando informações de dispositivo:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 400));

    return this.updateConfig(cameraId, {
      videoStandard: device.videoStandard,
      timezone: device.timezone,
      operationMode: device.operationMode,
      operationTime: device.operationTime
    });
  }

  /**
   * ⚠️ Bloquear câmera (desabilitar temporariamente)
   */
  async lockCamera(cameraId: string): Promise<void> {
    console.log('🔒 [CameraConfigService] Bloqueando câmera:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✅ [CameraConfigService] Câmera bloqueada (simulado)');
  }

  /**
   * ⚠️ Reiniciar câmera (reboot via ONVIF)
   */
  async rebootCamera(cameraId: string): Promise<void> {
    console.log('🔄 [CameraConfigService] Reiniciando câmera:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simula reboot demorado
    console.log('✅ [CameraConfigService] Câmera reiniciada (simulado)');
  }

  /**
   * Resetar configuração para padrão de fábrica
   */
  async resetToFactory(cameraId: string): Promise<CameraConfiguration> {
    console.log('🏭 [CameraConfigService] Resetando para padrão de fábrica:', cameraId);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const factoryConfig: CameraConfiguration = {
      id: `config-${cameraId}`,
      cameraId: cameraId,
      codec: {
        codecType: CodecType.VIDEO_ONLY,
        resolution: Resolution.HD,
        encoder: Encoder.H264,
        fps: 12,
        frameTime: 24,
        displayOSD: '',
        streamType: StreamType.MAIN_STREAM,
        bitRateType: BitRateType.CBR,
        bitRate: 1024
      },
      image: {
        brightness: 128,
        contrast: 128,
        saturation: 128
      },
      ai: {
        enableAI: false,
        recordOnMotionOnly: false,
        faceDetect: false,
        motionContours: false
      },
      device: {
        videoStandard: VideoStandard.NTSC,
        timezone: 'GMT-3:00',
        operationMode: OperationMode.ALL_DAYS,
        operationTime: '02:00'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: '1',
      updatedByName: 'Admin Master'
    };

    console.log('✅ [CameraConfigService] Configuração resetada para padrão de fábrica');
    return factoryConfig;
  }
}

export const cameraConfigService = new CameraConfigService();
