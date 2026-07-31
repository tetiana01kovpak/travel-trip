import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { cardItemVariants } from '@/components/browse/CountryCard'
import { paths } from '@/router/paths'
import { firstImageUrl, formatCurrency, truncate } from '@/lib/formatters'
import type { Activity } from '@/types/activity'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=60'

export interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const townName = activity.town && 'name' in activity.town ? activity.town.name : undefined

  return (
    <motion.div variants={cardItemVariants} className="h-full">
      <Link to={paths.activityDetail(activity.slug)} className="group block h-full">
        <Card hoverable className="flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={firstImageUrl(activity.images, FALLBACK_IMAGE)}
              alt={activity.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-coral-500 to-coral-400 px-3 py-1 text-xs font-bold text-white shadow-soft">
              {formatCurrency(activity.price, activity.currency ?? 'USD')}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-lagoon-700">
              {activity.name}
            </h3>
            {townName ? (
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="size-3.5" /> {townName}
              </p>
            ) : null}
            {activity.description ? (
              <p className="text-sm text-slate-500">{truncate(activity.description, 80)}</p>
            ) : null}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
