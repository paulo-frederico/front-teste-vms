import { z } from 'zod';

/**
 * Validação de CNPJ
 */
function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

  if (cleanCNPJ.length !== 14) return false;

  // Validação básica (todos os dígitos iguais)
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Validação dos dígitos verificadores
  let tamanho = cleanCNPJ.length - 2;
  let numeros = cleanCNPJ.substring(0, tamanho);
  const digitos = cleanCNPJ.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cleanCNPJ.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
}

/**
 * Schema de endereço
 */
const addressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter no mínimo 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, 'Bairro deve ter no mínimo 3 caracteres'),
  city: z.string().min(3, 'Cidade deve ter no mínimo 3 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres (ex: SP)'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido (ex: 12345-678)')
});

/**
 * Schema de dados fiscais
 */
const fiscalDataSchema = z.object({
  cnpj: z.string()
    .min(1, 'CNPJ é obrigatório')
    .refine(validateCNPJ, 'CNPJ inválido'),
  companyName: z.string().min(3, 'Razão social deve ter no mínimo 3 caracteres'),
  stateRegistration: z.string().optional(),
  address: addressSchema
});

/**
 * Schema de contato principal
 */
const primaryContactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(?\d{2}\)? \d{4,5}-\d{4}$/, 'Telefone inválido (ex: (11) 98765-4321)'),
  position: z.string().optional()
});

/**
 * Schema de limites
 */
const limitsSchema = z.object({
  maxCameras: z.number().min(1, 'Mínimo 1 câmera').max(1000, 'Máximo 1000 câmeras'),
  maxSites: z.number().min(1, 'Mínimo 1 site').max(100, 'Máximo 100 sites'),
  maxUsers: z.number().min(1, 'Mínimo 1 usuário').max(500, 'Máximo 500 usuários'),
  retentionDays: z.number().min(1, 'Mínimo 1 dia').max(365, 'Máximo 365 dias'),
  maxStreamQuality: z.enum(['SD', 'HD', 'FULLHD', '4K']),
  allowedAIModules: z.array(z.string()),
  storageGB: z.number().min(10, 'Mínimo 10GB').max(10000, 'Máximo 10TB')
});

/**
 * Schema completo do Tenant
 */
export const tenantSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),
  plan: z.enum(['BASIC', 'PROFESSIONAL', 'ENTERPRISE'], {
    message: 'Plano inválido'
  }),
  limits: limitsSchema,
  fiscalData: fiscalDataSchema,
  primaryContact: primaryContactSchema,
  contractDate: z.string().min(1, 'Data de contrato é obrigatória'),
  expirationDate: z.string().min(1, 'Data de expiração é obrigatória')
}).refine(
  (data) => new Date(data.expirationDate) > new Date(data.contractDate),
  {
    message: 'Data de expiração deve ser posterior à data de contrato',
    path: ['expirationDate']
  }
);

/**
 * Tipo inferido do schema
 */
export type TenantFormData = z.infer<typeof tenantSchema>;

/**
 * Valores padrão para novo tenant
 */
export const defaultTenantValues: Partial<TenantFormData> = {
  plan: 'BASIC',
  limits: {
    maxCameras: 10,
    maxSites: 1,
    maxUsers: 5,
    retentionDays: 7,
    maxStreamQuality: 'HD',
    allowedAIModules: [],
    storageGB: 100
  },
  contractDate: new Date().toISOString().split('T')[0],
  expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
};
