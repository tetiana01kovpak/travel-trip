import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { cardItemVariants } from '@/components/browse/CountryCard'
import { paths } from '@/router/paths'
import { firstImageUrl, formatDateShort, truncate } from '@/lib/formatters'
import type { BlogPost } from '@/types/blogPost'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=900&q=60'

export interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const date = post.publishedAt ?? post.createdAt

  return (
    <motion.div variants={cardItemVariants} className="h-full">
      <Link to={paths.blogPost(post.slug)} className="group block h-full">
        <Card hoverable className="flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={firstImageUrl(post.images, FALLBACK_IMAGE)}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            {date ? (
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                <CalendarDays className="size-3.5" /> {formatDateShort(date)}
              </p>
            ) : null}
            <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-lagoon-700">
              {post.title}
            </h3>
            {post.excerpt ? <p className="text-sm text-slate-500">{truncate(post.excerpt, 120)}</p> : null}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
