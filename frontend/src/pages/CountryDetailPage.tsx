import { useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCountry } from '@/hooks/useCountry'
import { TownCard } from '@/components/browse/TownCard'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { Skeleton, SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { firstImageUrl } from '@/lib/formatters'
import { paths } from '@/router/paths'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1600&q=70'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

export default function CountryDetailPage() {
  const { countrySlug } = useParams<{ countrySlug: string }>()
  const { data: country, isLoading, isError, refetch } = useCountry(countrySlug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-72 w-full rounded-2xl" />
        <SkeletonGrid count={6} />
      </div>
    )
  }

  if (isError || !country) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message="We couldn't load this country." onRetry={() => refetch()} />
      </div>
    )
  }

  const towns = country.towns ?? []

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden sm:h-80">
        <img
          src={firstImageUrl(country.images, FALLBACK_IMAGE)}
          alt={country.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{country.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={[{ label: 'Tours', to: paths.countries }, { label: country.name }]} className="mb-8" />

        {country.description ? <p className="mb-10 max-w-3xl text-slate-600">{country.description}</p> : null}

        <h2 className="mb-6 font-display text-2xl font-bold text-slate-900">Towns in {country.name}</h2>

        {towns.length === 0 ? (
          <EmptyState title="No towns yet" description="We're still adding towns for this country." />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {towns.map((town) => (
              <TownCard key={town.id} town={town} countrySlug={country.slug} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
