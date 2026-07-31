import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useActivities } from '@/hooks/useActivities'
import { ActivityGrid } from '@/components/browse/ActivityGrid'
import { SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { paths } from '@/router/paths'

export function FeaturedActivities() {
  const { data, isLoading, isError, refetch } = useActivities({ limit: 8, page: 1 })
  const activities = data?.items ?? []

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900">Featured activities</h2>
            <p className="mt-2 text-slate-500">Hand-picked experiences ready to book today.</p>
          </div>
          <Link
            to={paths.activities}
            className="flex items-center gap-1 text-sm font-semibold text-lagoon-700 hover:underline"
          >
            Browse all activities <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid count={8} />
        ) : isError ? (
          <ErrorState message="We couldn't load activities right now." onRetry={() => refetch()} />
        ) : activities.length === 0 ? (
          <EmptyState title="No activities yet" description="Check back soon for bookable experiences." />
        ) : (
          <ActivityGrid activities={activities} />
        )}
      </div>
    </section>
  )
}
