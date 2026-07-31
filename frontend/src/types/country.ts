import type { ImageAsset, ImageLike } from '@/types/api'
import type { Town } from '@/types/town'

export interface Country {
  id: string
  slug: string
  name: string
  description?: string
  images?: ImageLike[]
  towns?: Town[]
  townCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface CountryInput {
  name: string
  slug?: string
  description?: string
  images?: ImageAsset[]
}
