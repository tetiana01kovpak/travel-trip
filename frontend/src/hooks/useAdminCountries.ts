import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminCreateCountry,
  adminDeleteCountry,
  adminGetCountry,
  adminListCountries,
  adminUpdateCountry,
} from '@/api/countries'
import type { ApiError } from '@/api/client'
import type { ListParams } from '@/types/api'
import type { CountryInput } from '@/types/country'

export function useAdminCountries(params: ListParams = {}) {
  return useQuery({
    queryKey: ['admin', 'countries', params],
    queryFn: () => adminListCountries(params),
    placeholderData: (prev) => prev,
  })
}

export function useAdminCountry(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'country', id],
    queryFn: () => adminGetCountry(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CountryInput) => adminCreateCountry(input),
    onSuccess: () => {
      toast.success('Country created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'countries'] })
      queryClient.invalidateQueries({ queryKey: ['countries'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not create country'),
  })
}

export function useUpdateCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CountryInput> }) =>
      adminUpdateCountry(id, input),
    onSuccess: () => {
      toast.success('Country updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'countries'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'country'] })
      queryClient.invalidateQueries({ queryKey: ['countries'] })
      queryClient.invalidateQueries({ queryKey: ['country'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not update country'),
  })
}

export function useDeleteCountry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminDeleteCountry(id),
    onSuccess: () => {
      toast.success('Country deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'countries'] })
      queryClient.invalidateQueries({ queryKey: ['countries'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not delete country'),
  })
}
