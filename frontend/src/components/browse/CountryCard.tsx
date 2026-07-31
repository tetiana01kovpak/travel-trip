import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { paths } from '@/router/paths'
import { firstImageUrl, truncate } from '@/lib/formatters'
import type { Country } from '@/types/country'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=900&q=60'

export const cardItemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export interface CountryCardProps {
  country: Country
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <motion.div variants={cardItemVariants} className="h-full">
      <Link to={paths.countryDetail(country.slug)} className="group block h-full">
        <Card hoverable className="flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={firstImageUrl(country.images, FALLBACK_IMAGE)}
              alt={country.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {typeof country.townCount === 'number' ? (
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-lagoon-700 shadow-soft backdrop-blur">
                {country.townCount} {country.townCount === 1 ? 'town' : 'towns'}
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-lagoon-700">
              {country.name}
            </h3>
            {country.description ? (
              <p className="text-sm text-slate-500">{truncate(country.description, 90)}</p>
            ) : (
              <p className="flex items-center gap-1 text-sm text-slate-400">
                <MapPin className="size-3.5" /> Explore destinations
              </p>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
