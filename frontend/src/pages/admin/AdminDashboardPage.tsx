import { useState } from 'react'
import { useAdminBookings } from '@/hooks/useAdminBookings'
import { BookingsTable } from '@/components/admin/BookingsTable'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { ADMIN_PAGE_SIZE } from '@/lib/constants'

const statusOptions = ['', 'pending', 'confirmed', 'completed', 'cancelled']

export default function AdminDashboardPage() {
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError, refetch } = useAdminBookings({
    status: status || undefined,
    q: q || undefined,
    page,
    limit: ADMIN_PAGE_SIZE,
  })

  const bookings = data?.items ?? []

  function updateQ(value: string) {
    setQ(value)
    setPage(1)
  }

  function updateStatus(value: string) {
    setStatus(value)
    setPage(1)
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Recent bookings across all activities.</p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total bookings" value={data?.total ?? (isLoading ? '—' : 0)} />
        <StatCard label="On this page" value={bookings.length} />
        <StatCard label="Filtered status" value={status ? status : 'All'} />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => updateQ(e.target.value)}
          placeholder="Search traveler name or email…"
          className="min-w-56 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-lagoon-400"
        />
        <select
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-lagoon-400"
        >
          {statusOptions.map((s) => (
            <option key={s || 'all'} value={s}>
              {s ? s[0].toUpperCase() + s.slice(1) : 'All statuses'}
            </option>
          ))}
        </select>
      </div>

      {isError ? (
        <ErrorState message="We couldn't load bookings." onRetry={() => refetch()} />
      ) : (
        <>
          <BookingsTable bookings={bookings} isLoading={isLoading} />
          <div className="mt-6">
            <Pagination page={data?.page ?? page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}
