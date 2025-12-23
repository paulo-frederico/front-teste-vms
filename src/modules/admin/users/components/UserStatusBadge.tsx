import { cn } from '@/lib/utils'
import { UserStatus } from '@/modules/shared/types/auth'
import type { AdminUserStatus } from '@/modules/admin/users/mockUsers'

type StatusValue = UserStatus | AdminUserStatus

const STATUS_LABELS: Record<string, string> = {
  // Enum uppercase
  [UserStatus.ACTIVE]: 'Ativo',
  [UserStatus.SUSPENDED]: 'Suspenso',
  [UserStatus.INACTIVE]: 'Inativo',
  // Legacy lowercase
  active: 'Ativo',
  suspended: 'Suspenso',
  pending: 'Pendente',
  invited: 'Convite enviado',
}

const STATUS_STYLES: Record<string, string> = {
  // Enum uppercase
  [UserStatus.ACTIVE]: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  [UserStatus.SUSPENDED]: 'bg-rose-50 text-rose-700 border border-rose-100',
  [UserStatus.INACTIVE]: 'bg-slate-50 text-slate-700 border border-slate-100',
  // Legacy lowercase
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  suspended: 'bg-rose-50 text-rose-700 border border-rose-100',
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  invited: 'bg-sky-50 text-sky-700 border border-sky-100',
}

export function UserStatusBadge({ status, className }: { status: StatusValue; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
