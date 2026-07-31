import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useCountries } from '@/hooks/useCountries'
import { CountryCard } from '@/components/browse/CountryCard'
import { SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { paths } from '@/router/paths'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export function FeaturedDestinations() {
  const { data, isLoading, isError, refetch } = useCountries()
  const countries = (data?.items ?? []).slice(0, 4)

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900">Popular destinations</h2>
            <p className="mt-2 text-slate-500">Countries our travelers can&apos;t stop booking.</p>
          </div>
          <Link
            to={paths.countries}
            className="flex items-center gap-1 text-sm font-semibold text-lagoon-700 hover:underline"
          >
            View all tours <ArrowRight className="size-4" />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid count={4} />
        ) : isError ? (
          <ErrorState message="We couldn't load destinations right now." onRetry={() => refetch()} />
        ) : countries.length === 0 ? (
          <EmptyState
            title="No destinations yet"
            description="Check back soon — new countries are added regularly."
          />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
