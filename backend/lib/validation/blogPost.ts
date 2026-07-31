import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  excerpt: z.string().optional().default(""),
  content: z.string().min(1, "content is required"),
  coverImageUrl: z.string().optional().default(""),
  coverImagePublicId: z.string().optional().default(""),
  relatedCountry: z.string().optional().nullable(),
  relatedTown: z.string().optional().nullable(),
  author: z.string().optional().default("Admin"),
  published: z.boolean().optional().default(true),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
