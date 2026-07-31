import { z } from 'zod'
import { imageAssetSchema } from '@/lib/schemas/countrySchema'

export const activitySchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  description: z.string().trim().max(4000, 'Keep it under 4000 characters').optional().or(z.literal('')),
  price: z.number('Enter a price').nonnegative('Price cannot be negative'),
  currency: z.string().trim().length(3, 'Use a 3-letter currency code').optional().or(z.literal('')),
  townId: z.string().trim().min(1, 'Choose a town'),
  images: z.array(imageAssetSchema),
  location: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
})

export type ActivityFormValues = z.infer<typeof activitySchema>
