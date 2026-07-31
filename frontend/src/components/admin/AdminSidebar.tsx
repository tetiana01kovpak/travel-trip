import { NavLink } from 'react-router-dom'
import { Building2, Compass, Globe2, LayoutDashboard, LogOut, Newspaper } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { paths } from '@/router/paths'
import { cn } from '@/lib/cn'

const links = [
  { label: 'Dashboard', to: paths.adminDashboard, icon: LayoutDashboard },
  { label: 'Countries', to: paths.adminCountries, icon: Globe2 },
  { label: 'Towns', to: paths.adminTowns, icon: Building2 },
  { label: 'Activities', to: paths.adminActivities, icon: Compass },
  { label: 'Blog', to: paths.adminBlog, icon: Newspaper },
]

export interface AdminSidebarProps {
  onNavigate?: () => void
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const { user } = useAuth()
  const logout = useLogout()

  return (
    <div className="flex h-full flex-col">
      <div className="px-2 pb-6">
        <p className="font-display text-lg font-semibold text-white">Admin Console</p>
        {user ? <p className="mt-0.5 text-xs text-lagoon-200">Signed in as {user.username}</p> : null}
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive ? 'bg-white/15 text-white' : 'text-lagoon-100 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <Icon className="size-4" />
              {link.label}
            </NavLink>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-lagoon-100 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
      >
        <LogOut className="size-4" />
        Sign out
      </button>
    </div>
  )
}
