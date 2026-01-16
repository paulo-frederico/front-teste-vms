import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-2xl border text-card-foreground transition-all duration-300 ease-smooth',
  {
    variants: {
      variant: {
        default: 'bg-card border-border shadow-sm hover:shadow-md',
        elevated: 'bg-card border-border shadow-md hover:shadow-lg hover:-translate-y-0.5',
        glass:
          'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-white/20 dark:border-white/10 shadow-glass hover:shadow-glass-lg',
        gradient:
          'bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md',
        interactive:
          'bg-card border-border shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 cursor-pointer',
        outline: 'bg-transparent border-2 border-dashed border-muted hover:border-primary/50',
        ghost: 'bg-transparent border-transparent hover:bg-muted/50',
      },
      padding: {
        default: '',
        none: '[&>*]:p-0',
        sm: '[&_.card-header]:p-4 [&_.card-content]:p-4 [&_.card-footer]:p-4',
        lg: '[&_.card-header]:p-8 [&_.card-content]:p-8 [&_.card-footer]:p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  },
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-header flex flex-col gap-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('card-content p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('card-footer flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// New component: GlassCard for special highlight sections
const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-6 shadow-glass backdrop-blur-md transition-all duration-300 hover:shadow-glass-lg dark:border-white/10 dark:bg-slate-900/70',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:to-transparent before:opacity-50 dark:before:from-white/5',
        className,
      )}
      {...props}
    />
  ),
)
GlassCard.displayName = 'GlassCard'

// New component: StatCard for KPI/metrics display
interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label?: string
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, description, icon, trend, variant = 'default', ...props }, ref) => {
    const trendColors = {
      up: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50',
      down: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50',
      neutral: 'text-slate-600 bg-slate-100 dark:bg-slate-800',
    }

    const trendDirection = trend
      ? trend.value > 0
        ? 'up'
        : trend.value < 0
          ? 'down'
          : 'neutral'
      : 'neutral'

    const variantStyles = {
      default: 'border-slate-100 dark:border-slate-800',
      success: 'border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/30',
      warning: 'border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/30',
      danger: 'border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-50/50 to-transparent dark:from-rose-950/30',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="rounded-xl bg-muted/50 p-2.5 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                trendColors[trendDirection],
              )}
            >
              {trendDirection === 'up' && '↑'}
              {trendDirection === 'down' && '↓'}
              {Math.abs(trend.value)}%
            </span>
            {trend.label && (
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            )}
          </div>
        )}
      </div>
    )
  },
)
StatCard.displayName = 'StatCard'

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  GlassCard,
  StatCard,
  cardVariants,
}
