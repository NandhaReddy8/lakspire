'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * ScrollJump
 * ──────────
 * Fixed bottom-right glass pill that jumps to the next section anchor
 * on click. When the page is near its bottom, the icon rotates 180°
 * and the click behavior flips to jump to the top.
 *
 * Anchors: every top-level section on the page can carry a
 * `data-scroll-anchor="<slug>"` attribute (only the presence is
 * required — slug is optional but nice for a11y). The component
 * collects all such elements and pairs the current scroll position
 * to the "next" one.
 */

const NAV_OFFSET = 96 // sync with scroll-margin-top in globals.css

export function ScrollJump() {
  const [mode, setMode] = useState<'down' | 'up'>('down')
  const [visible, setVisible] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const compute = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      const dh = document.documentElement.scrollHeight
      // Fade in after the hero (>10% of first viewport)
      setVisible(scrollY > vh * 0.1)
      // Flip to "up" once we're near the bottom (within one viewport)
      const nearBottom = scrollY + vh >= dh - 120
      setMode(nearBottom ? 'up' : 'down')
      ticking.current = false
    }
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(compute)
      }
    }
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
    }
  }, [])

  const onClick = () => {
    if (mode === 'up') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Find the next section anchor below the current scroll position
    const anchors = Array.from(
      document.querySelectorAll<HTMLElement>('[data-scroll-anchor]'),
    )
    const currentTop = window.scrollY + NAV_OFFSET + 4
    const next = anchors.find((el) => el.getBoundingClientRect().top + window.scrollY > currentTop + 40)
    if (next) {
      const targetY = next.getBoundingClientRect().top + window.scrollY - NAV_OFFSET + 4
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    } else {
      // No further anchor — go to bottom
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={mode === 'up' ? 'Back to top' : 'Scroll to next section'}
      className={`scroll-jump ${mode === 'up' ? 'is-up' : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <ChevronDown size={18} strokeWidth={2} />
    </button>
  )
}
