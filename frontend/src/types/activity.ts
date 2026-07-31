import type { GeoLocation, ImageAsset, ImageLike } from '@/types/api'
import type { Country } from '@/types/country'
import type { Town, TownCountryRef } from '@/types/town'

export interface ActivityTownRef {
  id: string
  slug: string
  name: string
}

export interface Activity {
  id: string
  slug: string
  name: string
  description?: string
  price: number
  currency?: string
  images?: ImageLike[]
  location?: GeoLocation
  townId: string
  town?: ActivityTownRef | Town
  countryId?: string
  country?: TownCountryRef | Country
  createdAt?: string
  updatedAt?: string
}

export interface ActivityInput {
  name: string
  slug?: string
  description?: string
  price: number
  currency?: string
  townId: string
  images?: ImageAsset[]
  location?: GeoLocation
}

export interface ActivityFilters {
  town?: string
  country?: string
  q?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}
