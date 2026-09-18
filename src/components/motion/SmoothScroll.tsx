'use client'
import { useEffect } from 'react'
import { ensureLenis, destroyLenis } from '@/lib/lenis'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let rafId: number | null = null
    let cancelled = false

    ensureLenis().then((lenis) => {
      if (cancelled) return
      const raf = (time: number) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    })

    return () => {
      cancelled = true
      if (rafId !== null) cancelAnimationFrame(rafId)
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
