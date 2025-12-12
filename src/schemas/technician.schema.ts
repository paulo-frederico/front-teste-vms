import { z } from 'zod';

/**
 * Schema de validação para Técnico
 */
export const technicianSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  phone: z.string()
    .regex(/^\d{2} \d{4,5}-\d{4}$/, 'Telefone inválido (ex: (11) 98765-4321)'),
  specialty: z.enum(['INSTALLATION', 'NETWORK', 'ONVIF_CONFIG', 'MAINTENANCE', 'TROUBLESHOOTING', 'ALL'], {
    message: 'Especialidade inválida'
  }),
  region: z.string()
    .min(3, 'Região deve ter no mínimo 3 caracteres')
    .optional()
    .or(z.literal('')),
  assignedTenants: z.array(z.string())
    .min(1, 'Selecione ao menos um cliente')
});

/**
 * Tipo inferido do schema
 */
export type TechnicianFormData = z.infer<typeof technicianSchema>;

/**
 * Valores padrão para novo técnico
 */
export const defaultTechnicianValues: Partial<TechnicianFormData> = {
  name: '',
  email: '',
  phone: '',
  specialty: 'ALL',
  region: '',
  assignedTenants: []
};

/**
 * Schema para conceder acesso temporário
 */
export const grantAccessSchema = z.object({
  technicianId: z.string().min(1, 'Técnico é obrigatório'),
  tenantId: z.string().min(1, 'Cliente é obrigatório'),
  durationMinutes: z.number()
    .min(5, 'Duração mínima: 5 minutos')
    .max(480, 'Duração máxima: 8 horas (480 minutos)'),
  reason: z.string()
    .min(10, 'Motivo deve ter no mínimo 10 caracteres')
    .max(500, 'Motivo muito longo'),
  allowedActions: z.array(z.string())
    .min(1, 'Selecione ao menos uma ação permitida'),
  cameraIds: z.array(z.string()).optional(),
  siteIds: z.array(z.string()).optional()
});

/**
 * Tipo inferido do schema de acesso temporário
 */
export type GrantAccessFormData = z.infer<typeof grantAccessSchema>;

/**
 * Valores padrão para conceder acesso
 */
export const defaultGrantAccessValues: Partial<GrantAccessFormData> = {
  technicianId: '',
  tenantId: '',
  durationMinutes: 60, // 1 hora por padrão
  reason: '',
  allowedActions: ['install_camera', 'test_connection', 'configure_onvif'],
  cameraIds: [],
  siteIds: []
};
