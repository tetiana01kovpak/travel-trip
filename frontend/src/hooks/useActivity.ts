import { useQuery } from '@tanstack/react-query'
import { getActivity } from '@/api/activities'

export function useActivity(slug: string | undefined) {
  return useQuery({
    queryKey: ['activity', slug],
    queryFn: () => getActivity(slug as string),
    enabled: Boolean(slug),
  })
}
