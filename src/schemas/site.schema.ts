import { z } from 'zod';

export const siteSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  description: z.string()
    .max(500, 'Descrição muito longa')
    .optional()
    .or(z.literal('')),
  type: z.enum([
    'HEADQUARTERS',
    'BRANCH',
    'STORE',
    'WAREHOUSE',
    'OFFICE',
    'FACTORY',
    'DATACENTER',
    'OTHER'
  ], {
    message: 'Tipo de local é obrigatório'
  }),
  tenantId: z.string().min(1, 'Cliente é obrigatório'),
  zipCode: z.string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (formato: 00000-000)')
    .transform(val => val.replace(/\D/g, '')),
  street: z.string().min(3, 'Logradouro é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional().or(z.literal('')),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string()
    .length(2, 'Estado deve ter 2 caracteres (UF)')
    .toUpperCase(),
  country: z.string().default('Brasil'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  contactName: z.string().optional().or(z.literal('')),
  contactPhone: z.string()
    .regex(/^|$\d{2}$| \d{4,5}-\d{4}$/, 'Telefone inválido (formato: (00) 00000-0000)')
    .optional()
    .or(z.literal('')),
  contactEmail: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal(''))
});

export type SiteFormData = z.infer<typeof siteSchema>;

export const defaultSiteValues: Partial<SiteFormData> = {
  name: '',
  description: '',
  type: 'BRANCH',
  tenantId: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  country: 'Brasil',
  contactName: '',
  contactPhone: '',
  contactEmail: ''
};
