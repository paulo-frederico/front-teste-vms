import { z } from 'zod';

/**
 * Schema de validação para Câmera
 */
export const cameraSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  description: z.string()
    .max(500, 'Descrição muito longa')
    .optional()
    .or(z.literal('')),

  // Localização
  tenantId: z.string().min(1, 'Cliente é obrigatório'),
  siteId: z.string().optional().or(z.literal('')),
  areaId: z.string().optional().or(z.literal('')),

  // Conexão
  protocol: z.enum(['ONVIF', 'RTSP', 'RTMP'], {
    message: 'Protocolo inválido'
  }),
  ipAddress: z.string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      'IP inválido (ex: 192.168.1.100)'
    ),
  port: z.number()
    .min(1, 'Porta deve ser maior que 0')
    .max(65535, 'Porta deve ser menor que 65536'),

  // Credenciais
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),

  // URLs de stream
  mainStreamUrl: z.string()
    .min(1, 'URL do stream principal é obrigatória')
    .regex(/^rtsp:\/\/|^rtmp:\/\/|^http:\/\//, 'URL deve começar com rtsp://, rtmp:// ou http://'),
  subStreamUrl: z.string()
    .regex(/^rtsp:\/\/|^rtmp:\/\/|^http:\/\//, 'URL deve começar com rtsp://, rtmp:// ou http://')
    .optional()
    .or(z.literal('')),

  // Gravação
  recordingMode: z.enum(['CONTINUOUS', 'EVENT_BASED', 'SCHEDULED', 'DISABLED'], {
    message: 'Modo de gravação inválido'
  }),
  retentionDays: z.number()
    .min(1, 'Retenção mínima: 1 dia')
    .max(365, 'Retenção máxima: 365 dias')
});

/**
 * Tipo inferido do schema
 */
export type CameraFormData = z.infer<typeof cameraSchema>;

/**
 * Valores padrão para nova câmera
 */
export const defaultCameraValues: Partial<CameraFormData> = {
  name: '',
  description: '',
  tenantId: '',
  siteId: '',
  areaId: '',
  protocol: 'ONVIF',
  ipAddress: '',
  port: 554, // Porta padrão RTSP
  username: 'admin',
  password: '',
  mainStreamUrl: '',
  subStreamUrl: '',
  recordingMode: 'CONTINUOUS',
  retentionDays: 7
};

/**
 * Schema para teste de conexão
 */
export const connectionTestSchema = z.object({
  cameraId: z.string().min(1, 'Câmera é obrigatória'),
  protocol: z.enum(['ONVIF', 'RTSP', 'RTMP']),
  ipAddress: z.string().regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'IP inválido'
  ),
  port: z.number().min(1).max(65535),
  username: z.string().min(1),
  password: z.string().min(1)
});

/**
 * Tipo inferido do schema de teste
 */
export type ConnectionTestFormData = z.infer<typeof connectionTestSchema>;

/**
 * Helper: Gerar URL de stream baseado no protocolo
 */
export const generateStreamUrl = (
  protocol: 'ONVIF' | 'RTSP' | 'RTMP',
  ipAddress: string,
  port: number,
  username: string,
  password: string,
  streamPath: string = '/stream1'
): string => {
  switch (protocol) {
    case 'RTSP':
      return `rtsp://${username}:${password}@${ipAddress}:${port}${streamPath}`;
    case 'RTMP':
      return `rtmp://${ipAddress}:${port}${streamPath}`;
    case 'ONVIF':
      return `http://${ipAddress}:${port}/onvif/device_service`;
    default:
      return '';
  }
};

/**
 * Helper: Validar formato de URL de stream
 */
export const validateStreamUrl = (url: string): boolean => {
  const rtspRegex = /^rtsp:\/\/.+/;
  const rtmpRegex = /^rtmp:\/\/.+/;
  const httpRegex = /^http:\/\/.+/;

  return rtspRegex.test(url) || rtmpRegex.test(url) || httpRegex.test(url);
};

/**
 * Helper: Extrair informações de URL de stream
 */
export const parseStreamUrl = (url: string): {
  protocol: string;
  host: string;
  port: number;
  path: string;
} | null => {
  try {
    const urlObj = new URL(url);
    return {
      protocol: urlObj.protocol.replace(':', ''),
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || (urlObj.protocol === 'rtsp:' ? 554 : 80),
      path: urlObj.pathname
    };
  } catch {
    return null;
  }
};
