import L from 'leaflet'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

/**
 * Vite (like webpack before it) doesn't serve Leaflet's default marker images
 * from the path Leaflet expects, so the default icon renders as a broken image.
 * Importing them explicitly and re-pointing `Icon.Default` fixes it. Import this
 * module once, near the app root, before any map renders.
 */
let patched = false

export function fixLeafletDefaultIcon(): void {
  if (patched) return
  patched = true

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow,
  })
}
