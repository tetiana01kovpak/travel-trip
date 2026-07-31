import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { FormField, formInputClass } from '@/components/common/FormField'
import { useAuth } from '@/hooks/useAuth'
import { useLogin } from '@/hooks/useLogin'
import { loginSchema } from '@/lib/schemas/loginSchema'
import type { LoginFormValues } from '@/lib/schemas/loginSchema'
import { paths } from '@/router/paths'
import { SITE_NAME } from '@/lib/constants'

export default function AdminLoginPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  if (!authLoading && isAuthenticated) {
    return <Navigate to={paths.adminDashboard} replace />
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-lagoon-900 via-lagoon-800 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lift">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
            <LogIn className="size-6" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">{SITE_NAME} Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage bookings and content.</p>
        </div>

        <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
          <FormField label="Username" error={errors.username?.message}>
            <input {...register('username')} className={formInputClass} autoComplete="username" autoFocus />
          </FormField>
          <FormField label="Password" error={errors.password?.message}>
            <input
              type="password"
              {...register('password')}
              className={formInputClass}
              autoComplete="current-password"
            />
          </FormField>
          <Button type="submit" variant="primary" className="w-full" isLoading={login.isPending}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
