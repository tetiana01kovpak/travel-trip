import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { useActivities } from '@/hooks/useActivities'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { ActivityGrid } from '@/components/browse/ActivityGrid'
import { SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/common/Button'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

export default function ActivitiesPage() {
  const [q, setQ] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)

  const debouncedQ = useDebouncedValue(q, 300)
  const debouncedMin = useDebouncedValue(minPrice, 300)
  const debouncedMax = useDebouncedValue(maxPrice, 300)

  const filters = {
    q: debouncedQ || undefined,
    minPrice: debouncedMin ? Number(debouncedMin) : undefined,
    maxPrice: debouncedMax ? Number(debouncedMax) : undefined,
    page,
    limit: DEFAULT_PAGE_SIZE,
  }

  const { data, isLoading, isError, refetch, isFetching } = useActivities(filters)
  const activities = data?.items ?? []
  const hasFilters = Boolean(q || minPrice || maxPrice)

  function onFilterChange(setter: (value: string) => void, value: string) {
    setter(value)
    setPage(1)
  }

  function clearFilters() {
    setQ('')
    setMinPrice('')
    setMaxPrice('')
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-lagoon-600">Activities</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
          Every bookable experience, in one place
        </h1>
        <p className="mt-3 text-slate-500">
          Filter by budget or search by name to find your next adventure.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
        <SlidersHorizontal className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => onFilterChange(setQ, e.target.value)}
          placeholder="Search activities…"
          aria-label="Search activities"
          className="min-w-40 flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-lagoon-400"
        />
        <input
          type="number"
          min={0}
          value={minPrice}
          onChange={(e) => onFilterChange(setMinPrice, e.target.value)}
          placeholder="Min price"
          aria-label="Minimum price"
          className="w-28 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-lagoon-400"
        />
        <input
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => onFilterChange(setMaxPrice, e.target.value)}
          placeholder="Max price"
          aria-label="Maximum price"
          className="w-28 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-lagoon-400"
        />
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={<X className="size-4" />}>
            Clear
          </Button>
        ) : null}
      </div>

      {isLoading ? (
        <SkeletonGrid count={DEFAULT_PAGE_SIZE} />
      ) : isError ? (
        <ErrorState message="We couldn't load activities right now." onRetry={() => refetch()} />
      ) : activities.length === 0 ? (
        <EmptyState
          title="No activities match your filters"
          description="Try widening your search or clearing the filters above."
          action={
            hasFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-400">
            {data?.total ?? activities.length} activities found{isFetching ? ' · updating…' : ''}
          </p>
          <ActivityGrid activities={activities} />
          <div className="mt-10">
            <Pagination
              page={data?.page ?? page}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
