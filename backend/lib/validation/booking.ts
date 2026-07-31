import { z } from "zod";

export const createBookingSchema = z.object({
  activityId: z.string().min(1, "activityId is required"),
  traveler: z.object({
    fullName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
  }),
  travelDate: z.string().min(1, "travelDate is required"),
  numberOfTravelers: z.number().int().min(1),
  card: z.object({
    cardholderName: z.string().trim().min(1),
    cardNumber: z.string().trim().min(12).max(19),
    expiry: z.string().trim().min(4),
    cvv: z.string().trim().min(3).max(4),
  }),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "cancelled"]),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
