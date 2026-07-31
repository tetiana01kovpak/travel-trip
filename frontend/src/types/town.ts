import type { ImageAsset, ImageLike } from '@/types/api'
import type { Activity } from '@/types/activity'
import type { Country } from '@/types/country'

export interface TownCountryRef {
  id: string
  slug: string
  name: string
}

export interface Town {
  id: string
  slug: string
  name: string
  description?: string
  images?: ImageLike[]
  countryId: string
  country?: TownCountryRef | Country
  activities?: Activity[]
  activityCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface TownInput {
  name: string
  slug?: string
  description?: string
  countryId: string
  images?: ImageAsset[]
}
