import { useEffect, useState } from 'react'

/** Returns true once the page has scrolled past `threshold` pixels. */
export function useScrollPosition(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.scrollY > threshold : false,
  )

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
