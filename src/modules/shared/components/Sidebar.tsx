import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Brain,
  Camera,
  FileChartColumn,
  LayoutDashboard,
  ScrollText,
  Settings2,
  Users2,
  Building2,
  ShieldCheck,
  Shield,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { SystemRole } from '@/modules/shared/types/auth'
import logoFull from '@/assets/logo-unifique-full.svg'
import logoMark from '@/assets/logo-unifique-mark.svg'

type AdminNavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  roles?: SystemRole[]
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  {
    label: 'Clientes',
    icon: Building2,
    to: '/admin/tenants',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN],
  },
  { label: 'Usuários & Permissões', icon: Users2, to: '/admin/users' },
  {
    label: 'Administradores',
    icon: Shield,
    to: '/admin/admins',
    roles: [SystemRole.ADMIN_MASTER],
  },
  {
    label: 'Técnicos',
    icon: Wrench,
    to: '/admin/technicians',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN],
  },
  {
    label: 'Locais & Câmeras',
    icon: Camera,
    to: '/admin/cameras',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN, SystemRole.CLIENT_MASTER],
  },
  { label: 'IA & Alertas', icon: Brain, to: '/admin/ai-alerts' },
  {
    label: 'Auditoria & Trilhas',
    icon: ScrollText,
    to: '/admin/audit',
    roles: [SystemRole.ADMIN_MASTER],
  },
  { label: 'Relatórios & Auditoria', icon: FileChartColumn, to: '/admin/reports' },
  {
    label: 'Níveis de Acesso',
    icon: ShieldCheck,
    to: '/admin/access-levels',
    roles: [SystemRole.ADMIN_MASTER],
  },
  { label: 'Configurações do Sistema', icon: Settings2, to: '/admin/settings' },
]

export type SidebarProps = {
  onNavigate?: () => void
  role?: SystemRole
  isCompact?: boolean
}

export function Sidebar({ onNavigate, role, isCompact = false }: SidebarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const logoSrc = isCompact ? logoMark : logoFull
  const logoFailed = failedSrc === logoSrc
  const logoWrapperClass = cn(
    'mx-auto flex items-center justify-center transition-all duration-200 ease-out',
    !isCompact && 'rounded-lg bg-white px-3 py-2 shadow-sm',
  )
  const fallbackTextClass = cn(
    'font-semibold uppercase tracking-wide',
    isCompact ? 'text-[10px] text-white' : 'text-base text-[#212492]',
  )

  const items = adminNavItems.filter((item) => !item.roles || (role && item.roles.includes(role)))

  return (
    <div className={cn('flex h-full flex-col text-sm', isCompact && 'items-center px-0 text-xs')}>
      <div className={cn('px-4 pb-4 pt-6', isCompact && 'px-2 text-center')}>
        <div className={logoWrapperClass}>
          {logoFailed ? (
            <span className={fallbackTextClass}>VMS Unifique</span>
          ) : (
            <img
              key={logoSrc}
              src={logoSrc}
              alt="Logomarca VMS Unifique"
              className={cn(isCompact ? 'h-9 w-9' : 'h-10')}
              onLoad={() => {
                if (failedSrc === logoSrc) {
                  setFailedSrc(null)
                }
              }}
              onError={() => setFailedSrc(logoSrc)}
            />
          )}
        </div>
      </div>
      <nav className={cn('flex-1 space-y-1 px-2 pb-4', isCompact && 'px-1')}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
                isCompact && 'px-2',
              )
            }
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
            <span
              className={cn(
                'origin-left overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out',
                isCompact ? 'max-w-0 opacity-0' : 'ml-1 max-w-[160px] opacity-100',
              )}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
      <div className={cn('mt-auto border-t border-white/10 px-4 py-4 text-xs text-white/60', isCompact && 'px-0 text-center text-[10px]')}>
        <p>Protótipo 0.1.0</p>
        <p className="text-white/40">Admin Master</p>
      </div>
    </div>
  )
}

