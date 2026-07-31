import { API_BASE_URL } from '@/lib/constants'

/** Mongo documents come back with `_id`; the app's types use `id`. Recursively mirror it in. */
function normalizeIds(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeIds)
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = normalizeIds(val)
    }
    if (typeof out._id === 'string' && typeof out.id !== 'string') {
      out.id = out._id
    }
    return out
  }
  return value
}

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  /** JSON-serializable request body. Sets Content-Type and stringifies for you. */
  json?: unknown
  body?: BodyInit | null
}

export async function apiFetch<T>(path: string, opts: ApiFetchOptions = {}): Promise<T> {
  const { json, headers, body, ...rest } = opts

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : body,
    })
  } catch {
    throw new ApiError('Could not reach the server. Please check your connection and try again.', 0)
  }

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  let data: unknown = undefined
  if (text) {
    try {
      data = normalizeIds(JSON.parse(text))
    } catch {
      data = undefined
    }
  }

  if (!res.ok) {
    const body = data as { error?: { message?: string; details?: unknown } } | undefined
    const message = body?.error?.message || res.statusText || 'Something went wrong'
    throw new ApiError(message, res.status, body?.error?.details)
  }

  return data as T
}

export function buildQuery(params: object): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}
