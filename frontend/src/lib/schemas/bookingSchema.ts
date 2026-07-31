import { z } from 'zod'

export const bookingDetailsSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .regex(/^[+()0-9 .-]{7,20}$/, 'Enter a valid phone number'),
  travelDate: z
    .string()
    .min(1, 'Choose a travel date')
    .refine((value) => {
      const date = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return !Number.isNaN(date.getTime()) && date >= today
    }, 'Travel date must be today or later'),
  numberOfTravelers: z
    .number({ error: 'Enter the number of travelers' })
    .int('Whole numbers only')
    .min(1, 'At least 1 traveler')
    .max(20, 'Max 20 travelers per booking'),
})

export const bookingPaymentSchema = z.object({
  cardholderName: z.string().trim().min(2, 'Enter the name on the card'),
  cardNumber: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, ''))
    .pipe(z.string().regex(/^[0-9]{13,19}$/, 'Enter a valid card number')),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Use MM/YY format'),
  cvv: z.string().trim().regex(/^[0-9]{3,4}$/, 'Enter a valid CVV'),
})

export const bookingSchema = bookingDetailsSchema.extend(bookingPaymentSchema.shape)

export type BookingDetailsValues = z.infer<typeof bookingDetailsSchema>
export type BookingPaymentValues = z.infer<typeof bookingPaymentSchema>
export type BookingFormValues = z.infer<typeof bookingSchema>
