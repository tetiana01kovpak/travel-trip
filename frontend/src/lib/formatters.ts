import type { ImageAsset, ImageLike } from '@/types/api'

export function formatCurrency(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDate(value: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  }).format(date)
}

export function formatDateShort(value: string | Date): string {
  return formatDate(value, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Accepts either a plain URL string or an `{ url }` image object and returns a safe src. */
export function imageUrl(image: ImageLike | undefined | null, fallback = ''): string {
  if (!image) return fallback
  if (typeof image === 'string') return image
  return image.url || fallback
}

export function firstImageUrl(images: ImageLike[] | undefined | null, fallback = ''): string {
  if (!images || images.length === 0) return fallback
  return imageUrl(images[0], fallback)
}

/** Normalizes a list of `ImageLike` (string or object) into full `ImageAsset` objects for form state. */
export function toImageAssets(images: ImageLike[] | undefined | null): ImageAsset[] {
  if (!images) return []
  return images.map((image) => (typeof image === 'string' ? { url: image } : image))
}

export function truncate(text: string, length = 140): string {
  if (text.length <= length) return text
  return `${text.slice(0, length).trimEnd()}…`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
