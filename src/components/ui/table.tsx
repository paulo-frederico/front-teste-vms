import * as React from 'react'

import { cn } from '@/lib/utils'

// Table Container with rounded corners and shadow
interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-slate-800',
        className,
      )}
      {...props}
    >
      <div className="overflow-x-auto scrollbar-thin">{children}</div>
    </div>
  ),
)
TableContainer.displayName = 'TableContainer'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  ),
)
Table.displayName = 'Table'

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        '[&_tr]:border-b [&_tr]:border-border dark:[&_tr]:border-slate-800',
        sticky && 'sticky top-0 z-10 bg-muted/95 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  ),
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium text-foreground dark:bg-slate-800/50',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isClickable?: boolean
  isSelected?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, isClickable, isSelected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'group border-b border-border transition-colors dark:border-slate-800',
        'hover:bg-muted/50 dark:hover:bg-slate-800/50',
        'data-[state=selected]:bg-primary/5 dark:data-[state=selected]:bg-primary/10',
        isClickable && 'cursor-pointer',
        isSelected && 'bg-primary/5 dark:bg-primary/10',
        className,
      )}
      data-state={isSelected ? 'selected' : undefined}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, sorted, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-muted-foreground',
        sortable && 'cursor-pointer select-none hover:text-foreground',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {children}
        {sortable && (
          <span className="text-muted-foreground/50">
            {sorted === 'asc' && '↑'}
            {sorted === 'desc' && '↓'}
            {!sorted && '↕'}
          </span>
        )}
      </div>
    </th>
  ),
)
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'p-4 align-middle text-sm text-foreground',
      className,
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

// Actions cell that shows on hover
const TableCellActions = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'w-0 p-2 align-middle opacity-0 transition-opacity group-hover:opacity-100',
      className,
    )}
    {...props}
  >
    <div className="flex items-center justify-end gap-1">{children}</div>
  </td>
))
TableCellActions.displayName = 'TableCellActions'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

// Empty state for tables
interface TableEmptyProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  colSpan?: number
}

function TableEmpty({
  icon,
  title = 'Nenhum dado encontrado',
  description,
  action,
  colSpan = 5,
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-48">
        <div className="flex flex-col items-center justify-center text-center">
          {icon && (
            <div className="mb-3 rounded-full bg-muted p-4 text-muted-foreground">
              {icon}
            </div>
          )}
          <p className="font-medium text-muted-foreground">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground/70">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </td>
    </tr>
  )
}

// Loading state for tables
interface TableLoadingProps {
  colSpan?: number
  rows?: number
}

function TableLoading({ colSpan = 5, rows = 5 }: TableLoadingProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-border dark:border-slate-800">
          {Array.from({ length: colSpan }).map((_, colIndex) => (
            <td key={colIndex} className="p-4">
              <div
                className="h-4 animate-pulse rounded bg-muted"
                style={{ width: `${Math.random() * 40 + 40}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

// Status badge for tables
interface TableStatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'maintenance' | 'unknown'
  label?: string
}

function TableStatusBadge({ status, label }: TableStatusBadgeProps) {
  const statusConfig = {
    online: {
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      textColor: 'text-emerald-700 dark:text-emerald-400',
      label: label || 'Online',
    },
    offline: {
      color: 'bg-rose-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/50',
      textColor: 'text-rose-700 dark:text-rose-400',
      label: label || 'Offline',
    },
    warning: {
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      textColor: 'text-amber-700 dark:text-amber-400',
      label: label || 'Instável',
    },
    maintenance: {
      color: 'bg-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-700 dark:text-slate-400',
      label: label || 'Manutenção',
    },
    unknown: {
      color: 'bg-slate-300',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      textColor: 'text-slate-600 dark:text-slate-400',
      label: label || 'Desconhecido',
    },
  }

  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        config.bgColor,
        config.textColor,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.color)} />
      {config.label}
    </span>
  )
}

export {
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCellActions,
  TableCaption,
  TableEmpty,
  TableLoading,
  TableStatusBadge,
}
