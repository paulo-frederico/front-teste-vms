import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Camera,
  Bell,
  Users,
  FolderOpen,
  AlertCircle,
  Search,
  Video,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// SVG Illustrations
const illustrations = {
  camera: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-muted/50" />
      <rect x="60" y="55" width="80" height="50" rx="8" className="fill-muted stroke-muted-foreground/20" strokeWidth="2" />
      <circle cx="100" cy="80" r="15" className="fill-background stroke-muted-foreground/30" strokeWidth="2" />
      <circle cx="100" cy="80" r="8" className="fill-muted-foreground/20" />
      <rect x="125" y="60" width="20" height="12" rx="2" className="fill-muted-foreground/20" />
      <motion.circle
        cx="100"
        cy="80"
        r="20"
        className="stroke-primary/30"
        strokeWidth="2"
        strokeDasharray="4 4"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-muted/50" />
      <circle cx="90" cy="75" r="30" className="stroke-muted-foreground/30" strokeWidth="4" fill="none" />
      <motion.line
        x1="112"
        y1="97"
        x2="135"
        y2="120"
        className="stroke-muted-foreground/30"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ x1: [112, 115, 112], y1: [97, 100, 97] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx="90" cy="75" r="15" className="fill-primary/10" />
    </svg>
  ),
  notification: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-muted/50" />
      <path
        d="M100 45C82 45 67 60 67 78V95L60 105H140L133 95V78C133 60 118 45 100 45Z"
        className="fill-muted stroke-muted-foreground/20"
        strokeWidth="2"
      />
      <circle cx="100" cy="115" r="8" className="fill-muted-foreground/20" />
      <motion.circle
        cx="120"
        cy="55"
        r="10"
        className="fill-primary/20 stroke-primary/40"
        strokeWidth="2"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-muted/50" />
      <circle cx="100" cy="65" r="18" className="fill-muted stroke-muted-foreground/20" strokeWidth="2" />
      <path
        d="M65 115C65 97 80 85 100 85C120 85 135 97 135 115"
        className="stroke-muted-foreground/20"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="65" cy="70" r="12" className="fill-muted/80 stroke-muted-foreground/10" strokeWidth="2" />
      <circle cx="135" cy="70" r="12" className="fill-muted/80 stroke-muted-foreground/10" strokeWidth="2" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-muted/50" />
      <path
        d="M55 55H85L95 45H145C150 45 155 50 155 55V115C155 120 150 125 145 125H55C50 125 45 120 45 115V65C45 60 50 55 55 55Z"
        className="fill-muted stroke-muted-foreground/20"
        strokeWidth="2"
      />
      <path d="M45 70H155" className="stroke-muted-foreground/10" strokeWidth="2" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-destructive/10" />
      <circle cx="100" cy="80" r="35" className="stroke-destructive/30" strokeWidth="3" fill="none" />
      <motion.path
        d="M85 65L115 95M115 65L85 95"
        className="stroke-destructive/50"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      />
    </svg>
  ),
  video: (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      <circle cx="100" cy="80" r="60" className="fill-muted/50" />
      <rect x="50" y="50" width="100" height="60" rx="8" className="fill-slate-800 stroke-muted-foreground/20" strokeWidth="2" />
      <motion.path
        d="M90 70L115 80L90 90V70Z"
        className="fill-white/80"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <rect x="55" y="115" width="90" height="6" rx="3" className="fill-muted" />
      <motion.rect
        x="55"
        y="115"
        width="30"
        height="6"
        rx="3"
        className="fill-primary/50"
        animate={{ width: [30, 60, 30] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  ),
}

type IllustrationType = keyof typeof illustrations

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  illustration?: IllustrationType | React.ReactNode
  icon?: LucideIcon
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  size?: 'sm' | 'md' | 'lg'
}

const iconMap: Record<IllustrationType, LucideIcon> = {
  camera: Camera,
  search: Search,
  notification: Bell,
  users: Users,
  folder: FolderOpen,
  error: AlertCircle,
  video: Video,
}

export function EmptyState({
  title,
  description,
  illustration = 'folder',
  icon,
  action,
  secondaryAction,
  size = 'md',
  className,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      illustration: 'h-24 w-24',
      icon: 'h-8 w-8',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-12 px-6',
      illustration: 'h-32 w-32',
      icon: 'h-10 w-10',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16 px-8',
      illustration: 'h-40 w-40',
      icon: 'h-12 w-12',
      title: 'text-xl',
      description: 'text-base',
    },
  }

  const sizes = sizeClasses[size]

  const isIllustrationType = (value: unknown): value is IllustrationType => {
    return typeof value === 'string' && value in illustrations
  }

  const IllustrationComponent = isIllustrationType(illustration)
    ? illustrations[illustration]
    : illustration
  const IconComponent = icon || (isIllustrationType(illustration) ? iconMap[illustration] : null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        sizes.container,
        className,
      )}
    >
      {/* Illustration or Icon */}
      <div className={cn('mb-4', sizes.illustration)}>
        {IllustrationComponent && isIllustrationType(illustration) ? (
          IllustrationComponent
        ) : IllustrationComponent ? (
          <div className="flex h-full w-full items-center justify-center">
            {IllustrationComponent as React.ReactNode}
          </div>
        ) : IconComponent ? (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <IconComponent className={cn('text-muted-foreground', sizes.icon)} />
          </div>
        ) : null}
      </div>

      {/* Text content */}
      <h3 className={cn('font-semibold text-foreground', sizes.title)}>{title}</h3>
      {description && (
        <p className={cn('mt-1 max-w-md text-muted-foreground', sizes.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button variant={action.variant || 'default'} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// Preset Empty States for common use cases
export function EmptyStateNoCameras(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="camera"
      title="Nenhuma câmera encontrada"
      description="Não há câmeras configuradas ou você não tem permissão para visualizá-las."
      {...props}
    />
  )
}

export function EmptyStateNoResults(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="search"
      title="Nenhum resultado encontrado"
      description="Tente ajustar os filtros ou termos de busca para encontrar o que procura."
      {...props}
    />
  )
}

export function EmptyStateNoNotifications(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="notification"
      title="Nenhuma notificação"
      description="Você está em dia! Novas notificações aparecerão aqui."
      {...props}
    />
  )
}

export function EmptyStateNoUsers(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="users"
      title="Nenhum usuário encontrado"
      description="Não há usuários cadastrados ou que correspondam aos filtros aplicados."
      {...props}
    />
  )
}

export function EmptyStateNoData(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="folder"
      title="Sem dados para exibir"
      description="Não há dados disponíveis para o período ou filtros selecionados."
      {...props}
    />
  )
}

export function EmptyStateError(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="error"
      title="Ops! Algo deu errado"
      description="Ocorreu um erro ao carregar os dados. Tente novamente mais tarde."
      action={{
        label: 'Tentar novamente',
        onClick: () => window.location.reload(),
      }}
      {...props}
    />
  )
}

export function EmptyStateNoVideos(props: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      illustration="video"
      title="Nenhuma gravação disponível"
      description="Não há gravações para o período selecionado ou a câmera não possui gravação habilitada."
      {...props}
    />
  )
}
