import type { GeoLocation, ImageLike } from '@/types/api'

export interface Traveler {
  fullName: string
  email: string
  phone: string
}

export interface CardDetails {
  cardholderName: string
  cardNumber: string
  expiry: string
  cvv: string
}

export interface CreateBookingInput {
  activityId: string
  traveler: Traveler
  travelDate: string
  numberOfTravelers: number
  card: CardDetails
}

export interface CreateBookingResponse {
  bookingId: string
  ticketCode: string
  totalPrice: number
  currency: string
  status: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | (string & {})

export interface AdminBooking {
  id: string
  ticketCode: string
  traveler: Traveler
  travelDate: string
  numberOfTravelers: number
  totalPrice: number
  currency: string
  status: BookingStatus
  activity?: { id: string; name: string; slug: string }
  createdAt: string
  updatedAt?: string
}

export interface AdminBookingFilters {
  status?: string
  q?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface TicketRef {
  name: string
  slug: string
}

export interface Ticket {
  ticketCode: string
  status: string
  traveler: Traveler
  travelDate: string
  numberOfTravelers: number
  totalPrice: number
  currency: string
  activity: TicketRef & { description?: string; images?: ImageLike[] }
  town: TicketRef
  country: TicketRef
  location: GeoLocation
  createdAt: string
}
