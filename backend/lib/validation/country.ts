import { z } from "zod";

export const createCountrySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  imagePublicId: z.string().optional().default(""),
});

export const updateCountrySchema = createCountrySchema.partial();

export type CreateCountryInput = z.infer<typeof createCountrySchema>;
export type UpdateCountryInput = z.infer<typeof updateCountrySchema>;
