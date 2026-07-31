import type { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/cn'
import type { BookingFormValues } from '@/lib/schemas/bookingSchema'

const inputClass =
  'w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-lagoon-400 focus:ring-2 focus:ring-lagoon-100'

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block text-sm', className)}>
      <span className="mb-1.5 block font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  )
}

export function BookingStepDetails() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>()

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.fullName?.message} className="sm:col-span-2">
        <input {...register('fullName')} className={inputClass} placeholder="Jane Doe" autoComplete="name" />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          {...register('email')}
          className={inputClass}
          placeholder="jane@example.com"
          autoComplete="email"
        />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <input {...register('phone')} className={inputClass} placeholder="+1 555 000 0000" autoComplete="tel" />
      </Field>
      <Field label="Travel date" error={errors.travelDate?.message}>
        <input type="date" min={today} {...register('travelDate')} className={inputClass} />
      </Field>
      <Field label="Number of travelers" error={errors.numberOfTravelers?.message}>
        <input
          type="number"
          min={1}
          max={20}
          {...register('numberOfTravelers', { valueAsNumber: true })}
          className={inputClass}
        />
      </Field>
    </div>
  )
}
