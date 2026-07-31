import { Fragment, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Menu as MenuIcon, X } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { paths } from '@/router/paths'
import { SITE_NAME } from '@/lib/constants'

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="min-h-svh bg-slate-50 lg:flex">
      <aside className="hidden w-64 shrink-0 bg-gradient-to-b from-lagoon-900 to-lagoon-800 p-5 lg:block">
        <AdminSidebar />
      </aside>

      <div className="flex min-h-svh flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <Link to={paths.adminDashboard} className="font-display text-base font-semibold text-slate-900">
            {SITE_NAME} Admin
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex size-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            aria-label="Open admin menu"
          >
            <MenuIcon className="size-5" />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>

      <Transition show={drawerOpen} as={Fragment}>
        <Dialog onClose={() => setDrawerOpen(false)} className="relative z-50 lg:hidden">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50" aria-hidden="true" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <DialogPanel className="fixed inset-x-0 top-0 max-h-[85vh] overflow-y-auto rounded-b-3xl bg-gradient-to-b from-lagoon-900 to-lagoon-800 p-5 pb-8 shadow-lift">
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                  aria-label="Close admin menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </div>
  )
}
