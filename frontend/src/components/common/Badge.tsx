import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'lagoon' | 'coral' | 'slate' | 'green' | 'amber'

const toneClasses: Record<BadgeTone, string> = {
  lagoon: 'bg-lagoon-50 text-lagoon-700 ring-1 ring-inset ring-lagoon-200',
  coral: 'bg-coral-50 text-coral-700 ring-1 ring-inset ring-coral-200',
  slate: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200',
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export function Badge({ tone = 'slate', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}
