import { useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2, Search } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { usePixabaySearch, useUploadImage } from '@/hooks/useAdminImages'
import { cn } from '@/lib/cn'
import type { UploadImageResponse } from '@/types/admin'

export interface ImagePickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (image: UploadImageResponse) => void
}

export function ImagePickerModal({ open, onClose, onSelect }: ImagePickerModalProps) {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [selectingId, setSelectingId] = useState<number | null>(null)

  const { data, isFetching } = usePixabaySearch(
    submittedQuery ? { q: submittedQuery, perPage: 24 } : undefined,
  )
  const upload = useUploadImage()

  function handleSearch(event: FormEvent) {
    event.preventDefault()
    setSubmittedQuery(query.trim())
  }

  function handleSelect(hitId: number, imageUrl: string) {
    setSelectingId(hitId)
    upload.mutate(imageUrl, {
      onSuccess: (result) => {
        onSelect(result)
        setSelectingId(null)
        onClose()
      },
      onError: () => setSelectingId(null),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Choose an image" size="xl">
      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pixabay for photos…"
            className="w-full rounded-full border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-lagoon-400"
          />
        </div>
        <Button type="submit" variant="primary" isLoading={isFetching && Boolean(submittedQuery)}>
          Search
        </Button>
      </form>

      {!submittedQuery ? (
        <EmptyState title="Search for an image" description="Try “beach”, “mountains”, or a city name." />
      ) : isFetching ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      ) : !data || data.hits.length === 0 ? (
        <EmptyState title="No results" description={`Nothing found for "${submittedQuery}".`} />
      ) : (
        <div className="grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3 md:grid-cols-4">
          {data.hits.map((hit) => (
            <button
              key={hit.id}
              type="button"
              onClick={() => handleSelect(hit.id, hit.largeImageURL ?? hit.webformatURL)}
              disabled={upload.isPending}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-xl border border-slate-200 transition hover:ring-2 hover:ring-lagoon-400',
                selectingId === hit.id && 'ring-2 ring-lagoon-500',
              )}
            >
              <img src={hit.previewURL} alt={hit.tags} loading="lazy" className="h-full w-full object-cover" />
              {selectingId === hit.id ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                  <Loader2 className="size-5 animate-spin text-white" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/20" />
              )}
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}
