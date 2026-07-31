import { useNavigate, useParams } from 'react-router-dom'
import { BreadcrumbTrail } from '@/components/common/BreadcrumbTrail'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'
import { BlogPostForm } from '@/components/admin/forms/BlogPostForm'
import { useAdminBlogPost, useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useAdminBlogPosts'
import { toImageAssets } from '@/lib/formatters'
import { paths } from '@/router/paths'
import type { BlogPostFormValues } from '@/lib/schemas/blogPostSchema'

export default function AdminBlogPostFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const { data: post, isLoading, isError, refetch } = useAdminBlogPost(id)
  const createPost = useCreateBlogPost()
  const updatePost = useUpdateBlogPost()

  function handleSubmit(values: BlogPostFormValues) {
    const payload = {
      title: values.title,
      slug: values.slug || undefined,
      excerpt: values.excerpt || undefined,
      body: values.body,
      images: values.images,
    }
    if (isEdit && id) {
      updatePost.mutate({ id, input: payload }, { onSuccess: () => navigate(paths.adminBlog) })
    } else {
      createPost.mutate(payload, { onSuccess: () => navigate(paths.adminBlog) })
    }
  }

  if (isEdit && isLoading) {
    return <Skeleton className="h-96 w-full rounded-2xl" />
  }

  if (isEdit && (isError || !post)) {
    return <ErrorState message="We couldn't load this post." onRetry={() => refetch()} />
  }

  return (
    <div>
      <BreadcrumbTrail
        items={[{ label: 'Blog', to: paths.adminBlog }, { label: isEdit ? 'Edit' : 'New' }]}
        className="mb-6"
      />
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">{isEdit ? 'Edit post' : 'New post'}</h1>
      <div className="max-w-4xl rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:p-8">
        <BlogPostForm
          defaultValues={
            post
              ? {
                  title: post.title,
                  slug: post.slug,
                  excerpt: post.excerpt ?? '',
                  body: post.body,
                  images: toImageAssets(post.images),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isSubmitting={createPost.isPending || updatePost.isPending}
          submitLabel={isEdit ? 'Save changes' : 'Publish post'}
        />
      </div>
    </div>
  )
}
