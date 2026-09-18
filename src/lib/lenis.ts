'use client'
import Lenis from 'lenis'

let instance: Lenis | null = null

export function getLenis(): Lenis {
  if (typeof window === 'undefined') {
    throw new Error('getLenis() called on the server')
  }
  if (!instance) {
    instance = new Lenis({
      // Snappier scroll — previous 1.5s felt like "forever" per wheel tick.
      // 0.85s + cubic ease keeps the buttery feel without the long tail.
      duration: 0.85,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1.15,
    })
  }
  return instance
}

export function destroyLenis() {
  if (instance) {
    instance.destroy()
    instance = null
  }
}
