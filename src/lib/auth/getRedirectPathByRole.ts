import { SystemRole } from '@/modules/shared/types/auth'

export function getRedirectPathByRole(role: string): string {
  switch (role) {
    case SystemRole.ADMIN_MASTER:
      return '/admin-master/dashboard'
    case SystemRole.ADMIN:
      return '/admin/dashboard'
    case SystemRole.TECHNICIAN:
      return '/technician/dashboard'
    case SystemRole.CLIENT_MASTER:
      return '/client/dashboard'
    case SystemRole.MANAGER:
      return '/manager/dashboard'
    case SystemRole.VIEWER:
      return '/viewer/live'
    default:
      return '/'
  }
}
