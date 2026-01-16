import * as React from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type BentoSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'tall' | 'wide'

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

const gapClasses = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

const columnClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export function BentoGrid({
  children,
  columns = 4,
  gap = 'md',
  className,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[minmax(140px,auto)]',
        columnClasses[columns],
        gapClasses[gap],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: BentoSize
  variant?: 'default' | 'glass' | 'gradient' | 'outline' | 'elevated'
  hover?: boolean
  delay?: number
}

const sizeClasses: Record<BentoSize, string> = {
  sm: 'col-span-1 row-span-1',
  md: 'col-span-1 sm:col-span-2 row-span-1',
  lg: 'col-span-1 sm:col-span-2 row-span-2',
  xl: 'col-span-1 sm:col-span-2 lg:col-span-3 row-span-2',
  full: 'col-span-1 sm:col-span-2 lg:col-span-4 row-span-1',
  tall: 'col-span-1 row-span-2',
  wide: 'col-span-1 sm:col-span-2 row-span-1',
}

const variantClasses = {
  default:
    'bg-card border border-border shadow-sm hover:shadow-md dark:border-slate-800',
  glass:
    'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-glass',
  gradient:
    'bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border border-slate-100 dark:border-slate-800 shadow-sm',
  outline: 'bg-transparent border-2 border-dashed border-muted hover:border-primary/50',
  elevated: 'bg-card border border-border shadow-lg dark:border-slate-800',
}

export function BentoCard({
  children,
  size = 'sm',
  variant = 'default',
  hover = true,
  delay = 0,
  className,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 transition-all duration-300',
        sizeClasses[size],
        variantClasses[variant],
        hover && 'hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

// Header for Bento Cards
interface BentoCardHeaderProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function BentoCardHeader({
  title,
  description,
  icon,
  action,
  className,
}: BentoCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

// Content wrapper for Bento Cards
interface BentoCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function BentoCardContent({ children, className, ...props }: BentoCardContentProps) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}

// Metric display for Bento Cards
interface BentoMetricProps {
  value: string | number
  label?: string
  trend?: {
    value: number
    label?: string
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BentoMetric({
  value,
  label,
  trend,
  size = 'md',
  className,
}: BentoMetricProps) {
  const sizeStyles = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  const trendColor =
    trend && trend.value > 0
      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50'
      : trend && trend.value < 0
        ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
        : 'text-slate-600 bg-slate-100 dark:bg-slate-800'

  return (
    <div className={cn('space-y-1', className)}>
      <p className={cn('font-bold tracking-tight', sizeStyles[size])}>{value}</p>
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      {trend && (
        <div className="flex items-center gap-2 pt-1">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
              trendColor,
            )}
          >
            {trend.value > 0 && '↑'}
            {trend.value < 0 && '↓'}
            {Math.abs(trend.value)}%
          </span>
          {trend.label && (
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  )
}

// Feature highlight for Bento Cards (centered content)
interface BentoFeatureProps {
  icon: React.ReactNode
  title: string
  description?: string
  className?: string
}

export function BentoFeature({ icon, title, description, className }: BentoFeatureProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      <motion.div
        className="mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// Sparkline for Bento Cards
interface BentoSparklineProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export function BentoSparkline({
  data,
  color = 'currentColor',
  height = 40,
  className,
}: BentoSparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      className={cn('w-full', className)}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
      <motion.polygon
        points={`0,${height} ${points} 100,${height}`}
        fill="url(#sparkline-gradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </svg>
  )
}
