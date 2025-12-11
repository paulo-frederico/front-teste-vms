import { cn } from '@/lib/utils'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'

const ROLE_STYLES: Record<SystemRole, string> = {
  [SystemRole.ADMIN_MASTER]: 'bg-sky-100 text-sky-800 border border-sky-200',
  [SystemRole.ADMIN]: 'bg-violet-100 text-violet-800 border border-violet-200',
  [SystemRole.TECHNICIAN]: 'bg-amber-100 text-amber-800 border border-amber-200',
  [SystemRole.CLIENT_MASTER]: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  [SystemRole.MANAGER]: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
  [SystemRole.VIEWER]: 'bg-slate-100 text-slate-700 border border-slate-200',
}

export function UserRoleBadge({ role, className }: { role: SystemRole; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        ROLE_STYLES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
