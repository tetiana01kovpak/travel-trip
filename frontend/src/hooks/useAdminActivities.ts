import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  adminCreateActivity,
  adminDeleteActivity,
  adminGetActivity,
  adminListActivities,
  adminUpdateActivity,
  type AdminActivityListParams,
} from '@/api/activities'
import type { ApiError } from '@/api/client'
import type { ActivityInput } from '@/types/activity'

export function useAdminActivities(params: AdminActivityListParams = {}) {
  return useQuery({
    queryKey: ['admin', 'activities', params],
    queryFn: () => adminListActivities(params),
    placeholderData: (prev) => prev,
  })
}

export function useAdminActivity(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'activity', id],
    queryFn: () => adminGetActivity(id as string),
    enabled: Boolean(id),
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ActivityInput) => adminCreateActivity(input),
    onSuccess: () => {
      toast.success('Activity created')
      queryClient.invalidateQueries({ queryKey: ['admin', 'activities'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not create activity'),
  })
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<ActivityInput> }) =>
      adminUpdateActivity(id, input),
    onSuccess: () => {
      toast.success('Activity updated')
      queryClient.invalidateQueries({ queryKey: ['admin', 'activities'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'activity'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['activity'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not update activity'),
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminDeleteActivity(id),
    onSuccess: () => {
      toast.success('Activity deleted')
      queryClient.invalidateQueries({ queryKey: ['admin', 'activities'] })
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
    onError: (error: ApiError) => toast.error(error.message || 'Could not delete activity'),
  })
}
