import { z } from "zod";

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const createTownSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  country: z.string().min(1, "country is required"),
  description: z.string().optional().default(""),
  location: locationSchema.optional(),
  imageUrl: z.string().optional().default(""),
  imagePublicId: z.string().optional().default(""),
});

export const updateTownSchema = createTownSchema.partial();

export type CreateTownInput = z.infer<typeof createTownSchema>;
export type UpdateTownInput = z.infer<typeof updateTownSchema>;
