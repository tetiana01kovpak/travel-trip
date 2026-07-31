import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import type { DataTableColumn } from '@/components/admin/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { buttonClasses } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { useAdminTowns, useDeleteTown } from '@/hooks/useAdminTowns'
import { ADMIN_PAGE_SIZE } from '@/lib/constants'
import { paths } from '@/router/paths'
import { firstImageUrl } from '@/lib/formatters'
import type { Town } from '@/types/town'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=200&q=60'

export default function AdminTownsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminTowns({ page, limit: ADMIN_PAGE_SIZE })
  const deleteTown = useDeleteTown()
  const [target, setTarget] = useState<Town | null>(null)

  const towns = data?.items ?? []

  const columns: DataTableColumn<Town>[] = [
    {
      key: 'image',
      header: '',
      className: 'w-16',
      render: (t) => (
        <img src={firstImageUrl(t.images, FALLBACK_IMAGE)} alt="" className="size-12 rounded-lg object-cover" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (t) => (
        <div>
          <p className="font-medium text-slate-800">{t.name}</p>
          <p className="text-xs text-slate-400">{t.slug}</p>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      render: (t) => (t.country && 'name' in t.country ? t.country.name : '—'),
    },
    { key: 'activities', header: 'Activities', render: (t) => t.activityCount ?? t.activities?.length ?? '—' },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          <Link
            to={paths.adminTownEdit(t.id)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-lagoon-700"
            aria-label={`Edit ${t.name}`}
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setTarget(t)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${t.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <ErrorState message="We couldn't load towns." onRetry={() => refetch()} />
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Towns</h1>
          <p className="mt-1 text-sm text-slate-500">Manage towns within each country.</p>
        </div>
        <Link to={paths.adminTownNew} className={buttonClasses({ variant: 'primary' })}>
          <Plus className="size-4" /> New town
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={towns}
        rowKey={(t) => t.id}
        isLoading={isLoading}
        emptyMessage="No towns yet — add your first one."
      />

      <div className="mt-6">
        <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title={`Delete ${target?.name ?? ''}?`}
        description="This will remove the town and cannot be undone."
        isLoading={deleteTown.isPending}
        onCancel={() => setTarget(null)}
        onConfirm={() => target && deleteTown.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </div>
  )
}
