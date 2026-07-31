import slugifyLib from "slugify";
import type { Model } from "mongoose";

export function slugify(text: string): string {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

/**
 * Ensures a unique slug for the given model by appending -2, -3, ... on collisions.
 * `excludeId` allows a document to keep its own slug during updates.
 */
export async function ensureUniqueSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  base: string,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(base) || "item";
  let candidate = baseSlug;
  let suffix = 2;

  for (;;) {
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const existing = await model.findOne(query).select("_id").lean();
    if (!existing) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export default slugify;
