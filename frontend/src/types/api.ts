export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiErrorBody {
  error: {
    message: string
    details?: unknown
  }
}

/** An uploaded/selected image. Some backend responses may return a bare URL string. */
export interface ImageAsset {
  url: string
  publicId?: string
  width?: number
  height?: number
}

export type ImageLike = string | ImageAsset

export interface GeoLocation {
  lat: number
  lng: number
}

export interface ListParams {
  page?: number
  limit?: number
}
