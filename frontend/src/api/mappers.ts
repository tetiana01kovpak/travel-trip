import type { ImageAsset } from '@/types/api'

/** Extracts an id whether the ref is a raw id string or a populated `{id, ...}` object. */
export function refId(ref: unknown): string | undefined {
  if (!ref) return undefined
  if (typeof ref === 'string') return ref
  if (typeof ref === 'object' && 'id' in ref) return (ref as { id?: string }).id
  return undefined
}

/** Returns the ref as an object only when it's actually populated (not a raw id string). */
export function refObject<T>(ref: unknown): T | undefined {
  return ref && typeof ref === 'object' ? (ref as T) : undefined
}

/** The backend stores Country/Town/BlogPost cover images as a single `imageUrl`/`imagePublicId`
 * pair, but the app's shared types model every entity's images as an array. */
export function coverImageToArray(imageUrl?: string, imagePublicId?: string): ImageAsset[] {
  return imageUrl ? [{ url: imageUrl, publicId: imagePublicId }] : []
}

export function firstImageToCoverFields(images?: ImageAsset[] | undefined): {
  imageUrl: string
  imagePublicId: string
} {
  return { imageUrl: images?.[0]?.url ?? '', imagePublicId: images?.[0]?.publicId ?? '' }
}
