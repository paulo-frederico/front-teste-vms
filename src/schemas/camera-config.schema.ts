import { z } from 'zod';

/**
 * Schema de validação para Configurações de Câmera
 */
export const cameraConfigSchema = z.object({
  // Seção 1: Configurar CODEC
  codecType: z.enum(['VIDEO_ONLY', 'VIDEO_AUDIO'], {
    message: 'Tipo de codec inválido'
  }),
  resolution: z.enum(['CIF', 'D1', 'HD', 'FULL_HD', 'QHD', 'UHD_4K', 'UHD_8K'], {
    message: 'Resolução inválida'
  }),
  encoder: z.enum(['H264', 'H265', 'MJPEG'], {
    message: 'Encoder inválido'
  }),
  fps: z.number()
    .min(1, 'FPS mínimo: 1')
    .max(30, 'FPS máximo: 30'),
  frameTime: z.number()
    .min(2, 'Frame time mínimo: 2')
    .max(60, 'Frame time máximo: 60'),
  displayOSD: z.string()
    .min(1, 'Display OSD é obrigatório')
    .max(50, 'Display OSD muito longo'),
  streamType: z.enum(['MAIN_STREAM', 'SUB_STREAM'], {
    message: 'Tipo de stream inválido'
  }),
  bitRateType: z.enum(['CBR', 'VBR'], {
    message: 'Tipo de bit rate inválido'
  }),
  bitRate: z.number()
    .min(512, 'Bit rate mínimo: 512 Kbps')
    .max(8192, 'Bit rate máximo: 8192 Kbps'),

  // Seção 2: Ajuste de Imagem
  brightness: z.number()
    .min(0, 'Brilho mínimo: 0')
    .max(255, 'Brilho máximo: 255'),
  contrast: z.number()
    .min(0, 'Contraste mínimo: 0')
    .max(255, 'Contraste máximo: 255'),
  saturation: z.number()
    .min(0, 'Saturação mínima: 0')
    .max(255, 'Saturação máxima: 255'),

  // Seção 3: Configurações de IA
  enableAI: z.boolean(),
  recordOnMotionOnly: z.boolean(),
  faceDetect: z.boolean(),
  motionContours: z.boolean(),

  // Seção 4: Informação de Dispositivo
  videoStandard: z.enum(['NTSC', 'PAL'], {
    message: 'Padrão de vídeo inválido'
  }),
  timezone: z.string().min(1, 'Fuso horário é obrigatório'),
  operationMode: z.enum(['ALL_DAYS', 'SCHEDULED'], {
    message: 'Modo de operação inválido'
  }),
  operationTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido (HH:mm)'),

  // Seção 5: Data de Manutenção
  maintenanceDate: z.string()
    .optional()
    .or(z.literal(''))
});

/**
 * Tipo inferido do schema
 */
export type CameraConfigFormData = z.infer<typeof cameraConfigSchema>;

/**
 * Valores padrão para configuração de câmera
 */
export const defaultCameraConfigValues: Partial<CameraConfigFormData> = {
  // CODEC
  codecType: 'VIDEO_ONLY',
  resolution: 'HD',
  encoder: 'H264',
  fps: 12,
  frameTime: 24, // FPS x 2
  displayOSD: '',
  streamType: 'MAIN_STREAM',
  bitRateType: 'CBR',
  bitRate: 1024,

  // Imagem
  brightness: 138,
  contrast: 128,
  saturation: 120,

  // IA
  enableAI: false,
  recordOnMotionOnly: false,
  faceDetect: false,
  motionContours: true,

  // Dispositivo
  videoStandard: 'NTSC',
  timezone: 'GMT-3:00',
  operationMode: 'ALL_DAYS',
  operationTime: '02:00',

  // Manutenção
  maintenanceDate: ''
};

/**
 * Helper: Validar se FPS e Frame Time estão sincronizados
 */
export const validateFrameTimeSync = (fps: number, frameTime: number): boolean => {
  return frameTime === fps * 2;
};
