import { Menu, Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UserSummary } from '@/modules/shared/types/auth'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'

export type TopbarProps = {
  user: UserSummary
  onToggleSidebar?: () => void
  onLogout?: () => void
}

const roleBadgeClass: Record<SystemRole, string> = {
  [SystemRole.ADMIN_MASTER]: 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary',
  [SystemRole.ADMIN]: 'border-brand-primary/30 bg-brand-primary/5 text-brand-primary',
  [SystemRole.TECHNICIAN]: 'border-sky-400/40 bg-sky-50 text-sky-600',
  [SystemRole.CLIENT_MASTER]: 'border-emerald-400/50 bg-emerald-100 text-emerald-700',
  [SystemRole.MANAGER]: 'border-amber-300/50 bg-amber-50 text-amber-700',
  [SystemRole.VIEWER]: 'border-slate-300 bg-slate-100 text-slate-600',
}

export function Topbar({ user, onToggleSidebar, onLogout }: TopbarProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
  const roleLabel = ROLE_LABELS[user.role] ?? user.role.replace(/_/g, ' ')

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleSidebar} aria-label="Abrir menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="leading-tight">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">VMS Unifique</p>
          <p className="text-lg font-semibold text-brand-deep">Portal Operacional</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 block h-2 w-2 rounded-full bg-accent" />
        </Button>
        <div className="flex items-center gap-3 rounded-full border px-3 py-1.5">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
                  roleBadgeClass[user.role],
                )}
              >
                {roleLabel}
              </span>
            </div>
            {onLogout ? (
              <Button
                variant="ghost"
                className="h-auto px-0 text-xs font-semibold text-brand-primary hover:text-brand-primary/80"
                onClick={onLogout}
              >
                Sair
              </Button>
            ) : null}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
