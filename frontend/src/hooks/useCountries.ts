import { useQuery } from '@tanstack/react-query'
import { getCountries } from '@/api/countries'

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
  })
}
