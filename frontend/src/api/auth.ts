import { apiFetch } from '@/api/client'
import type { AdminUser, LoginInput } from '@/types/admin'

export function login(input: LoginInput): Promise<AdminUser> {
  return apiFetch<AdminUser>('/api/admin/login', { method: 'POST', json: input })
}

export function logout(): Promise<void> {
  return apiFetch<void>('/api/admin/logout', { method: 'POST' })
}

export function getMe(): Promise<AdminUser> {
  return apiFetch<AdminUser>('/api/admin/me')
}
