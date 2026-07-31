import { Link } from 'react-router-dom'
import { CreditCard, MapPinned, ShieldCheck } from 'lucide-react'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedDestinations } from '@/components/home/FeaturedDestinations'
import { FeaturedActivities } from '@/components/home/FeaturedActivities'
import { paths } from '@/router/paths'

const perks = [
  {
    icon: ShieldCheck,
    title: 'Book with confidence',
    description: 'Instant confirmation and a bookmarkable digital ticket for every trip.',
  },
  {
    icon: MapPinned,
    title: 'See it before you go',
    description: 'Every activity comes with a map pin so you know exactly where to be.',
  },
  {
    icon: CreditCard,
    title: 'Simple checkout',
    description: 'A quick two-step booking flow — details, then payment, done.',
  },
]

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <section className="border-b border-slate-100 bg-white py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-600">
                <perk.icon className="size-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-slate-900">{perk.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeaturedDestinations />
      <FeaturedActivities />

      <section className="bg-gradient-to-br from-lagoon-700 to-lagoon-900 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to plan your next escape?
          </h2>
          <p className="max-w-xl text-lagoon-100">
            Explore every country on Lagoon Trails and find the town, and the activity, that&apos;s calling
            your name.
          </p>
          <Link
            to={paths.countries}
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-lagoon-800 shadow-lift transition hover:bg-lagoon-50 active:scale-[0.98]"
          >
            Start exploring
          </Link>
        </div>
      </section>
    </div>
  )
}
