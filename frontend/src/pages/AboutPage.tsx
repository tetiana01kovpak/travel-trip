import { Compass, Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { paths } from '@/router/paths'
import { SITE_NAME } from '@/lib/constants'

const values = [
  {
    icon: Compass,
    title: 'Curated, not endless',
    description:
      'We hand-pick countries, towns, and activities instead of overwhelming you with every option on earth.',
  },
  {
    icon: Sparkles,
    title: 'Booking made simple',
    description: 'Two steps, one modal, and a ticket ready to go — no accounts, no friction.',
  },
  {
    icon: Heart,
    title: 'Built for travelers',
    description: 'Every detail, from maps to tickets, is designed to make the actual trip easier.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-lagoon-600">About Us</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
        We help you plan trips you&apos;ll actually remember
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        {SITE_NAME} started with a simple idea: travel planning shouldn&apos;t take longer than the trip
        itself. So we built a place to browse countries, drill into towns, and book real activities —
        complete with a map and a ticket — in a few clicks.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
            <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
              <value.icon className="size-5" />
            </div>
            <h3 className="font-display font-semibold text-slate-900">{value.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-gradient-to-br from-lagoon-700 to-lagoon-900 p-8 text-center text-white sm:p-10">
        <h2 className="font-display text-2xl font-bold">Ready to see it for yourself?</h2>
        <p className="mt-2 text-lagoon-100">Browse our full list of countries and start planning.</p>
        <Link
          to={paths.countries}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-lagoon-800 shadow-lift transition hover:bg-lagoon-50 active:scale-[0.98]"
        >
          Explore destinations
        </Link>
      </div>
    </div>
  )
}
