import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface FormFieldProps {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  className?: string
  children: ReactNode
}

export function FormField({ label, htmlFor, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn('block text-sm', className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

export const formInputClass =
  'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-lagoon-400 focus:ring-2 focus:ring-lagoon-100'
