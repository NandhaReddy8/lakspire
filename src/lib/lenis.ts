'use client'
import type Lenis from 'lenis'

// Lenis is dynamic-imported so its ~15KB doesn't sit in the main bundle
// blocking first paint. The native scrollbar handles the first few
// frames; Lenis takes over once its chunk lands.
let instance: Lenis | null = null
let loading: Promise<Lenis> | null = null

export function ensureLenis(): Promise<Lenis> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('ensureLenis() called on the server'))
  }
  if (instance) return Promise.resolve(instance)
  if (!loading) {
    loading = import('lenis').then((mod) => {
      const LenisCtor = mod.default
      instance = new LenisCtor({
        // Snappier scroll — previous 1.5s felt like "forever" per
        // wheel tick. 0.85s + cubic ease keeps the buttery feel
        // without the long tail.
        duration: 0.85,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 2,
        wheelMultiplier: 1.15,
      })
      return instance
    })
  }
  return loading
}

export function destroyLenis() {
  if (instance) {
    instance.destroy()
    instance = null
  }
  loading = null
}
