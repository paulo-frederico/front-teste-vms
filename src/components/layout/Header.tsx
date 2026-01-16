import type { ComponentProps } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Bell, ChevronDown, CreditCard, LogOut, Menu, Settings, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { UserSummary } from '@/modules/shared/types/auth'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'
import logoFull from '@/assets/logo-unifique-full.svg'

type HeaderProps = {
  user: UserSummary
  notificationsCount?: number
  onToggleSidebar?: () => void
  onLogout?: () => void
}

const roleAccent: Record<SystemRole, string> = {
  [SystemRole.ADMIN_MASTER]: 'bg-brand-primary/10 text-brand-primary',
  [SystemRole.ADMIN]: 'bg-brand-primary/10 text-brand-primary',
  [SystemRole.TECHNICIAN]: 'bg-sky-100 text-sky-600',
  [SystemRole.CLIENT_MASTER]: 'bg-emerald-100 text-emerald-600',
  [SystemRole.MANAGER]: 'bg-amber-100 text-amber-600',
  [SystemRole.VIEWER]: 'bg-slate-200 text-slate-600',
}

export function Header({
  user,
  notificationsCount = 4,
  onToggleSidebar,
  onLogout,
}: HeaderProps) {
  const initials = user.name
    .split(' ')
    .map((name) => name.charAt(0))
    .slice(0, 2)
    .join('')
  const roleLabel = ROLE_LABELS[user.role] ?? user.role.replace(/_/g, ' ')
  const hasNotifications = notificationsCount > 0

  return (
    <TooltipProvider delayDuration={120}>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#F8FAFC]/90 shadow-[0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur supports-[backdrop-filter]:bg-[#F8FAFC]/75">
        <div className="flex h-16 items-center justify-between px-4 text-slate-900 lg:px-8">
          <div className="flex flex-1 items-center gap-4">
            {onToggleSidebar ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 hover:bg-white hover:text-slate-900 lg:hidden"
                onClick={onToggleSidebar}
                aria-label="Abrir navegação lateral"
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : null}
            <div className="flex items-center">
              <img src={logoFull} alt="VMS Unifique" className="h-10" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-white/70 text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-200 hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 active:scale-95"
                  aria-label="Abrir notificações"
                >
                  <Bell className="h-5 w-5" />
                  <AnimatePresence>
                    {hasNotifications && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white shadow-sm"
                      >
                        {notificationsCount > 9 ? '9+' : notificationsCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={12}>Notificações do sistema</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-left shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 active:scale-[0.98]"
                >
                  <div className="hidden text-right md:block">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {user.tenantName ? `${roleLabel} · ${user.tenantName}` : roleLabel}
                    </span>
                  </div>
                  <motion.div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold uppercase',
                      roleAccent[user.role],
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {initials}
                  </motion.div>
                  <ChevronDown className="hidden h-4 w-4 text-slate-400 transition group-hover:text-slate-600 md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <UserRound className="h-4 w-4 text-slate-400" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <ShieldIcon className="h-4 w-4 text-slate-400" /> Alterar senha
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="h-4 w-4 text-slate-400" /> Preferências
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" /> Faturamento
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                  onSelect={(event: Event) => {
                    event.preventDefault()
                    onLogout?.()
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}

const ShieldIcon = (props: ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    aria-hidden
    {...props}
  >
    <path
      d="M20 7.5c0 7.5-4.2 11-7.3 12.3-.45.18-.95.18-1.4 0C8.2 18.5 4 15 4 7.5L12 4l8 3.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.5 11.5 11 13l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
