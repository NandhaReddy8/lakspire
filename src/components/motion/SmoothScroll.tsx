'use client'
import { useEffect } from 'react'
import { getLenis, destroyLenis } from '@/lib/lenis'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = getLenis()

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
