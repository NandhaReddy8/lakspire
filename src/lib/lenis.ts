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
        // Measured: a single wheel tick at the old 0.85s/1.15x tuning
        // kept visibly animating for ~600-850ms after input stopped,
        // landing ~15% further than the input itself — felt like the
        // page "jumped forward on its own" the moment you stopped to
        // read something, even though continuous scrolling tracked
        // fine. 0.5s + no amplification keeps the glide (vs raw native
        // scroll) while cutting that lingering momentum tail and
        // making the stop land where you actually released.
        duration: 0.5,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1.2,
        wheelMultiplier: 1,
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
