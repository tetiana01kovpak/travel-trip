import { apiFetch, buildQuery } from '@/api/client'
import { coverImageToArray, firstImageToCoverFields, refId, refObject } from '@/api/mappers'
import type { ListParams, Paginated } from '@/types/api'
import type { Town, TownCountryRef, TownInput } from '@/types/town'

interface TownWire extends Omit<Town, 'images' | 'country' | 'countryId'> {
  imageUrl?: string
  imagePublicId?: string
  country?: unknown
}

function mapTown(raw: TownWire): Town {
  const { imageUrl, imagePublicId, country, ...rest } = raw
  return {
    ...rest,
    images: coverImageToArray(imageUrl, imagePublicId),
    countryId: refId(country) ?? '',
    country: refObject<TownCountryRef>(country),
  }
}

function toTownWireBody(input: Partial<TownInput>): Record<string, unknown> {
  const { countryId, images, ...rest } = input
  return {
    ...rest,
    ...(countryId !== undefined ? { country: countryId } : {}),
    ...(images !== undefined ? firstImageToCoverFields(images) : {}),
  }
}

export async function getTowns(countrySlug?: string): Promise<Paginated<Town>> {
  const page = await apiFetch<Paginated<TownWire>>(`/api/towns${buildQuery({ country: countrySlug })}`)
  return { ...page, items: page.items.map(mapTown) }
}

export async function getTown(slug: string): Promise<Town> {
  const raw = await apiFetch<TownWire>(`/api/towns/${encodeURIComponent(slug)}`)
  return mapTown(raw)
}

// --- Admin ---

export interface AdminTownListParams extends ListParams {
  country?: string
}

export async function adminListTowns(params: AdminTownListParams = {}): Promise<Paginated<Town>> {
  const page = await apiFetch<Paginated<TownWire>>(`/api/admin/towns${buildQuery(params)}`)
  return { ...page, items: page.items.map(mapTown) }
}

export async function adminGetTown(id: string): Promise<Town> {
  const raw = await apiFetch<TownWire>(`/api/admin/towns/${id}`)
  return mapTown(raw)
}

export async function adminCreateTown(input: TownInput): Promise<Town> {
  const raw = await apiFetch<TownWire>('/api/admin/towns', { method: 'POST', json: toTownWireBody(input) })
  return mapTown(raw)
}

export async function adminUpdateTown(id: string, input: Partial<TownInput>): Promise<Town> {
  const raw = await apiFetch<TownWire>(`/api/admin/towns/${id}`, {
    method: 'PATCH',
    json: toTownWireBody(input),
  })
  return mapTown(raw)
}

export function adminDeleteTown(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/towns/${id}`, { method: 'DELETE' })
}
