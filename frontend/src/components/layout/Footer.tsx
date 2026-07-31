import { Link } from 'react-router-dom'
import { Globe2, Mail, MessageCircle } from 'lucide-react'
import { paths } from '@/router/paths'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 print:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to={paths.home} className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-lagoon-500 to-lagoon-700 text-base text-white"
            >
              🌊
            </span>
            {SITE_NAME}
          </Link>
          <p className="mt-3 max-w-xs text-sm text-slate-500">
            Curated countries, towns, and hand-picked activities — booked in minutes, remembered for
            years.
          </p>
          <div className="mt-4 flex gap-3 text-slate-400">
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email" className="transition hover:text-lagoon-600">
              <Mail className="size-5" />
            </a>
            <a href={paths.contact} aria-label="Message us" className="transition hover:text-lagoon-600">
              <MessageCircle className="size-5" />
            </a>
            <a href={paths.about} aria-label="About us" className="transition hover:text-lagoon-600">
              <Globe2 className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-900">
            Explore
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
            <li>
              <Link to={paths.countries} className="transition hover:text-lagoon-700">
                Tours
              </Link>
            </li>
            <li>
              <Link to={paths.activities} className="transition hover:text-lagoon-700">
                Activities
              </Link>
            </li>
            <li>
              <Link to={paths.blog} className="transition hover:text-lagoon-700">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-900">
            Company
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
            <li>
              <Link to={paths.about} className="transition hover:text-lagoon-700">
                About Us
              </Link>
            </li>
            <li>
              <Link to={paths.contact} className="transition hover:text-lagoon-700">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to={paths.adminLogin} className="transition hover:text-lagoon-700">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-slate-900">
            Get in touch
          </h3>
          <p className="mt-4 text-sm text-slate-500">Questions about a booking?</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-1 inline-block text-sm font-medium text-lagoon-700 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  )
}
