import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu as MenuIcon, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { SearchBar } from '@/components/layout/SearchBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { paths } from '@/router/paths'
import { SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/cn'

const navLinks = [
  { label: 'Tours', to: paths.countries },
  { label: 'Activities', to: paths.activities },
  { label: 'Blog', to: paths.blog },
  { label: 'About', to: paths.about },
]

export function Header() {
  const scrolled = useScrollPosition(8)
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-all duration-300 print:hidden',
        scrolled
          ? 'border-slate-200 bg-white/90 shadow-soft backdrop-blur'
          : 'border-transparent bg-white/70 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to={paths.home} className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-lagoon-500 to-lagoon-700 text-base text-white shadow-soft"
            >
              🌊
            </span>
            {SITE_NAME}
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-lagoon-50 text-lagoon-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden w-full max-w-xs md:block lg:max-w-sm">
            <SearchBar />
          </div>

          {isAuthenticated ? (
            <Link
              to={paths.adminDashboard}
              className="hidden items-center gap-1.5 rounded-full border border-lagoon-200 px-4 py-2 text-sm font-medium text-lagoon-700 hover:bg-lagoon-50 lg:flex"
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex size-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="size-5" />
          </button>
        </div>
      </div>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
      />
    </header>
  )
}
