/**
 * Sidebar do Cliente (Cliente Master, Gerente e Visualizador)
 * Mostra apenas os menus permitidos para cada role
 */

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Camera,
  Video,
  Play,
  Users,
  MapPin,
  Bell,
  Brain,
  Settings,
  HelpCircle,
  Clock,
  FileText,
  Search,
  LayoutGrid,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { SystemRole } from '@/modules/shared/types/auth'
import { ROLE_LABELS } from '@/modules/shared/types/roleLabels'
import logoFull from '@/assets/logo-unifique-full.svg'
import logoMark from '@/assets/logo-unifique-mark.svg'

type ClientNavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  section: string
  roles?: SystemRole[] // Se não definido, aparece para todos
}

const clientNavItems: ClientNavItem[] = [
  // ============ PRINCIPAL ============
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/client/dashboard',
    section: 'Principal',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER], // Visualizador não vê dashboard
  },
  { label: 'Video Wall', icon: LayoutGrid, to: '/client/videowall', section: 'Principal' },
  {
    label: 'Investigação',
    icon: Search,
    to: '/client/investigacao',
    section: 'Principal',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER], // Visualizador não investiga
  },

  // ============ MONITORAMENTO ============
  {
    label: 'Câmeras',
    icon: Camera,
    to: '/client/cameras',
    section: 'Monitoramento',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER],
  },
  { label: 'Ao Vivo', icon: Video, to: '/client/live', section: 'Monitoramento' },
  {
    label: 'Gravações',
    icon: Play,
    to: '/client/playback',
    section: 'Monitoramento',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER],
  },

  // ============ ESTRUTURA ============
  {
    label: 'Locais',
    icon: MapPin,
    to: '/client/sites',
    section: 'Estrutura',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER],
  },
  {
    label: 'Usuários',
    icon: Users,
    to: '/client/users',
    section: 'Estrutura',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER], // Visualizador não gerencia usuários
  },

  // ============ INTELIGÊNCIA ============
  {
    label: 'IA & Alertas',
    icon: Brain,
    to: '/client/ai-config',
    section: 'Inteligência',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER],
  },
  {
    label: 'Notificações',
    icon: Bell,
    to: '/client/notifications',
    section: 'Inteligência',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER],
  },

  // ============ SUPORTE ============
  {
    label: 'Relatórios',
    icon: FileText,
    to: '/client/reports',
    section: 'Suporte',
    roles: [SystemRole.CLIENT_MASTER, SystemRole.MANAGER],
  },
  {
    label: 'Acesso Técnico',
    icon: Clock,
    to: '/client/technician-access',
    section: 'Suporte',
    roles: [SystemRole.CLIENT_MASTER], // Apenas Cliente Master
  },
  { label: 'Ajuda', icon: HelpCircle, to: '/client/support', section: 'Suporte' },

  // ============ SISTEMA ============
  {
    label: 'Configurações',
    icon: Settings,
    to: '/client/settings',
    section: 'Sistema',
    roles: [SystemRole.CLIENT_MASTER],
  },
]

export type ClientSidebarProps = {
  onNavigate?: () => void
  tenantName?: string
  isCompact?: boolean
  role?: SystemRole
}

export function ClientSidebar({ onNavigate, tenantName, isCompact = false, role }: ClientSidebarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const logoSrc = isCompact ? logoMark : logoFull
  const logoFailed = failedSrc === logoSrc
  const logoWrapperClass = cn(
    'mx-auto flex items-center justify-center transition-all duration-200 ease-out',
    !isCompact && 'rounded-lg bg-white px-3 py-2 shadow-sm'
  )
  const fallbackTextClass = cn(
    'font-semibold uppercase tracking-wide',
    isCompact ? 'text-[10px] text-white' : 'text-base text-[#212492]'
  )

  // Filtrar itens baseado no role
  const items = clientNavItems.filter((item) => !item.roles || (role && item.roles.includes(role)))

  // Agrupar items por seção
  const sections = items.reduce(
    (acc, item) => {
      const section = item.section
      if (!acc[section]) acc[section] = []
      acc[section].push(item)
      return acc
    },
    {} as Record<string, ClientNavItem[]>
  )

  // Label do role para o footer
  const roleLabel = role ? ROLE_LABELS[role] : 'Cliente'

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

      {/* Tenant Name */}
      {!isCompact && tenantName && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/50">Seu Ambiente</p>
            <p className="text-xs font-medium text-white truncate" title={tenantName}>
              {tenantName}
            </p>
          </div>
        </div>
      )}

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
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-white/10 text-white shadow-inner'
                        : 'text-white/70 hover:bg-white/5 hover:text-white',
                      isCompact && 'px-2 justify-center'
                    )
                  }
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span
                    className={cn(
                      'origin-left overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out',
                      isCompact ? 'max-w-0 opacity-0' : 'ml-1 max-w-[160px] opacity-100'
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
          isCompact && 'px-0 text-center text-[10px]'
        )}
      >
        <p>VMS Unifique v0.1.0</p>
        <p className="text-white/40">{roleLabel}</p>
      </div>
    </div>
  )
}
