import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { paths } from '@/router/paths'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-500">
        <Compass className="size-8" />
      </div>
      <p className="font-display text-6xl font-bold text-slate-900">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">This page wandered off</h1>
      <p className="mt-2 max-w-md text-slate-500">
        We couldn&apos;t find the page you were looking for. It may have been moved, renamed, or never
        existed.
      </p>
      <Link
        to={paths.home}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-lagoon-600 px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-lagoon-700 active:scale-[0.98]"
      >
        Back to home
      </Link>
    </div>
  )
}
