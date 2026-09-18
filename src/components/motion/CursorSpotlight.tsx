'use client'
import { useEffect, useRef } from 'react'

/**
 * Cursor-follower ambient glow.
 *
 * Performance notes:
 * - Runs a RAF loop only when the target and current positions differ
 *   by more than a subpixel threshold. When the cursor is idle the loop
 *   stops entirely, and pointermove restarts it. Previously we ran an
 *   endless RAF-plus-`setProperty` even when nothing had changed.
 * - Skips the spotlight on touch devices (no hover cursor there anyway).
 */
export function CursorSpotlight() {
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })
  const runningRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Skip on touch-primary devices — no cursor to follow.
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    targetRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    currentRef.current = { ...targetRef.current }

    const root = document.documentElement
    root.style.setProperty('--cursor-x', `${currentRef.current.x}px`)
    root.style.setProperty('--cursor-y', `${currentRef.current.y}px`)

    const tick = () => {
      const ease = 0.14
      const dx = targetRef.current.x - currentRef.current.x
      const dy = targetRef.current.y - currentRef.current.y
      currentRef.current.x += dx * ease
      currentRef.current.y += dy * ease

      // Snap when very close, then stop the RAF loop.
      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        currentRef.current.x = targetRef.current.x
        currentRef.current.y = targetRef.current.y
        root.style.setProperty('--cursor-x', `${currentRef.current.x}px`)
        root.style.setProperty('--cursor-y', `${currentRef.current.y}px`)
        runningRef.current = false
        rafRef.current = null
        return
      }

      root.style.setProperty('--cursor-x', `${currentRef.current.x}px`)
      root.style.setProperty('--cursor-y', `${currentRef.current.y}px`)
      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (runningRef.current) return
      runningRef.current = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY
      start()
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <div aria-hidden="true" className="cursor-spotlight" />
}
