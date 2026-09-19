'use client'
import { useEffect, useRef } from 'react'

/**
 * AnnotationCursor — solid ember dot + trailing halo.
 * ────────────────────────────────────────────────────
 * Two layers move independently:
 *   · Inner dot pins exactly to the pointer (no easing, click-accurate).
 *   · Outer halo follows with a small lag so motion feels physical.
 *
 * Performance choices
 * - Only `transform` is animated per frame — no filter, no box-shadow,
 *   no mix-blend-mode. Everything else is static so paint stays cheap.
 * - RAF loop stops once the halo reaches the pointer; pointermove
 *   restarts it. Idle CPU cost is zero.
 * - State classes (target/text/press) flip via a delegated listener,
 *   not on every frame.
 * - Skipped on touch, coarse pointer, and reduced motion — accessible
 *   fallbacks keep the native cursor.
 */
export function AnnotationCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const target = useRef({ x: -100, y: -100 })
  const halo = useRef({ x: -100, y: -100 })
  const running = useRef(false)
  const visible = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const skip =
      window.matchMedia('(hover: none), (pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) return

    document.body.classList.add('custom-cursor-on')

    const dotEl = dotRef.current
    const haloEl = haloRef.current
    if (!dotEl || !haloEl) return

    // Tight ease — halo tracks close to the pointer so it never feels
    // laggy, but stays a hair behind for physicality on flicks.
    const EASE = 0.32

    const tick = () => {
      const dx = target.current.x - halo.current.x
      const dy = target.current.y - halo.current.y
      halo.current.x += dx * EASE
      halo.current.y += dy * EASE

      dotEl.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`
      haloEl.style.transform = `translate3d(${halo.current.x}px, ${halo.current.y}px, 0) translate(-50%, -50%)`

      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        halo.current.x = target.current.x
        halo.current.y = target.current.y
        haloEl.style.transform = `translate3d(${halo.current.x}px, ${halo.current.y}px, 0) translate(-50%, -50%)`
        running.current = false
        rafRef.current = null
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running.current) return
      running.current = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const show = () => {
      if (visible.current) return
      visible.current = true
      dotEl.classList.add('is-visible')
      haloEl.classList.add('is-visible')
    }
    const hide = () => {
      visible.current = false
      dotEl.classList.remove('is-visible')
      haloEl.classList.remove('is-visible')
    }

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      show()
      start()
    }

    const HOVER_SEL =
      'a, button, [role="button"], input[type="submit"], input[type="button"], summary, [data-cursor="target"]'
    const TEXT_SEL =
      'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'

    let mode: 'idle' | 'target' | 'text' = 'idle'
    const setMode = (m: typeof mode) => {
      if (m === mode) return
      mode = m
      dotEl.classList.toggle('is-target', m === 'target')
      haloEl.classList.toggle('is-target', m === 'target')
      dotEl.classList.toggle('is-text', m === 'text')
      haloEl.classList.toggle('is-text', m === 'text')
    }

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      if (t.closest(TEXT_SEL)) setMode('text')
      else if (t.closest(HOVER_SEL)) setMode('target')
      else setMode('idle')
    }

    const onDown = () => {
      dotEl.classList.add('is-down')
      haloEl.classList.add('is-down')
    }
    const onUp = () => {
      dotEl.classList.remove('is-down')
      haloEl.classList.remove('is-down')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', hide, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', hide)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('custom-cursor-on')
    }
  }, [])

  return (
    <>
      <div ref={haloRef} className="cursor-halo" aria-hidden="true">
        <span className="ch-fill" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <span className="cd-core" />
        <span className="cd-ibeam" />
      </div>
    </>
  )
}
