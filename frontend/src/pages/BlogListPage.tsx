import { useState } from 'react'
import { motion } from 'motion/react'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import { BlogCard } from '@/components/blog/BlogCard'
import { SkeletonGrid } from '@/components/common/Skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { Pagination } from '@/components/common/Pagination'
import { BLOG_PAGE_SIZE } from '@/lib/constants'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export default function BlogListPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useBlogPosts(page, BLOG_PAGE_SIZE)
  const posts = data?.items ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-lagoon-600">Blog</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
          Stories from the road
        </h1>
        <p className="mt-3 text-slate-500">Guides, tips, and inspiration for planning your next trip.</p>
      </header>

      {isLoading ? (
        <SkeletonGrid count={BLOG_PAGE_SIZE} />
      ) : isError ? (
        <ErrorState message="We couldn't load the blog right now." onRetry={() => refetch()} />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet" description="Check back soon for new stories." />
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
          <div className="mt-10">
            <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  )
}
