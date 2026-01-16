import * as React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface BottomNavItem {
  label: string
  icon: LucideIcon
  href: string
  badge?: number
}

interface BottomNavigationProps {
  items: BottomNavItem[]
  className?: string
}

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (href: string) => {
    // Exact match or starts with (for nested routes)
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/50 bg-white/90 backdrop-blur-lg dark:border-slate-800/50 dark:bg-slate-900/90 lg:hidden',
        'safe-area-bottom',
        className,
      )}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => navigate(item.href)}
              className={cn(
                'relative flex min-w-[4rem] flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition-all duration-200',
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon container with badge */}
              <div className="relative">
                <motion.div
                  animate={active ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors',
                      active && 'stroke-[2.5]',
                    )}
                  />
                </motion.div>

                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-2 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  active && 'font-semibold',
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// Floating Action Button for mobile
interface FloatingActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  label?: string
  className?: string
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  label,
  className,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cn(
        'fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 lg:hidden',
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon className="h-6 w-6" />
    </motion.button>
  )
}

// Speed Dial (expandable FAB)
interface SpeedDialAction {
  icon: LucideIcon
  label: string
  onClick: () => void
}

interface SpeedDialProps {
  icon: LucideIcon
  actions: SpeedDialAction[]
  className?: string
}

export function SpeedDial({ icon: MainIcon, actions, className }: SpeedDialProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('fixed bottom-20 right-4 z-40 lg:hidden', className)}>
      {/* Action buttons */}
      <motion.div
        initial={false}
        animate={open ? 'open' : 'closed'}
        className="absolute bottom-16 right-0 flex flex-col-reverse items-end gap-3"
      >
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            variants={{
              open: {
                opacity: 1,
                y: 0,
                transition: { delay: index * 0.05 },
              },
              closed: {
                opacity: 0,
                y: 20,
              },
            }}
            className="flex items-center gap-2"
          >
            <span className="rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm dark:bg-white/90 dark:text-slate-900">
              {action.label}
            </span>
            <motion.button
              type="button"
              onClick={() => {
                action.onClick()
                setOpen(false)
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <action.icon className="h-5 w-5" />
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Main FAB */}
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        animate={open ? { rotate: 45 } : { rotate: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MainIcon className="h-6 w-6" />
      </motion.button>

      {/* Backdrop */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
