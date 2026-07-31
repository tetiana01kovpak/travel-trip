import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { cardItemVariants } from '@/components/browse/CountryCard'
import { paths } from '@/router/paths'
import { firstImageUrl, truncate } from '@/lib/formatters'
import type { Town } from '@/types/town'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=900&q=60'

export interface TownCardProps {
  town: Town
  countrySlug: string
}

export function TownCard({ town, countrySlug }: TownCardProps) {
  return (
    <motion.div variants={cardItemVariants} className="h-full">
      <Link to={paths.townDetail(countrySlug, town.slug)} className="group block h-full">
        <Card hoverable className="flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={firstImageUrl(town.images, FALLBACK_IMAGE)}
              alt={town.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {typeof town.activityCount === 'number' ? (
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-lagoon-700 shadow-soft backdrop-blur">
                {town.activityCount} {town.activityCount === 1 ? 'activity' : 'activities'}
              </span>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-lagoon-700">
              {town.name}
            </h3>
            {town.description ? <p className="text-sm text-slate-500">{truncate(town.description, 90)}</p> : null}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
