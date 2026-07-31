import { apiFetch, buildQuery } from '@/api/client'
import type { PixabaySearchResponse, UploadImageResponse } from '@/types/admin'

export interface PixabaySearchParams {
  q: string
  page?: number
  perPage?: number
}

export function adminSearchImages(params: PixabaySearchParams): Promise<PixabaySearchResponse> {
  return apiFetch<PixabaySearchResponse>(`/api/admin/images/pixabay-search${buildQuery(params)}`)
}

export function adminUploadImage(imageUrl: string): Promise<UploadImageResponse> {
  return apiFetch<UploadImageResponse>('/api/admin/images/upload', {
    method: 'POST',
    json: { imageUrl },
  })
}
