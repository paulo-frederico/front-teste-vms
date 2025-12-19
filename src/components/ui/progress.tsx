import * as React from 'react'
import { cn } from '@/lib/utils'

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number
}

export function Progress({ className, value = 0, ...props }: ProgressProps) {
  const safe = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={cn('w-full rounded-full bg-slate-100', className)} {...props}>
      <div
        className="h-2 rounded-full bg-blue-500 transition-all"
        style={{ width: `${safe}%` }}
      />
    </div>
  )
}

export default Progress
