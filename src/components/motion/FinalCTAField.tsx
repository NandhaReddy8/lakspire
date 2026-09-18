'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * FinalCTAField
 * ─────────────
 * Full-bleed animated field for the closing CTA card. Not a boxed
 * illustration — it fills the parent card so the animation reads as
 * PART of the message rather than beside it.
 *
 * Composition:
 *   - Corner brackets (ember/gold) — echo the hero's annotation aesthetic
 *   - Two flowing arc paths sweeping across the card behind the text
 *   - Streaming packets along each arc
 *   - Sparse dot lattice as background texture
 *   - Cursor halo that follows the pointer within the card
 */

const VIEW = { w: 1200, h: 500 }

const ARCS: Array<{ d: string; color: string; dur: number; offset: number }> = [
  {
    d: `M -20 ${VIEW.h * 0.35} C ${VIEW.w * 0.3} ${VIEW.h * 0.15}, ${VIEW.w * 0.7} ${VIEW.h * 0.65}, ${VIEW.w + 20} ${VIEW.h * 0.4}`,
    color: '#FF6B35',
    dur: 9,
    offset: 0,
  },
  {
    d: `M -20 ${VIEW.h * 0.72} C ${VIEW.w * 0.35} ${VIEW.h * 0.92}, ${VIEW.w * 0.7} ${VIEW.h * 0.35}, ${VIEW.w + 20} ${VIEW.h * 0.65}`,
    color: '#F4A261',
    dur: 11,
    offset: 3.5,
  },
  {
    d: `M -20 ${VIEW.h * 0.5} C ${VIEW.w * 0.45} ${VIEW.h * 0.5}, ${VIEW.w * 0.55} ${VIEW.h * 0.5}, ${VIEW.w + 20} ${VIEW.h * 0.5}`,
    color: '#E9C46A',
    dur: 13,
    offset: 6.5,
  },
]

// Deterministic lattice
const LATTICE = (() => {
  const step = 60
  const pts: Array<{ x: number; y: number; hot: boolean }> = []
  for (let y = step; y < VIEW.h; y += step) {
    for (let x = step; x < VIEW.w; x += step) {
      const hash = ((x * 13 + y * 7) * 2654435761) >>> 0
      const hot = hash / 4294967296 > 0.9
      pts.push({ x, y, hot })
    }
  }
  return pts
})()

export function FinalCTAField() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const wrap = wrapRef.current
    const halo = haloRef.current
    if (!wrap || !halo) return

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      if (!inside) {
        halo.style.opacity = '0'
        return
      }
      halo.style.setProperty('--hx', `${e.clientX - rect.left}px`)
      halo.style.setProperty('--hy', `${e.clientY - rect.top}px`)
      halo.style.opacity = '1'
    }
    const onLeave = () => {
      halo.style.opacity = '0'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [shouldReduce])

  const bracketArm = 26

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <div ref={haloRef} className="hero-cursor-halo" style={{ opacity: 0 }} />

      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="cta-fade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="65%" stopColor="white" stopOpacity="0.75" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="cta-mask">
            <rect width={VIEW.w} height={VIEW.h} fill="url(#cta-fade)" />
          </mask>
          {ARCS.map((a, i) => (
            <linearGradient key={`ag-${i}`} id={`arc-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={a.color} stopOpacity="0" />
              <stop offset="50%" stopColor={a.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={a.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        <g mask="url(#cta-mask)" opacity={0.85}>
          {/* Sparse lattice */}
          {LATTICE.map((p, i) => (
            <circle
              key={`d-${i}`}
              cx={p.x}
              cy={p.y}
              r={p.hot ? 1.5 : 0.6}
              fill={p.hot ? '#FF8F5C' : 'rgba(255,240,220,0.28)'}
              opacity={p.hot ? 0.7 : 0.2}
            />
          ))}

          {/* Flowing arcs + streaming packets */}
          {ARCS.map((arc, i) => (
            <g key={`arc-${i}`}>
              <path
                d={arc.d}
                fill="none"
                stroke={`url(#arc-grad-${i})`}
                strokeWidth={1.1}
                opacity={0.55}
              />
              <circle r={3} fill={arc.color} opacity={0.9}>
                <animateMotion
                  dur={`${arc.dur}s`}
                  repeatCount="indefinite"
                  begin={`-${arc.offset}s`}
                  path={arc.d}
                />
              </circle>
              <circle r={2} fill={arc.color} opacity={0.55}>
                <animateMotion
                  dur={`${arc.dur}s`}
                  repeatCount="indefinite"
                  begin={`-${arc.offset + 0.6}s`}
                  path={arc.d}
                />
              </circle>
              <circle r={1.4} fill={arc.color} opacity={0.35}>
                <animateMotion
                  dur={`${arc.dur}s`}
                  repeatCount="indefinite"
                  begin={`-${arc.offset + 1.2}s`}
                  path={arc.d}
                />
              </circle>
            </g>
          ))}

          {/* Corner brackets — echo the hero's data-annotation grammar */}
          {[
            { x: 18, y: 18, color: '#FF6B35' },
            { x: VIEW.w - 18, y: 18, color: '#E9C46A', flipX: true },
            { x: 18, y: VIEW.h - 18, color: '#F4A261', flipY: true },
            { x: VIEW.w - 18, y: VIEW.h - 18, color: '#FF8F5C', flipX: true, flipY: true },
          ].map((c, i) => {
            const sx = c.flipX ? -1 : 1
            const sy = c.flipY ? -1 : 1
            return (
              <path
                key={`c-${i}`}
                d={`M ${c.x} ${c.y + bracketArm * sy}
                   L ${c.x} ${c.y}
                   L ${c.x + bracketArm * sx} ${c.y}`}
                fill="none"
                stroke={c.color}
                strokeWidth={1.4}
                strokeLinecap="round"
                opacity={0.8}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
