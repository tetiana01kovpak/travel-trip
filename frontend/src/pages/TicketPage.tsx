import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTicket } from '@/api/bookings'
import { TicketView } from '@/components/booking/TicketView'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/common/Skeleton'

export default function TicketPage() {
  const { ticketCode } = useParams<{ ticketCode: string }>()

  const {
    data: ticket,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['ticket', ticketCode],
    queryFn: () => getTicket(ticketCode as string),
    enabled: Boolean(ticketCode),
    retry: 0,
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 print:py-0">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : isError || !ticket ? (
        <ErrorState
          title="We couldn't find that ticket"
          message="Double-check the link, or contact us if you think this is a mistake."
          onRetry={() => refetch()}
        />
      ) : (
        <TicketView ticket={ticket} />
      )}
    </div>
  )
}
