import { useQuery } from '@tanstack/react-query'
import { getTown } from '@/api/towns'

export function useTown(slug: string | undefined) {
  return useQuery({
    queryKey: ['town', slug],
    queryFn: () => getTown(slug as string),
    enabled: Boolean(slug),
  })
}
