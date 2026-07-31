import { motion } from 'motion/react'
import { ActivityCard } from '@/components/browse/ActivityCard'
import type { Activity } from '@/types/activity'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export interface ActivityGridProps {
  activities: Activity[]
  className?: string
}

export function ActivityGrid({ activities }: ActivityGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </motion.div>
  )
}
