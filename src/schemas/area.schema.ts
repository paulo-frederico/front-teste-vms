import { z } from 'zod';

export const areaSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  description: z.string()
    .max(500, 'Descrição muito longa')
    .optional()
    .or(z.literal('')),
  type: z.enum([
    'RECEPTION',
    'PARKING',
    'PRODUCTION',
    'WAREHOUSE',
    'HALLWAY',
    'ROOM',
    'EXTERNAL',
    'ENTRANCE',
    'EXIT',
    'LOADING_DOCK',
    'CAFETERIA',
    'RESTROOM',
    'STAIRS',
    'ELEVATOR',
    'OTHER'
  ], {
    errorMap: () => ({ message: 'Tipo de área é obrigatório' })
  }),
  siteId: z.string().min(1, 'Local é obrigatório'),
  floor: z.string().optional().or(z.literal('')),
  capacity: z.number()
    .min(1, 'Capacidade mínima: 1 pessoa')
    .optional(),
  squareMeters: z.number()
    .min(1, 'Área mínima: 1 m²')
    .optional()
});

export type AreaFormData = z.infer<typeof areaSchema>;

export const defaultAreaValues: Partial<AreaFormData> = {
  name: '',
  description: '',
  type: 'ROOM',
  siteId: '',
  floor: '',
  capacity: undefined,
  squareMeters: undefined
};
