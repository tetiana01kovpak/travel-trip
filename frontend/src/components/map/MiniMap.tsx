import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { DETAIL_MAP_ZOOM } from '@/lib/constants'
import { cn } from '@/lib/cn'

export interface MiniMapProps {
  lat: number
  lng: number
  label?: string
  className?: string
  height?: string
  zoom?: number
  interactive?: boolean
}

export function MiniMap({
  lat,
  lng,
  label,
  className,
  height = 'h-64',
  zoom = DETAIL_MAP_ZOOM,
  interactive = false,
}: MiniMapProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-100 shadow-soft print:shadow-none print:border',
        height,
        className,
      )}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>{label ? <Popup>{label}</Popup> : null}</Marker>
      </MapContainer>
    </div>
  )
}
