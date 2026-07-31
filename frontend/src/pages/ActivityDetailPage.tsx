import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useActivity } from '@/hooks/useActivity'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { MiniMap } from '@/components/map/MiniMap'
import { BookingModal } from '@/components/booking/BookingModal'
import { firstImageUrl, formatCurrency } from '@/lib/formatters'
import { paths } from '@/router/paths'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=70'

export default function ActivityDetailPage() {
  const { activitySlug } = useParams<{ activitySlug: string }>()
  const { data: activity, isLoading, isError, refetch } = useActivity(activitySlug)
  const [bookingOpen, setBookingOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-80 w-full rounded-2xl" />
        <Skeleton className="mb-3 h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    )
  }

  if (isError || !activity) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message="We couldn't load this activity." onRetry={() => refetch()} />
      </div>
    )
  }

  const townRef = activity.town && 'slug' in activity.town ? activity.town : undefined
  const countryRef = activity.country && 'slug' in activity.country ? activity.country : undefined

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <BreadcrumbTrail
        items={[
          { label: 'Activities', to: paths.activities },
          ...(countryRef ? [{ label: countryRef.name, to: paths.countryDetail(countryRef.slug) }] : []),
          ...(townRef && countryRef
            ? [{ label: townRef.name, to: paths.townDetail(countryRef.slug, townRef.slug) }]
            : []),
          { label: activity.name },
        ]}
        className="mb-6"
      />

      <div className="mb-8 overflow-hidden rounded-2xl">
        <img
          src={firstImageUrl(activity.images, FALLBACK_IMAGE)}
          alt={activity.name}
          className="h-80 w-full object-cover sm:h-96"
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {townRef ? (
            <div className="mb-3">
              <Badge tone="lagoon">
                <MapPin className="size-3" /> {townRef.name}
              </Badge>
            </div>
          ) : null}
          <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{activity.name}</h1>
          {activity.description ? (
            <p className="mt-4 whitespace-pre-line text-slate-600">{activity.description}</p>
          ) : null}

          {activity.location ? (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold text-slate-900">Location</h2>
              <MiniMap
                lat={activity.location.lat}
                lng={activity.location.lng}
                label={activity.name}
                height="h-80"
              />
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <p className="text-sm text-slate-500">Starting from</p>
          <p className="mt-1 font-display text-3xl font-bold text-slate-900">
            {formatCurrency(activity.price, activity.currency ?? 'USD')}
            <span className="text-base font-normal text-slate-400"> / person</span>
          </p>
          <Button variant="cta" size="lg" className="mt-6 w-full" onClick={() => setBookingOpen(true)}>
            Book Now
          </Button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Simulated demo checkout — no real payment is processed.
          </p>
        </aside>
      </div>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} activity={activity} />
    </div>
  )
}
