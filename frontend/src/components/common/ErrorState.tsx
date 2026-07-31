import { AlertTriangle, RotateCw } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { cn } from '@/lib/cn'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-500">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-800">{title}</h3>
      {message ? <p className="max-w-sm text-sm text-slate-500">{message}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCw className="size-4" />}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
