/**
 * Sidebar do Técnico
 * Menu específico para técnicos de campo
 */

import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket,
  KeyRound,
  Wrench,
  Video,
  HelpCircle,
  History,
  Camera,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import logoFull from '@/assets/logo-unifique-full.svg'
import logoMark from '@/assets/logo-unifique-mark.svg'

type TechnicianNavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  section: string
}

const technicianNavItems: TechnicianNavItem[] = [
  // ============ PRINCIPAL ============
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/technician/dashboard',
    section: 'Principal',
  },
  {
    label: 'Meus Chamados',
    icon: Ticket,
    to: '/technician/tickets',
    section: 'Principal',
  },

  // ============ ACESSO ============
  {
    label: 'Acessos Ativos',
    icon: KeyRound,
    to: '/technician/access',
    section: 'Acesso',
  },
  {
    label: 'Câmeras Autorizadas',
    icon: Camera,
    to: '/technician/cameras',
    section: 'Acesso',
  },
  {
    label: 'Ao Vivo',
    icon: Video,
    to: '/technician/live',
    section: 'Acesso',
  },

  // ============ FERRAMENTAS ============
  {
    label: 'Diagnóstico',
    icon: Wrench,
    to: '/technician/diagnostics',
    section: 'Ferramentas',
  },
  {
    label: 'Histórico',
    icon: History,
    to: '/technician/history',
    section: 'Ferramentas',
  },

  // ============ SUPORTE ============
  {
    label: 'Ajuda',
    icon: HelpCircle,
    to: '/technician/help',
    section: 'Suporte',
  },
]

export type TechnicianSidebarProps = {
  onNavigate?: () => void
  technicianName?: string
  isCompact?: boolean
}

export function TechnicianSidebar({ onNavigate, technicianName, isCompact = false }: TechnicianSidebarProps) {
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

  // Agrupar items por seção
  const sections = technicianNavItems.reduce(
    (acc, item) => {
      const section = item.section
      if (!acc[section]) acc[section] = []
      acc[section].push(item)
      return acc
    },
    {} as Record<string, TechnicianNavItem[]>
  )

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

      {/* Technician Name */}
      {!isCompact && technicianName && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/50">Técnico</p>
            <p className="text-xs font-medium text-white truncate" title={technicianName}>
              {technicianName}
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
        <p className="text-white/40">Técnico</p>
      </div>
    </div>
  )
}
