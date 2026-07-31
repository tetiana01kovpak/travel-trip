import { motion } from 'motion/react'
import { useCountries } from '@/hooks/useCountries'
import { CountryCard } from '@/components/browse/CountryCard'
import { SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

export default function CountriesPage() {
  const { data, isLoading, isError, refetch } = useCountries()
  const countries = data?.items ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-lagoon-600">Tours</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
          Choose your next country
        </h1>
        <p className="mt-3 text-slate-500">
          Every destination is broken down into towns and bookable activities, so you can plan down to
          the last afternoon.
        </p>
      </header>

      {isLoading ? (
        <SkeletonGrid count={8} />
      ) : isError ? (
        <ErrorState message="We couldn't load countries right now." onRetry={() => refetch()} />
      ) : countries.length === 0 ? (
        <EmptyState title="No countries yet" description="Check back soon — new destinations are on the way." />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
