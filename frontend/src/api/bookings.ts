import { apiFetch, buildQuery } from '@/api/client'
import { refId } from '@/api/mappers'
import type { Paginated } from '@/types/api'
import type {
  AdminBooking,
  AdminBookingFilters,
  BookingStatus,
  CreateBookingInput,
  CreateBookingResponse,
  Ticket,
} from '@/types/booking'

interface AdminBookingWire extends Omit<AdminBooking, 'activity'> {
  activity?: unknown
  snapshot?: { activityName?: string; activitySlug?: string }
}

function mapAdminBooking(raw: AdminBookingWire): AdminBooking {
  const { activity, snapshot, ...rest } = raw
  const id = refId(activity)
  const name = snapshot?.activityName
  const slug = snapshot?.activitySlug
  return { ...rest, activity: id && name && slug ? { id, name, slug } : undefined }
}

export function createBooking(input: CreateBookingInput): Promise<CreateBookingResponse> {
  return apiFetch<CreateBookingResponse>('/api/bookings', { method: 'POST', json: input })
}

export function getTicket(code: string): Promise<Ticket> {
  return apiFetch<Ticket>(`/api/tickets/${encodeURIComponent(code)}`)
}

// --- Admin ---

export async function adminListBookings(
  params: AdminBookingFilters = {},
): Promise<Paginated<AdminBooking>> {
  const page = await apiFetch<Paginated<AdminBookingWire>>(`/api/admin/bookings${buildQuery(params)}`)
  return { ...page, items: page.items.map(mapAdminBooking) }
}

export async function adminGetBooking(id: string): Promise<AdminBooking> {
  const raw = await apiFetch<AdminBookingWire>(`/api/admin/bookings/${id}`)
  return mapAdminBooking(raw)
}

export async function adminUpdateBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<AdminBooking> {
  const raw = await apiFetch<AdminBookingWire>(`/api/admin/bookings/${id}`, {
    method: 'PATCH',
    json: { status },
  })
  return mapAdminBooking(raw)
}
