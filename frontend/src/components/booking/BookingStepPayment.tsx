import type { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import { ShieldCheck } from 'lucide-react'
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

export function BookingStepPayment() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormValues>()

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl bg-lagoon-50 px-4 py-3 text-xs text-lagoon-800">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        <p>
          This is a simulated demo checkout. No real card is charged and no payment details are
          stored.
        </p>
      </div>

      <Field label="Cardholder name" error={errors.cardholderName?.message}>
        <input {...register('cardholderName')} className={inputClass} placeholder="Jane Doe" autoComplete="cc-name" />
      </Field>
      <Field label="Card number" error={errors.cardNumber?.message}>
        <input
          inputMode="numeric"
          {...register('cardNumber')}
          className={inputClass}
          placeholder="4111 1111 1111 1111"
          autoComplete="cc-number"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Expiry (MM/YY)" error={errors.expiry?.message}>
          <input {...register('expiry')} className={inputClass} placeholder="12/29" autoComplete="cc-exp" />
        </Field>
        <Field label="CVV" error={errors.cvv?.message}>
          <input
            inputMode="numeric"
            {...register('cvv')}
            className={inputClass}
            placeholder="123"
            autoComplete="cc-csc"
          />
        </Field>
      </div>
    </div>
  )
}
