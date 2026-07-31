import { useQuery } from '@tanstack/react-query'
import { getTowns } from '@/api/towns'

export function useTowns(countrySlug?: string) {
  return useQuery({
    queryKey: ['towns', countrySlug ?? 'all'],
    queryFn: () => getTowns(countrySlug),
  })
}
