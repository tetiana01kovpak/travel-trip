import { useQuery } from '@tanstack/react-query'
import { getCountry } from '@/api/countries'

export function useCountry(slug: string | undefined) {
  return useQuery({
    queryKey: ['country', slug],
    queryFn: () => getCountry(slug as string),
    enabled: Boolean(slug),
  })
}
