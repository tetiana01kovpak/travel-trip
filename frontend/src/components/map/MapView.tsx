import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '@/lib/constants'
import { cn } from '@/lib/cn'

export interface MapPin {
  id: string
  lat: number
  lng: number
  label: string
  to?: string
}

export interface MapViewProps {
  pins: MapPin[]
  className?: string
  height?: string
}

function FitBounds({ pins }: { pins: MapPin[] }) {
  const map = useMap()

  useEffect(() => {
    if (pins.length === 0) return
    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 13)
      return
    }
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [pins, map])

  return null
}

export function MapView({ pins, className, height = 'h-96' }: MapViewProps) {
  const center: [number, number] = pins.length > 0 ? [pins[0].lat, pins[0].lng] : DEFAULT_MAP_CENTER

  return (
    <div
      className={cn('overflow-hidden rounded-2xl border border-slate-100 shadow-soft', height, className)}
    >
      <MapContainer center={center} zoom={DEFAULT_MAP_ZOOM} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <div className="text-sm font-medium text-slate-800">
                {pin.to ? (
                  <Link to={pin.to} className="text-lagoon-700 hover:underline">
                    {pin.label}
                  </Link>
                ) : (
                  pin.label
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds pins={pins} />
      </MapContainer>
    </div>
  )
}
