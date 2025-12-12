import { z } from 'zod';

/**
 * Schema de validação para Admin
 * Admin Master usa este schema para criar/editar outros Admins
 */
export const adminSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  phone: z.string()
    .regex(/^\(?\d{2}\)? \d{4,5}-\d{4}$/, 'Telefone inválido (ex: (11) 98765-4321)')
    .optional()
    .or(z.literal('')),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter ao menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter ao menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter ao menos um número')
    .optional(), // Opcional na edição
  confirmPassword: z.string().optional()
}).refine(
  (data) => {
    // Se senha foi preenchida, confirmação deve ser igual
    if (data.password && data.password.length > 0) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  }
);

/**
 * Tipo inferido do schema
 */
export type AdminFormData = z.infer<typeof adminSchema>;

/**
 * Valores padrão para novo admin
 */
export const defaultAdminValues: Partial<AdminFormData> = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
};
