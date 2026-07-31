import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBooking } from '@/api/bookings'
import type { ApiError } from '@/api/client'
import type { CreateBookingInput } from '@/types/booking'

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: () => {
      toast.success('Booking confirmed! Your ticket is ready.')
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'We could not complete your booking. Please try again.')
    },
  })
}
