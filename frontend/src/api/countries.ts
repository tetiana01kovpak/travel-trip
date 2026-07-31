import { apiFetch, buildQuery } from '@/api/client'
import { coverImageToArray, firstImageToCoverFields } from '@/api/mappers'
import type { ListParams, Paginated } from '@/types/api'
import type { Country, CountryInput } from '@/types/country'

interface CountryWire extends Omit<Country, 'images'> {
  imageUrl?: string
  imagePublicId?: string
}

function mapCountry(raw: CountryWire): Country {
  const { imageUrl, imagePublicId, ...rest } = raw
  return { ...rest, images: coverImageToArray(imageUrl, imagePublicId) }
}

function toCountryWireBody(input: Partial<CountryInput>): Record<string, unknown> {
  const { images, ...rest } = input
  return { ...rest, ...(images !== undefined ? firstImageToCoverFields(images) : {}) }
}

export async function getCountries(): Promise<Paginated<Country>> {
  const page = await apiFetch<Paginated<CountryWire>>('/api/countries')
  return { ...page, items: page.items.map(mapCountry) }
}

export async function getCountry(slug: string): Promise<Country> {
  const raw = await apiFetch<CountryWire>(`/api/countries/${encodeURIComponent(slug)}`)
  return mapCountry(raw)
}

// --- Admin ---

export async function adminListCountries(params: ListParams = {}): Promise<Paginated<Country>> {
  const page = await apiFetch<Paginated<CountryWire>>(`/api/admin/countries${buildQuery(params)}`)
  return { ...page, items: page.items.map(mapCountry) }
}

export async function adminGetCountry(id: string): Promise<Country> {
  const raw = await apiFetch<CountryWire>(`/api/admin/countries/${id}`)
  return mapCountry(raw)
}

export async function adminCreateCountry(input: CountryInput): Promise<Country> {
  const raw = await apiFetch<CountryWire>('/api/admin/countries', {
    method: 'POST',
    json: toCountryWireBody(input),
  })
  return mapCountry(raw)
}

export async function adminUpdateCountry(id: string, input: Partial<CountryInput>): Promise<Country> {
  const raw = await apiFetch<CountryWire>(`/api/admin/countries/${id}`, {
    method: 'PATCH',
    json: toCountryWireBody(input),
  })
  return mapCountry(raw)
}

export function adminDeleteCountry(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/countries/${id}`, { method: 'DELETE' })
}
