import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export function Card({ hoverable = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft print:shadow-none print:border',
        hoverable && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
