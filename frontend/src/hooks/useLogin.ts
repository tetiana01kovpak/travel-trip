import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { login } from '@/api/auth'
import { paths } from '@/router/paths'
import type { ApiError } from '@/api/client'
import type { LoginInput } from '@/types/admin'

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin', 'me'], data)
      toast.success(`Welcome back, ${data.username}`)
      navigate(paths.adminDashboard, { replace: true })
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Invalid username or password')
    },
  })
}
