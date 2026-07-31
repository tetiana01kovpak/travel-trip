import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import type { DataTableColumn } from '@/components/admin/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { buttonClasses } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { useAdminBlogPosts, useDeleteBlogPost } from '@/hooks/useAdminBlogPosts'
import { ADMIN_PAGE_SIZE } from '@/lib/constants'
import { paths } from '@/router/paths'
import { firstImageUrl, formatDateShort } from '@/lib/formatters'
import type { BlogPost } from '@/types/blogPost'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=200&q=60'

export default function AdminBlogPostsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminBlogPosts({ page, limit: ADMIN_PAGE_SIZE })
  const deletePost = useDeleteBlogPost()
  const [target, setTarget] = useState<BlogPost | null>(null)

  const posts = data?.items ?? []

  const columns: DataTableColumn<BlogPost>[] = [
    {
      key: 'image',
      header: '',
      className: 'w-16',
      render: (p) => (
        <img src={firstImageUrl(p.images, FALLBACK_IMAGE)} alt="" className="size-12 rounded-lg object-cover" />
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (p) => (
        <div>
          <p className="font-medium text-slate-800">{p.title}</p>
          <p className="text-xs text-slate-400">{p.slug}</p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Published',
      render: (p) => (p.publishedAt ?? p.createdAt ? formatDateShort((p.publishedAt ?? p.createdAt) as string) : '—'),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Link
            to={paths.adminBlogEdit(p.id)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-lagoon-700"
            aria-label={`Edit ${p.title}`}
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setTarget(p)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${p.title}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <ErrorState message="We couldn't load blog posts." onRetry={() => refetch()} />
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Blog posts</h1>
          <p className="mt-1 text-sm text-slate-500">Write and manage travel stories.</p>
        </div>
        <Link to={paths.adminBlogNew} className={buttonClasses({ variant: 'primary' })}>
          <Plus className="size-4" /> New post
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={posts}
        rowKey={(p) => p.id}
        isLoading={isLoading}
        emptyMessage="No posts yet — write your first one."
      />

      <div className="mt-6">
        <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title={`Delete "${target?.title ?? ''}"?`}
        description="This will remove the post and cannot be undone."
        isLoading={deletePost.isPending}
        onCancel={() => setTarget(null)}
        onConfirm={() => target && deletePost.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </div>
  )
}
