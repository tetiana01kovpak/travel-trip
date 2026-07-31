import { z } from 'zod'
import { imageAssetSchema } from '@/lib/schemas/countrySchema'

export const townSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  description: z.string().trim().max(4000, 'Keep it under 4000 characters').optional().or(z.literal('')),
  countryId: z.string().trim().min(1, 'Choose a country'),
  images: z.array(imageAssetSchema),
})

export type TownFormValues = z.infer<typeof townSchema>
