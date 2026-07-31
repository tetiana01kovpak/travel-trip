import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { BookingStepDetails } from '@/components/booking/BookingStepDetails'
import { BookingStepPayment } from '@/components/booking/BookingStepPayment'
import { useCreateBooking } from '@/hooks/useCreateBooking'
import { bookingSchema } from '@/lib/schemas/bookingSchema'
import type { BookingFormValues } from '@/lib/schemas/bookingSchema'
import { formatCurrency } from '@/lib/formatters'
import { paths } from '@/router/paths'
import { cn } from '@/lib/cn'
import type { Activity } from '@/types/activity'

export interface BookingModalProps {
  open: boolean
  onClose: () => void
  activity: Activity
}

type Step = 'details' | 'payment'

const DETAIL_FIELDS = ['fullName', 'email', 'phone', 'travelDate', 'numberOfTravelers'] as const

export function BookingModal({ open, onClose, activity }: BookingModalProps) {
  const [step, setStep] = useState<Step>('details')
  const navigate = useNavigate()
  const createBooking = useCreateBooking()

  const methods = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      travelDate: '',
      numberOfTravelers: 1,
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  })

  function handleClose() {
    onClose()
    setStep('details')
    methods.reset()
  }

  async function goToPayment() {
    const valid = await methods.trigger(DETAIL_FIELDS)
    if (valid) setStep('payment')
  }

  function onSubmit(values: BookingFormValues) {
    createBooking.mutate(
      {
        activityId: activity.id,
        traveler: { fullName: values.fullName, email: values.email, phone: values.phone },
        travelDate: values.travelDate,
        numberOfTravelers: values.numberOfTravelers,
        card: {
          cardholderName: values.cardholderName,
          cardNumber: values.cardNumber,
          expiry: values.expiry,
          cvv: values.cvv,
        },
      },
      {
        onSuccess: (data) => {
          handleClose()
          navigate(paths.ticket(data.ticketCode))
        },
      },
    )
  }

  const travelerCount = Number(methods.watch('numberOfTravelers')) || 1
  const estimatedTotal = travelerCount * activity.price

  return (
    <Modal open={open} onClose={handleClose} title={`Book ${activity.name}`} size="lg">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span className={cn(step === 'details' && 'text-lagoon-600')}>1. Details</span>
            <span className="h-px flex-1 bg-slate-200" />
            <span className={cn(step === 'payment' && 'text-lagoon-600')}>2. Payment</span>
          </div>

          {step === 'details' ? <BookingStepDetails /> : <BookingStepPayment />}

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
            <span className="text-slate-500">Estimated total ({travelerCount} traveler{travelerCount === 1 ? '' : 's'})</span>
            <span className="font-display text-lg font-bold text-slate-900">
              {formatCurrency(estimatedTotal, activity.currency ?? 'USD')}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
            {step === 'payment' ? (
              <Button type="button" variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
            ) : null}
            {step === 'details' ? (
              <Button type="button" variant="primary" onClick={goToPayment}>
                Continue to payment
              </Button>
            ) : (
              <Button type="submit" variant="cta" isLoading={createBooking.isPending}>
                Confirm booking
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}
