import { useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Building2, Compass, Globe2, Loader2, Search } from 'lucide-react'
import { search } from '@/api/search'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import { paths } from '@/router/paths'
import { cn } from '@/lib/cn'

interface FlatResult {
  key: string
  type: 'country' | 'town' | 'activity'
  label: string
  sublabel: string
  to: string
}

export interface SearchBarProps {
  className?: string
  variant?: 'glass' | 'light'
  placeholder?: string
}

const typeIcon = {
  country: Globe2,
  town: Building2,
  activity: Compass,
}

const typeGroupLabel: Record<FlatResult['type'], string> = {
  country: 'Countries',
  town: 'Towns',
  activity: 'Activities',
}

export function SearchBar({
  className,
  variant = 'light',
  placeholder = 'Search countries, towns, activities…',
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const debounced = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS)

  const { data, isFetching } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => search(debounced),
    enabled: debounced.length > 1,
  })

  useOnClickOutside(containerRef, () => setOpen(false))

  const results = useMemo<FlatResult[]>(() => {
    if (!data) return []

    const countries: FlatResult[] = data.countries.map((c) => ({
      key: `country-${c.id}`,
      type: 'country',
      label: c.name,
      sublabel: 'Country',
      to: paths.countryDetail(c.slug),
    }))

    const towns: FlatResult[] = data.towns.map((t) => {
      const countryRef = t.country && 'slug' in t.country ? t.country : undefined
      return {
        key: `town-${t.id}`,
        type: 'town',
        label: t.name,
        sublabel: countryRef ? countryRef.name : 'Town',
        to: countryRef ? paths.townDetail(countryRef.slug, t.slug) : paths.countries,
      }
    })

    const activities: FlatResult[] = data.activities.map((a) => {
      const townRef = a.town && 'slug' in a.town ? a.town : undefined
      return {
        key: `activity-${a.id}`,
        type: 'activity',
        label: a.name,
        sublabel: townRef ? townRef.name : 'Activity',
        to: paths.activityDetail(a.slug),
      }
    })

    return [...countries, ...towns, ...activities]
  }, [data])

  function goTo(result: FlatResult) {
    navigate(result.to)
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const chosen = results[activeIndex] ?? results[0]
      if (chosen) goTo(chosen)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  const showDropdown = open && debounced.length > 1
  let groups: { type: FlatResult['type']; items: FlatResult[] }[] = []
  if (results.length > 0) {
    groups = (['country', 'town', 'activity'] as const)
      .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
      .filter((g) => g.items.length > 0)
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-full px-4 py-3 transition',
          variant === 'glass'
            ? 'border border-white/25 bg-white/10 text-white shadow-xl backdrop-blur-md placeholder:text-white/70 focus-within:border-white/50'
            : 'border border-slate-200 bg-white text-slate-700 shadow-soft focus-within:border-lagoon-400',
        )}
      >
        <Search className={cn('size-4 shrink-0', variant === 'glass' ? 'text-white/80' : 'text-slate-400')} />
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-results-listbox"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent text-sm outline-none',
            variant === 'glass' ? 'placeholder:text-white/70' : 'placeholder:text-slate-400',
          )}
        />
        {isFetching ? (
          <Loader2 className={cn('size-4 shrink-0 animate-spin', variant === 'glass' ? 'text-white/80' : 'text-slate-400')} />
        ) : null}
      </div>

      {showDropdown ? (
        <div
          id="search-results-listbox"
          role="listbox"
          className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white text-left shadow-lift"
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">
              {isFetching ? 'Searching…' : `No results for “${debounced}”`}
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto py-2">
              {groups.map((group) => (
                <div key={group.type} className="mb-1 last:mb-0">
                  <p className="px-4 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {typeGroupLabel[group.type]}
                  </p>
                  {group.items.map((item) => {
                    const Icon = typeIcon[item.type]
                    const index = results.indexOf(item)
                    return (
                      <button
                        type="button"
                        key={item.key}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => goTo(item)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition',
                          index === activeIndex ? 'bg-lagoon-50 text-lagoon-800' : 'text-slate-700 hover:bg-slate-50',
                        )}
                      >
                        <Icon className="size-4 shrink-0 text-lagoon-500" />
                        <span className="flex-1 truncate font-medium">{item.label}</span>
                        <span className="shrink-0 text-xs text-slate-400">{item.sublabel}</span>
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
