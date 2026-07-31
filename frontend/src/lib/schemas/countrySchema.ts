import { z } from 'zod'

export const imageAssetSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  publicId: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

export const countrySchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  description: z.string().trim().max(4000, 'Keep it under 4000 characters').optional().or(z.literal('')),
  images: z.array(imageAssetSchema),
})

export type CountryFormValues = z.infer<typeof countrySchema>
