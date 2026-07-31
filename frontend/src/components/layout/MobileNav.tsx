import { Fragment } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Link, NavLink } from 'react-router-dom'
import { ShieldCheck, X } from 'lucide-react'
import { SearchBar } from '@/components/layout/SearchBar'
import { paths } from '@/router/paths'
import { cn } from '@/lib/cn'

export interface NavLinkItem {
  label: string
  to: string
}

export interface MobileNavProps {
  open: boolean
  onClose: () => void
  navLinks: NavLinkItem[]
  isAuthenticated: boolean
}

export function MobileNav({ open, onClose, navLinks, isAuthenticated }: MobileNavProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50 lg:hidden">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in duration-150"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <DialogPanel className="fixed inset-y-0 right-0 flex w-full max-w-xs flex-col gap-6 overflow-y-auto bg-white p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={onClose}
                className="flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <SearchBar />

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-sm font-medium transition',
                      isActive ? 'bg-lagoon-50 text-lagoon-700' : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to={paths.contact}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-lagoon-50 text-lagoon-700' : 'text-slate-700 hover:bg-slate-50',
                  )
                }
              >
                Contact
              </NavLink>
            </nav>

            {isAuthenticated ? (
              <Link
                to={paths.adminDashboard}
                onClick={onClose}
                className="mt-auto flex items-center justify-center gap-2 rounded-full border border-lagoon-200 px-4 py-3 text-sm font-medium text-lagoon-700 hover:bg-lagoon-50"
              >
                <ShieldCheck className="size-4" />
                Admin dashboard
              </Link>
            ) : null}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}
