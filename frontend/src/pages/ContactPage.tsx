import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { CONTACT_EMAIL } from '@/lib/constants'

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-lagoon-600">Contact Us</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        We&apos;d love to hear from you
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Questions about a booking, a destination, or just want to say hello? Reach out and we&apos;ll get
        back to you as soon as we can.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
            <Mail className="size-5" />
          </div>
          <h3 className="font-display font-semibold text-slate-900">Email us</h3>
          <p className="mt-2 text-sm text-slate-500">
            The fastest way to reach the team — we typically reply within one business day.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-lagoon-600 px-6 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-lagoon-700 active:scale-[0.98]"
          >
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-coral-50 text-coral-500">
            <MessageCircle className="size-5" />
          </div>
          <h3 className="font-display font-semibold text-slate-900">Booking support</h3>
          <p className="mt-2 text-sm text-slate-500">
            Already booked? Include your ticket code in your email so we can look it up instantly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft sm:col-span-2">
          <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
            <MapPin className="size-5" />
          </div>
          <h3 className="font-display font-semibold text-slate-900">Headquarters</h3>
          <p className="mt-2 text-sm text-slate-500">
            Lagoon Trails is a fully remote team helping travelers plan trips around the world.
          </p>
        </div>
      </div>
    </div>
  )
}
