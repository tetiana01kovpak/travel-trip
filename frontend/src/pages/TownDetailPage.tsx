import { useParams } from 'react-router-dom'
import { useTown } from '@/hooks/useTown'
import { ActivityGrid } from '@/components/browse/ActivityGrid'
import { MapView } from '@/components/map/MapView'
import type { MapPin } from '@/components/map/MapView'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { Skeleton, SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { firstImageUrl } from '@/lib/formatters'
import { paths } from '@/router/paths'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=70'

export default function TownDetailPage() {
  const { countrySlug, townSlug } = useParams<{ countrySlug: string; townSlug: string }>()
  const { data: town, isLoading, isError, refetch } = useTown(townSlug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-72 w-full rounded-2xl" />
        <SkeletonGrid count={6} />
      </div>
    )
  }

  if (isError || !town) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message="We couldn't load this town." onRetry={() => refetch()} />
      </div>
    )
  }

  const countryRef = town.country && 'slug' in town.country ? town.country : undefined
  const resolvedCountrySlug = countryRef?.slug ?? countrySlug
  const activities = town.activities ?? []
  const pins: MapPin[] = activities
    .filter((a) => a.location)
    .map((a) => ({
      id: a.id,
      lat: a.location!.lat,
      lng: a.location!.lng,
      label: a.name,
      to: paths.activityDetail(a.slug),
    }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <BreadcrumbTrail
        items={[
          { label: 'Tours', to: paths.countries },
          ...(countryRef && resolvedCountrySlug
            ? [{ label: countryRef.name, to: paths.countryDetail(resolvedCountrySlug) }]
            : []),
          { label: town.name },
        ]}
        className="mb-8"
      />

      <div className="mb-10 overflow-hidden rounded-2xl">
        <div className="relative h-64 w-full sm:h-80">
          <img
            src={firstImageUrl(town.images, FALLBACK_IMAGE)}
            alt={town.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{town.name}</h1>
          </div>
        </div>
      </div>

      {town.description ? <p className="mb-10 max-w-3xl text-slate-600">{town.description}</p> : null}

      <h2 className="mb-6 font-display text-2xl font-bold text-slate-900">Activities in {town.name}</h2>

      {activities.length === 0 ? (
        <EmptyState title="No activities yet" description="We're still adding activities for this town." />
      ) : (
        <>
          <div className="mb-12">
            <ActivityGrid activities={activities} />
          </div>
          {pins.length > 0 ? (
            <div>
              <h2 className="mb-4 font-display text-xl font-bold text-slate-900">Where to find them</h2>
              <MapView pins={pins} />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
