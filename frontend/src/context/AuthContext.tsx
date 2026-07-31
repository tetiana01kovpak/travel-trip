import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/api/auth'
import type { AdminUser } from '@/types/admin'

interface AuthContextValue {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'me'],
    queryFn: getMe,
    retry: false,
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      user: data ?? null,
      isAuthenticated: Boolean(data),
      isLoading,
    }),
    [data, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return ctx
}
