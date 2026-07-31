import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminCreateTown,
  adminDeleteTown,
  adminGetTown,
  adminListTowns,
  adminUpdateTown,
  type AdminTownListParams,
} from '@/api/towns'
import type { ApiError } from '@/api/client'
import type { TownInput } from '@/types/town'

export function useAdminTowns(params: AdminTownListParams = {}) {
  return useQuery({
    queryKey: ['admin', 'towns', params],
    queryFn: () => adminListTowns(params),
    placeholderData: (prev) => prev,
  })
}

export function useAdminTown(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'town', id],
    queryFn: () => adminGetTown(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateTown() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TownInput) => adminCreateTown(input),
    onSuccess: () => {
      toast.success('Town created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'towns'] })
      queryClient.invalidateQueries({ queryKey: ['towns'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not create town'),
  })
}

export function useUpdateTown() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<TownInput> }) =>
      adminUpdateTown(id, input),
    onSuccess: () => {
      toast.success('Town updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'towns'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'town'] })
      queryClient.invalidateQueries({ queryKey: ['towns'] })
      queryClient.invalidateQueries({ queryKey: ['town'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not update town'),
  })
}

export function useDeleteTown() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminDeleteTown(id),
    onSuccess: () => {
      toast.success('Town deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'towns'] })
      queryClient.invalidateQueries({ queryKey: ['towns'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not delete town'),
  })
}
