import { motion } from 'motion/react'
import { SearchBar } from '@/components/layout/SearchBar'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=70'

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-900">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/55 to-lagoon-950/90" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-28 text-center sm:px-6 sm:py-36">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-lagoon-100 backdrop-blur"
        >
          Curated trips. Instant booking.
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Find your next unforgettable trip
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="max-w-2xl text-lg text-slate-200"
        >
          Browse hand-picked countries, towns and activities — then book in minutes with a ticket and
          map ready the moment you land.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-md"
        >
          <SearchBar variant="glass" placeholder="Search Bali, paragliding, Lisbon…" />
        </motion.div>
      </div>
    </section>
  )
}
