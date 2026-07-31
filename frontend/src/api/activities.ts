import { apiFetch, buildQuery } from '@/api/client'
import { refId, refObject } from '@/api/mappers'
import type { ListParams, Paginated } from '@/types/api'
import type { Activity, ActivityFilters, ActivityInput, ActivityTownRef } from '@/types/activity'
import type { TownCountryRef } from '@/types/town'

interface ActivityWire extends Omit<Activity, 'town' | 'country' | 'townId' | 'countryId'> {
  town?: unknown
  country?: unknown
}

function mapActivity(raw: ActivityWire): Activity {
  const { town, country, ...rest } = raw
  return {
    ...rest,
    townId: refId(town) ?? '',
    town: refObject<ActivityTownRef>(town),
    countryId: refId(country),
    country: refObject<TownCountryRef>(country),
  }
}

function toActivityWireBody(input: Partial<ActivityInput>): Record<string, unknown> {
  const { townId, ...rest } = input
  return { ...rest, ...(townId !== undefined ? { town: townId } : {}) }
}

export async function getActivities(filters: ActivityFilters = {}): Promise<Paginated<Activity>> {
  const page = await apiFetch<Paginated<ActivityWire>>(`/api/activities${buildQuery({ ...filters })}`)
  return { ...page, items: page.items.map(mapActivity) }
}

export async function getActivity(slug: string): Promise<Activity> {
  const raw = await apiFetch<ActivityWire>(`/api/activities/${encodeURIComponent(slug)}`)
  return mapActivity(raw)
}

// --- Admin ---

export interface AdminActivityListParams extends ListParams {
  town?: string
  country?: string
  q?: string
}

export async function adminListActivities(
  params: AdminActivityListParams = {},
): Promise<Paginated<Activity>> {
  const page = await apiFetch<Paginated<ActivityWire>>(`/api/admin/activities${buildQuery(params)}`)
  return { ...page, items: page.items.map(mapActivity) }
}

export async function adminGetActivity(id: string): Promise<Activity> {
  const raw = await apiFetch<ActivityWire>(`/api/admin/activities/${id}`)
  return mapActivity(raw)
}

export async function adminCreateActivity(input: ActivityInput): Promise<Activity> {
  const raw = await apiFetch<ActivityWire>('/api/admin/activities', {
    method: 'POST',
    json: toActivityWireBody(input),
  })
  return mapActivity(raw)
}

export async function adminUpdateActivity(
  id: string,
  input: Partial<ActivityInput>,
): Promise<Activity> {
  const raw = await apiFetch<ActivityWire>(`/api/admin/activities/${id}`, {
    method: 'PATCH',
    json: toActivityWireBody(input),
  })
  return mapActivity(raw)
}

export function adminDeleteActivity(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/activities/${id}`, { method: 'DELETE' })
}
