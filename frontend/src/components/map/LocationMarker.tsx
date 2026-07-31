import { Marker, useMapEvents } from 'react-leaflet'
import type { GeoLocation } from '@/types/api'

export interface LocationMarkerProps {
  position: GeoLocation | null
  onChange: (position: GeoLocation) => void
}

/** Renders inside a `MapContainer`; click anywhere on the map to drop/move the pin. */
export function LocationMarker({ position, onChange }: LocationMarkerProps) {
  useMapEvents({
    click(event) {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng })
    },
  })

  if (!position) return null
  return <Marker position={[position.lat, position.lng]} />
}
