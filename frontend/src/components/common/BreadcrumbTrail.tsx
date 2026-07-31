import { Fragment } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export interface Crumb {
  label: string
  to?: string
}

export interface BreadcrumbTrailProps {
  items: Crumb[]
  className?: string
}

export function BreadcrumbTrail({ items, className }: BreadcrumbTrailProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex flex-wrap items-center gap-1.5 text-sm text-slate-500', className)}
    >
      <Link to="/" className="flex items-center gap-1 hover:text-lagoon-700" aria-label="Home">
        <Home className="size-3.5" />
      </Link>
      {items.map((item, idx) => (
        <Fragment key={idx}>
          <ChevronRight className="size-3.5 text-slate-300" />
          {item.to ? (
            <Link to={item.to} className="hover:text-lagoon-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-slate-700">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
