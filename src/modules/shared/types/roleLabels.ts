import { SystemRole } from '@/modules/shared/types/auth'

export const ROLE_LABELS: Record<SystemRole, string> = {
  [SystemRole.ADMIN_MASTER]: 'Admin Master',
  [SystemRole.ADMIN]: 'Admin',
  [SystemRole.TECHNICIAN]: 'Técnico',
  [SystemRole.CLIENT_MASTER]: 'Cliente Master',
  [SystemRole.MANAGER]: 'Gerente',
  [SystemRole.VIEWER]: 'Visualizador',
}
