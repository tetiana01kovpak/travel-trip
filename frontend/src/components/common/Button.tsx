import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap cursor-pointer disabled:cursor-not-allowed'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-lagoon-600 text-white shadow-soft hover:bg-lagoon-700',
  secondary: 'bg-lagoon-50 text-lagoon-700 hover:bg-lagoon-100',
  outline: 'border border-slate-300 text-slate-700 bg-white hover:border-lagoon-400 hover:text-lagoon-700',
  ghost: 'text-slate-600 hover:bg-slate-100',
  cta: 'bg-gradient-to-r from-coral-500 to-coral-400 text-white shadow-lift hover:from-coral-600 hover:to-coral-500',
  danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
}

export interface ButtonClassOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

/** Shared class builder so non-<button> elements (e.g. router `Link`s) can look like buttons. */
export function buttonClasses({ variant = 'primary', size = 'md', className }: ButtonClassOptions = {}): string {
  return cn(base, variantClasses[variant], sizeClasses[size], className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!isLoading ? rightIcon : null}
    </button>
  )
})
