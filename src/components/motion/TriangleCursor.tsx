'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * TriangleCursor — replaces the native pointer with a small ember
 * triangle and drops a warm click ripple on pointerdown.
 *
 * • Skips touch / coarse-pointer devices (no hover cursor there).
 * • Uses a single direct `transform` update per pointermove — no RAF
 *   easing, because a cursor that lags feels broken. The ambient glow
 *   in CursorSpotlight already handles the eased position.
 * • Grows and rotates over interactive targets so the cursor reads as
 *   a hit-affordance rather than a decoration.
 * • Ripples are DOM-driven with `animationend` cleanup — no state
 *   thrash if the user clicks rapidly.
 */

type Ripple = { id: number; x: number; y: number }

export function TriangleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleIdRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const cursor = cursorRef.current
    if (!cursor) return

    document.documentElement.classList.add('has-tri-cursor')
    cursor.style.opacity = '0'

    let visible = false
    // Cache the last-observed pointer target and its resolved hover state
    // so we skip re-running `closest` and re-writing `dataset` when the
    // pointer is just moving over the same element.
    let lastTarget: Element | null = null
    let lastHover = false
    const INTERACTIVE_SEL =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]'

    const onMove = (e: PointerEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      if (!visible) {
        cursor.style.opacity = '1'
        visible = true
      }
      const el = e.target as Element | null
      if (el !== lastTarget) {
        lastTarget = el
        const hover = !!el?.closest?.(INTERACTIVE_SEL)
        if (hover !== lastHover) {
          lastHover = hover
          cursor.dataset.state = hover ? 'hover' : 'idle'
        }
      }
    }

    const onLeave = () => {
      cursor.style.opacity = '0'
      visible = false
    }

    const onDown = (e: PointerEvent) => {
      const id = ++rippleIdRef.current
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      cursor.dataset.press = 'down'
    }

    const onUp = () => {
      cursor.dataset.press = 'up'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.documentElement.classList.remove('has-tri-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const dropRipple = (id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="tri-cursor"
        data-state="idle"
      >
        <svg viewBox="0 0 24 24" width="22" height="22">
          <defs>
            <linearGradient id="tri-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFB07A" />
              <stop offset="100%" stopColor="#FF6B35" />
            </linearGradient>
          </defs>
          {/* Tip sits at (1,1) — that's the pointer hotspot. Arrow
              extends down and to the right so the visual "point" is
              exactly where the cursor position is registered. */}
          <path
            d="M1 1 L20 11 L11 13 L10 22 Z"
            fill="url(#tri-fill)"
            stroke="#FF6B35"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div aria-hidden="true" className="ripple-layer">
        {ripples.map((r) => (
          <span
            key={r.id}
            className="click-ripple-group"
            style={{ left: r.x, top: r.y }}
            onAnimationEnd={(e) => {
              // Only drop when the LAST (slowest) ring finishes so we
              // don't unmount the group mid-cascade.
              if ((e.target as HTMLElement).classList.contains('click-ripple--r3')) {
                dropRipple(r.id)
              }
            }}
          >
            <span className="click-ripple click-ripple--core" />
            <span className="click-ripple click-ripple--r1" />
            <span className="click-ripple click-ripple--r2" />
            <span className="click-ripple click-ripple--r3" />
            <span className="click-ripple click-ripple--sheen" />
          </span>
        ))}
      </div>
    </>
  )
}
