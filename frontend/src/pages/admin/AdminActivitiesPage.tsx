import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import type { DataTableColumn } from '@/components/admin/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { buttonClasses } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { useAdminActivities, useDeleteActivity } from '@/hooks/useAdminActivities'
import { ADMIN_PAGE_SIZE } from '@/lib/constants'
import { paths } from '@/router/paths'
import { firstImageUrl, formatCurrency } from '@/lib/formatters'
import type { Activity } from '@/types/activity'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=60'

export default function AdminActivitiesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminActivities({ page, limit: ADMIN_PAGE_SIZE })
  const deleteActivity = useDeleteActivity()
  const [target, setTarget] = useState<Activity | null>(null)

  const activities = data?.items ?? []

  const columns: DataTableColumn<Activity>[] = [
    {
      key: 'image',
      header: '',
      className: 'w-16',
      render: (a) => (
        <img src={firstImageUrl(a.images, FALLBACK_IMAGE)} alt="" className="size-12 rounded-lg object-cover" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (a) => (
        <div>
          <p className="font-medium text-slate-800">{a.name}</p>
          <p className="text-xs text-slate-400">{a.slug}</p>
        </div>
      ),
    },
    { key: 'town', header: 'Town', render: (a) => (a.town && 'name' in a.town ? a.town.name : '—') },
    { key: 'price', header: 'Price', render: (a) => formatCurrency(a.price, a.currency ?? 'USD') },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (a) => (
        <div className="flex justify-end gap-2">
          <Link
            to={paths.adminActivityEdit(a.id)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-lagoon-700"
            aria-label={`Edit ${a.name}`}
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setTarget(a)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${a.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <ErrorState message="We couldn't load activities." onRetry={() => refetch()} />
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Activities</h1>
          <p className="mt-1 text-sm text-slate-500">Manage bookable activities.</p>
        </div>
        <Link to={paths.adminActivityNew} className={buttonClasses({ variant: 'primary' })}>
          <Plus className="size-4" /> New activity
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={activities}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        emptyMessage="No activities yet — add your first one."
      />

      <div className="mt-6">
        <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title={`Delete ${target?.name ?? ''}?`}
        description="This will remove the activity and cannot be undone."
        isLoading={deleteActivity.isPending}
        onCancel={() => setTarget(null)}
        onConfirm={() => target && deleteActivity.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </div>
  )
}
