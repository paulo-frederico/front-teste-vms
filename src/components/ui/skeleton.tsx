import * as React from 'react'

import { cn } from '@/lib/utils'

// Base Skeleton component with shimmer effect
const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'animate-pulse rounded-lg bg-muted/70 dark:bg-muted/50',
      className,
    )}
    {...props}
  />
))
Skeleton.displayName = 'Skeleton'

// Shimmer Skeleton with animated gradient
const SkeletonShimmer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative overflow-hidden rounded-lg bg-muted/70 dark:bg-muted/50',
      'before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer',
      'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent dark:before:via-white/10',
      className,
    )}
    {...props}
  />
))
SkeletonShimmer.displayName = 'SkeletonShimmer'

// Card Skeleton
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border bg-card p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonShimmer className="h-4 w-24" />
          <SkeletonShimmer className="h-8 w-32" />
        </div>
        <SkeletonShimmer className="h-10 w-10 rounded-xl" />
      </div>
      <div className="mt-4">
        <SkeletonShimmer className="h-3 w-20" />
      </div>
    </div>
  )
}

// Stat Card Skeleton
function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-card p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <SkeletonShimmer className="h-4 w-28" />
          <SkeletonShimmer className="h-9 w-20" />
          <SkeletonShimmer className="h-3 w-24" />
        </div>
        <SkeletonShimmer className="h-11 w-11 rounded-xl" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <SkeletonShimmer className="h-5 w-14 rounded-full" />
        <SkeletonShimmer className="h-3 w-16" />
      </div>
    </div>
  )
}

// Table Row Skeleton
function SkeletonTableRow({ columns = 5, className }: { columns?: number; className?: string }) {
  return (
    <tr className={cn('border-b', className)}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <SkeletonShimmer
            className={cn('h-4', i === 0 ? 'w-32' : i === columns - 1 ? 'w-20' : 'w-24')}
          />
        </td>
      ))}
    </tr>
  )
}

// Table Skeleton
function SkeletonTable({
  rows = 5,
  columns = 5,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('rounded-2xl border bg-card shadow-sm', className)}>
      {/* Header */}
      <div className="border-b bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonShimmer key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {/* Rows */}
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// List Item Skeleton
function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 p-4', className)}>
      <SkeletonShimmer className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonShimmer className="h-4 w-3/4" />
        <SkeletonShimmer className="h-3 w-1/2" />
      </div>
    </div>
  )
}

// List Skeleton
function SkeletonList({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('divide-y rounded-2xl border bg-card shadow-sm', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  )
}

// Avatar Skeleton
function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  }

  return <SkeletonShimmer className={cn('rounded-full', sizes[size], className)} />
}

// Text Block Skeleton
function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonShimmer
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

// Chart Skeleton
function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border bg-card p-6 shadow-sm', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <SkeletonShimmer className="h-5 w-32" />
          <SkeletonShimmer className="h-3 w-48" />
        </div>
        <SkeletonShimmer className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex h-48 items-end gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonShimmer
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${Math.random() * 60 + 40}%` }}
          />
        ))}
      </div>
    </div>
  )
}

// Page Header Skeleton
function SkeletonPageHeader({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-3xl border bg-card px-6 py-6 shadow-sm', className)}>
      <SkeletonShimmer className="h-3 w-20" />
      <SkeletonShimmer className="mt-2 h-8 w-48" />
      <SkeletonShimmer className="mt-2 h-4 w-64" />
    </div>
  )
}

// Dashboard Skeleton (combines multiple skeletons)
function SkeletonDashboard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8', className)}>
      <SkeletonPageHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>

      <SkeletonTable rows={5} columns={5} />
    </div>
  )
}

// Video Grid Skeleton (for VideoWall)
function SkeletonVideoGrid({
  count = 4,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid gap-2',
        count === 1
          ? 'grid-cols-1'
          : count <= 4
            ? 'grid-cols-2'
            : count <= 9
              ? 'grid-cols-3'
              : 'grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-video overflow-hidden rounded-lg bg-slate-900"
        >
          <SkeletonShimmer className="absolute inset-0" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <SkeletonShimmer className="h-4 w-24 rounded bg-black/50" />
            <SkeletonShimmer className="h-4 w-4 rounded-full bg-black/50" />
          </div>
        </div>
      ))}
    </div>
  )
}

export {
  Skeleton,
  SkeletonShimmer,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTableRow,
  SkeletonTable,
  SkeletonListItem,
  SkeletonList,
  SkeletonAvatar,
  SkeletonText,
  SkeletonChart,
  SkeletonPageHeader,
  SkeletonDashboard,
  SkeletonVideoGrid,
}
