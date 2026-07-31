import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminGetBooking, adminListBookings, adminUpdateBookingStatus } from '@/api/bookings'
import type { ApiError } from '@/api/client'
import type { AdminBookingFilters, BookingStatus } from '@/types/booking'

export function useAdminBookings(filters: AdminBookingFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'bookings', filters],
    queryFn: () => adminListBookings(filters),
    placeholderData: (prev) => prev,
  })
}

export function useAdminBooking(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'booking', id],
    queryFn: () => adminGetBooking(id as string),
    enabled: Boolean(id),
  })
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      adminUpdateBookingStatus(id, status),
    onSuccess: () => {
      toast.success('Booking updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'booking'] })
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Could not update booking')
    },
  })
}
