import { z } from 'zod'
import { imageAssetSchema } from '@/lib/schemas/countrySchema'

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only')
    .optional()
    .or(z.literal('')),
  excerpt: z.string().trim().max(300, 'Keep the excerpt under 300 characters').optional().or(z.literal('')),
  body: z.string().trim().min(20, 'Write at least 20 characters'),
  images: z.array(imageAssetSchema),
})

export type BlogPostFormValues = z.infer<typeof blogPostSchema>
