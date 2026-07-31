import { useQuery } from '@tanstack/react-query'
import { getActivities } from '@/api/activities'
import type { ActivityFilters } from '@/types/activity'

export function useActivities(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => getActivities(filters),
    placeholderData: (prev) => prev,
  })
}
