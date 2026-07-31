import { DataTable } from '@/components/admin/DataTable'
import type { DataTableColumn } from '@/components/admin/DataTable'
import { useUpdateBookingStatus } from '@/hooks/useAdminBookings'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'
import type { AdminBooking, BookingStatus } from '@/types/booking'

const statusOptions: BookingStatus[] = ['confirmed', 'cancelled']

export interface BookingsTableProps {
  bookings: AdminBooking[]
  isLoading?: boolean
}

export function BookingsTable({ bookings, isLoading }: BookingsTableProps) {
  const updateStatus = useUpdateBookingStatus()

  const columns: DataTableColumn<AdminBooking>[] = [
    {
      key: 'ticketCode',
      header: 'Ticket',
      render: (b) => <span className="font-mono text-xs font-semibold text-lagoon-700">{b.ticketCode}</span>,
    },
    {
      key: 'traveler',
      header: 'Traveler',
      render: (b) => (
        <div>
          <p className="font-medium text-slate-800">{b.traveler.fullName}</p>
          <p className="text-xs text-slate-400">{b.traveler.email}</p>
        </div>
      ),
    },
    { key: 'activity', header: 'Activity', render: (b) => b.activity?.name ?? '—' },
    { key: 'travelDate', header: 'Travel date', render: (b) => formatDate(b.travelDate) },
    { key: 'travelers', header: 'Travelers', render: (b) => String(b.numberOfTravelers) },
    { key: 'total', header: 'Total', render: (b) => formatCurrency(b.totalPrice, b.currency) },
    {
      key: 'status',
      header: 'Status',
      render: (b) => (
        <select
          value={b.status}
          onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value })}
          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium capitalize outline-none focus:border-lagoon-400"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    { key: 'createdAt', header: 'Booked', render: (b) => formatDateTime(b.createdAt) },
  ]

  return (
    <DataTable
      columns={columns}
      rows={bookings}
      rowKey={(b) => b.id}
      isLoading={isLoading}
      emptyMessage="No bookings yet."
    />
  )
}
