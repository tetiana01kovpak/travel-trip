import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { logout } from '@/api/auth'
import { paths } from '@/router/paths'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(['admin', 'me'], null)
      toast.success('Signed out')
      navigate(paths.adminLogin, { replace: true })
    },
    onError: () => {
      // Even if the server call fails, drop the local session so the UI stays consistent.
      queryClient.setQueryData(['admin', 'me'], null)
      navigate(paths.adminLogin, { replace: true })
    },
  })
}
