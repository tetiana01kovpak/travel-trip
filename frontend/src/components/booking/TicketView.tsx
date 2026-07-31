import { motion } from 'motion/react'
import { Calendar, Mail, Phone, Ticket as TicketIcon, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import type { BadgeTone } from '@/components/common/Badge'
import { TicketQr } from '@/components/booking/TicketQr'
import { PrintTicketButton } from '@/components/booking/PrintTicketButton'
import { MiniMap } from '@/components/map/MiniMap'
import { firstImageUrl, formatCurrency, formatDate, formatDateTime } from '@/lib/formatters'
import type { Ticket } from '@/types/booking'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=70'

export interface TicketViewProps {
  ticket: Ticket
  printable?: boolean
}

const statusTone: Record<string, BadgeTone> = {
  confirmed: 'green',
  pending: 'amber',
  cancelled: 'slate',
  completed: 'lagoon',
}

export function TicketView({ ticket, printable = true }: TicketViewProps) {
  const verifyValue =
    typeof window !== 'undefined'
      ? `${window.location.origin}/tickets/${ticket.ticketCode}`
      : ticket.ticketCode

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <Card className="overflow-visible">
        <div className="relative h-48 w-full overflow-hidden sm:h-56">
          <img
            src={firstImageUrl(ticket.activity.images, FALLBACK_IMAGE)}
            alt={ticket.activity.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <Badge tone={statusTone[ticket.status] ?? 'lagoon'} className="mb-2">
              {ticket.status}
            </Badge>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {ticket.activity.name}
            </h1>
            <p className="text-sm text-white/80">
              {ticket.town.name}, {ticket.country.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Ticket code
              </p>
              <p className="font-mono text-2xl font-bold tracking-wider text-lagoon-700">
                {ticket.ticketCode}
              </p>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailRow icon={Users} label="Traveler" value={ticket.traveler.fullName} />
              <DetailRow icon={Mail} label="Email" value={ticket.traveler.email} />
              <DetailRow icon={Phone} label="Phone" value={ticket.traveler.phone} />
              <DetailRow icon={Calendar} label="Travel date" value={formatDate(ticket.travelDate)} />
              <DetailRow icon={Users} label="Travelers" value={String(ticket.numberOfTravelers)} />
              <DetailRow
                icon={TicketIcon}
                label="Total paid"
                value={formatCurrency(ticket.totalPrice, ticket.currency)}
              />
            </dl>

            {ticket.activity.description ? (
              <p className="text-sm text-slate-600">{ticket.activity.description}</p>
            ) : null}

            <div>
              <h2 className="mb-3 font-display text-lg font-bold text-slate-900">Location</h2>
              <MiniMap
                lat={ticket.location.lat}
                lng={ticket.location.lng}
                label={ticket.activity.name}
                height="h-64"
              />
            </div>

            <p className="text-xs text-slate-400">Issued {formatDateTime(ticket.createdAt)}</p>
          </div>

          <div className="flex flex-col items-center gap-4 lg:items-end">
            <TicketQr value={verifyValue} />
            {printable ? <PrintTicketButton /> : null}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
        <Icon className="size-4" />
      </div>
      <div>
        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
        <dd className="text-sm font-semibold text-slate-800">{value}</dd>
      </div>
    </div>
  )
}
