import { z } from 'zod';

/**
 * Schema de validação para Solicitação de Acesso LGPD
 */
export const cameraAccessRequestSchema = z.object({
  cameraId: z.string().min(1, 'Câmera é obrigatória'),
  reason: z.enum([
    'TECHNICAL_SUPPORT',
    'INCIDENT_INVESTIGATION',
    'CLIENT_REQUEST',
    'COMPLIANCE_AUDIT',
    'INFRASTRUCTURE_MONITORING'
  ], {
    message: 'Motivo é obrigatório'
  }),
  description: z.string()
    .min(20, 'Descrição deve ter no mínimo 20 caracteres')
    .max(500, 'Descrição muito longa'),
  ticketNumber: z.string()
    .optional()
    .or(z.literal(''))
});

export type CameraAccessRequestFormData = z.infer<typeof cameraAccessRequestSchema>;

export const defaultCameraAccessRequestValues: Partial<CameraAccessRequestFormData> = {
  cameraId: '',
  reason: 'TECHNICAL_SUPPORT',
  description: '',
  ticketNumber: ''
};
