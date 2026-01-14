import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Brain,
  FileChartColumn,
  LayoutDashboard,
  ScrollText,
  Settings2,
  Users2,
  Building2,
  ShieldCheck,
  Shield,
  Wrench,
  Camera,
  AlertTriangle,
  Bell,
  Lock,
  Clock,
  Ticket,
  Search,
  Video,
  Play,
  MapPin,
  Server,
  HardDrive,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'
import logoFull from '@/assets/logo-unifique-full.svg'
import logoMark from '@/assets/logo-unifique-mark.svg'

type AdminNavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  roles?: SystemRole[]
  section: string
}

const adminNavItems: AdminNavItem[] = [
  // ============ PRINCIPAL ============
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard', section: 'Principal' },
  { label: 'Investigação', icon: Search, to: '/admin/investigacao', section: 'Principal' },

  // ============ MONITORAMENTO ============
  { label: 'Câmeras', icon: Camera, to: '/admin/cameras', section: 'Monitoramento' },
  { label: 'Ao Vivo', icon: Video, to: '/admin/videowall', section: 'Monitoramento' },
  { label: 'Gravações', icon: Play, to: '/admin/investigacao', section: 'Monitoramento' },

  // ============ ESTRUTURA ============
  {
    label: 'Clientes',
    icon: Building2,
    to: '/admin/tenants',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN],
    section: 'Estrutura',
  },
  {
    label: 'Locais e Áreas',
    icon: MapPin,
    to: '/admin/sites',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN, SystemRole.CLIENT_MASTER],
    section: 'Estrutura',
  },

  // ============ GESTÃO DE USUÁRIOS ============
  { label: 'Usuários', icon: Users2, to: '/admin/users', section: 'Gestão de Usuários' },
  {
    label: 'Administradores',
    icon: Shield,
    to: '/admin/admins',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Gestão de Usuários',
  },
  {
    label: 'Técnicos',
    icon: Wrench,
    to: '/admin/technicians',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN],
    section: 'Gestão de Usuários',
  },
  {
    label: 'Níveis de Acesso',
    icon: ShieldCheck,
    to: '/admin/access-levels',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Gestão de Usuários',
  },
  {
    label: 'Controle de Acesso',
    icon: Lock,
    to: '/admin/access-control',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Gestão de Usuários',
  },

  // ============ INTELIGÊNCIA ============
  { label: 'IA & Alertas', icon: Brain, to: '/admin/ai-alerts', section: 'Inteligência' },
  {
    label: 'Notificações',
    icon: Bell,
    to: '/admin/notifications',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Inteligência',
  },

  // ============ INFRAESTRUTURA ============
  {
    label: 'Infraestrutura',
    icon: Server,
    to: '/admin/infrastructure',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Infraestrutura',
  },
  {
    label: 'Políticas de Gravação',
    icon: HardDrive,
    to: '/admin/recording-policies',
    roles: [SystemRole.ADMIN_MASTER, SystemRole.ADMIN],
    section: 'Infraestrutura',
  },
  {
    label: 'Diagnóstico',
    icon: AlertTriangle,
    to: '/admin/diagnostics',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Infraestrutura',
  },

  // ============ SUPORTE ============
  {
    label: 'Acesso Temporário',
    icon: Clock,
    to: '/admin/technician-access',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Suporte',
  },
  {
    label: 'Incidentes',
    icon: Ticket,
    to: '/admin/incidents',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Suporte',
  },
  { label: 'Relatórios', icon: FileChartColumn, to: '/admin/reports', section: 'Suporte' },
  {
    label: 'Auditoria',
    icon: ScrollText,
    to: '/admin/audit',
    roles: [SystemRole.ADMIN_MASTER],
    section: 'Suporte',
  },

  // ============ SISTEMA ============
  { label: 'Configurações', icon: Settings2, to: '/admin/settings', section: 'Sistema' },
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

  // Filtrar itens baseado no role
  const items = adminNavItems.filter((item) => !item.roles || (role && item.roles.includes(role)))

  // Agrupar items por seção
  const sections = items.reduce(
    (acc, item) => {
      const section = item.section
      if (!acc[section]) acc[section] = []
      acc[section].push(item)
      return acc
    },
    {} as Record<string, AdminNavItem[]>,
  )

  // Label do role para o footer
  const roleLabel = role ? ROLE_LABELS[role] : 'Usuário'

  return (
    <div className={cn('flex h-full flex-col text-sm', isCompact && 'items-center px-0 text-xs')}>
      {/* Logo */}
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

      {/* Navigation com seções */}
      <nav className={cn('flex-1 space-y-4 overflow-y-auto px-2 pb-4', isCompact && 'px-1 space-y-2')}>
        {Object.entries(sections).map(([section, sectionItems]) => (
          <div key={section}>
            {!isCompact && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                {section}
              </p>
            )}
            <div className="space-y-1">
              {sectionItems.map((item) => (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-white shadow-inner'
                        : 'text-white/70 hover:bg-white/5 hover:text-white',
                      isCompact && 'px-2 justify-center',
                    )
                  }
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
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
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          'mt-auto border-t border-white/10 px-4 py-4 text-xs text-white/60',
          isCompact && 'px-0 text-center text-[10px]',
        )}
      >
        <p>VMS Unifique v0.1.0</p>
        <p className="text-white/40">{roleLabel}</p>
      </div>
    </div>
  )
}
