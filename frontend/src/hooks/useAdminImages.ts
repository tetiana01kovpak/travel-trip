import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { adminSearchImages, adminUploadImage, type PixabaySearchParams } from '@/api/images'
import type { ApiError } from '@/api/client'

export function usePixabaySearch(params: PixabaySearchParams | undefined) {
  return useQuery({
    queryKey: ['admin', 'images', 'search', params],
    queryFn: () => adminSearchImages(params as PixabaySearchParams),
    enabled: Boolean(params && params.q.trim().length > 0),
    staleTime: 5 * 60_000,
  })
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (imageUrl: string) => adminUploadImage(imageUrl),
    onError: (error: ApiError) => toast.error(error.message || 'Could not use that image'),
  })
}
