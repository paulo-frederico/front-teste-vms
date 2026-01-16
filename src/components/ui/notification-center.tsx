import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Check,
  X,
  AlertTriangle,
  Info,
  Camera,
  Shield,
  Settings,
  Trash2,
  CheckCheck,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'camera' | 'ai' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  meta?: {
    camera?: string
    site?: string
  }
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onDelete?: (id: string) => void
  onClearAll?: () => void
  onNotificationClick?: (notification: Notification) => void
}

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bgColor: string }
> = {
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/50',
  },
  error: {
    icon: X,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/50',
  },
  success: {
    icon: Check,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
  },
  camera: {
    icon: Camera,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 dark:bg-slate-800/50',
  },
  ai: {
    icon: Shield,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
  },
  system: {
    icon: Settings,
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 dark:bg-slate-800/50',
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Agora mesmo'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`
  return date.toLocaleDateString('pt-BR')
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
}: {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: (notification: Notification) => void
}) {
  const config = typeConfig[notification.type]
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={cn(
        'group relative flex gap-3 border-b border-border/50 p-4 transition-colors last:border-0',
        !notification.read && 'bg-primary/5',
        onClick && 'cursor-pointer hover:bg-muted/50',
      )}
      onClick={() => onClick?.(notification)}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary"
        />
      )}

      {/* Icon */}
      <div className={cn('mt-0.5 shrink-0 rounded-lg p-2', config.bgColor)}>
        <Icon className={cn('h-4 w-4', config.color)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            !notification.read && 'text-foreground',
            notification.read && 'text-muted-foreground',
          )}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {notification.message}
        </p>
        {notification.meta && (
          <p className="mt-1 text-xs text-muted-foreground/70">
            {notification.meta.camera && <span>{notification.meta.camera}</span>}
            {notification.meta.camera && notification.meta.site && <span> · </span>}
            {notification.meta.site && <span>{notification.meta.site}</span>}
          </p>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground/50">
          {formatTimeAgo(notification.timestamp)}
        </p>
      </div>

      {/* Actions (visible on hover) */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!notification.read && onMarkAsRead && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onMarkAsRead(notification.id)
                }}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Marcar como lida</TooltipContent>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(notification.id)
                }}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Excluir</TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.div>
  )
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  onNotificationClick,
}: NotificationCenterProps) {
  const [open, setOpen] = React.useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-white/70 text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-200 hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-100"
          aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 overflow-hidden rounded-2xl p-0 shadow-xl"
        sideOffset={12}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <div>
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && onMarkAllAsRead && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onMarkAllAsRead}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Marcar todas como lidas</TooltipContent>
              </Tooltip>
            )}
            {notifications.length > 0 && onClearAll && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={onClearAll}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Limpar todas</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Notification List */}
        <ScrollArea className="max-h-[400px]">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDelete}
                  onClick={onNotificationClick}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-3 rounded-full bg-muted p-4">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">Tudo em dia!</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Você não tem notificações pendentes
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t bg-muted/30 px-4 py-2">
            <Button variant="ghost" className="w-full text-xs" onClick={() => setOpen(false)}>
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
