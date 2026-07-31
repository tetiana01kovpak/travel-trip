import { useParams } from 'react-router-dom'
import { useBlogPost } from '@/hooks/useBlogPost'
import { BlogPostContent } from '@/components/blog/BlogPostContent'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { firstImageUrl, formatDate } from '@/lib/formatters'
import { paths } from '@/router/paths'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1600&q=70'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError, refetch } = useBlogPost(slug)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-72 w-full rounded-2xl" />
        <Skeleton className="mb-3 h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <ErrorState message="We couldn't load this post." onRetry={() => refetch()} />
      </div>
    )
  }

  const date = post.publishedAt ?? post.createdAt

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <BreadcrumbTrail items={[{ label: 'Blog', to: paths.blog }, { label: post.title }]} className="mb-6" />

      <div className="mb-8 overflow-hidden rounded-2xl">
        <img
          src={firstImageUrl(post.images, FALLBACK_IMAGE)}
          alt={post.title}
          className="h-72 w-full object-cover sm:h-96"
        />
      </div>

      <header className="mb-8">
        {date ? (
          <p className="mb-2 text-sm font-medium text-slate-400">
            {formatDate(date)}
            {post.author ? ` · ${post.author}` : ''}
          </p>
        ) : null}
        <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{post.title}</h1>
      </header>

      <BlogPostContent markdown={post.body} />
    </article>
  )
}
