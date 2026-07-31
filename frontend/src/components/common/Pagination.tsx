import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getPageList(page, totalPages)

  return (
    <nav className={cn('flex items-center justify-center gap-1.5', className)} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-lagoon-300 hover:text-lagoon-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
            &hellip;
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'flex size-9 items-center justify-center rounded-full text-sm font-medium transition',
              p === page ? 'bg-lagoon-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-lagoon-300 hover:text-lagoon-700 disabled:pointer-events-none disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}

function getPageList(current: number, total: number): (number | 'ellipsis')[] {
  const delta = 1
  const range: (number | 'ellipsis')[] = []
  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(total - 1, current + delta)

  range.push(1)
  if (rangeStart > 2) range.push('ellipsis')
  for (let i = rangeStart; i <= rangeEnd; i++) range.push(i)
  if (rangeEnd < total - 1) range.push('ellipsis')
  if (total > 1) range.push(total)

  return range
}
