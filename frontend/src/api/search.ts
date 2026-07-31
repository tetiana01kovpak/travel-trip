import { apiFetch, buildQuery } from '@/api/client'
import type { Activity } from '@/types/activity'
import type { Country } from '@/types/country'
import type { Town } from '@/types/town'

export interface SearchResults {
  countries: Country[]
  towns: Town[]
  activities: Activity[]
}

export function search(q: string): Promise<SearchResults> {
  return apiFetch<SearchResults>(`/api/search${buildQuery({ q })}`)
}
