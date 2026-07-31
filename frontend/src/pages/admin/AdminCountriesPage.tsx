import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/admin/DataTable'
import type { DataTableColumn } from '@/components/admin/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { buttonClasses } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { useAdminCountries, useDeleteCountry } from '@/hooks/useAdminCountries'
import { ADMIN_PAGE_SIZE } from '@/lib/constants'
import { paths } from '@/router/paths'
import { firstImageUrl } from '@/lib/formatters'
import type { Country } from '@/types/country'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=200&q=60'

export default function AdminCountriesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, refetch } = useAdminCountries({ page, limit: ADMIN_PAGE_SIZE })
  const deleteCountry = useDeleteCountry()
  const [target, setTarget] = useState<Country | null>(null)

  const countries = data?.items ?? []

  const columns: DataTableColumn<Country>[] = [
    {
      key: 'image',
      header: '',
      className: 'w-16',
      render: (c) => (
        <img src={firstImageUrl(c.images, FALLBACK_IMAGE)} alt="" className="size-12 rounded-lg object-cover" />
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (c) => (
        <div>
          <p className="font-medium text-slate-800">{c.name}</p>
          <p className="text-xs text-slate-400">{c.slug}</p>
        </div>
      ),
    },
    { key: 'towns', header: 'Towns', render: (c) => c.townCount ?? c.towns?.length ?? '—' },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <Link
            to={paths.adminCountryEdit(c.id)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-lagoon-700"
            aria-label={`Edit ${c.name}`}
          >
            <Pencil className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => setTarget(c)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${c.name}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ]

  if (isError) {
    return <ErrorState message="We couldn't load countries." onRetry={() => refetch()} />
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Countries</h1>
          <p className="mt-1 text-sm text-slate-500">Manage the countries travelers can browse.</p>
        </div>
        <Link to={paths.adminCountryNew} className={buttonClasses({ variant: 'primary' })}>
          <Plus className="size-4" /> New country
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={countries}
        rowKey={(c) => c.id}
        isLoading={isLoading}
        emptyMessage="No countries yet — add your first one."
      />

      <div className="mt-6">
        <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
      </div>

      <ConfirmDialog
        open={Boolean(target)}
        title={`Delete ${target?.name ?? ''}?`}
        description="This will remove the country and cannot be undone."
        isLoading={deleteCountry.isPending}
        onCancel={() => setTarget(null)}
        onConfirm={() => target && deleteCountry.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </div>
  )
}
