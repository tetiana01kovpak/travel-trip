import { z } from "zod";

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const imageSchema = z.object({
  url: z.string(),
  publicId: z.string(),
});

export const createActivitySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  town: z.string().min(1, "town is required"),
  description: z.string().optional().default(""),
  price: z.number().min(0),
  currency: z.string().optional().default("USD"),
  durationMinutes: z.number().optional(),
  location: locationSchema,
  images: z.array(imageSchema).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
});

export const updateActivitySchema = createActivitySchema.partial();

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
