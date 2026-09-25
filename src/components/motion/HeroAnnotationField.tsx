'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * HeroAnnotationField
 * ───────────────────
 * The AMBIENT layer of the hero — nothing more. A sparse dot lattice,
 * three horizontal scan-line packets, a soft cursor halo and a rotating
 * reticle. It sits full-bleed behind everything and never competes
 * with the focal HeroWorkspaceScene.
 *
 * All the "annotation" grammar (bounding boxes, node network, progress
 * ring) has moved into HeroWorkspaceScene so the hero has a real focal
 * subject. This file is deliberately quiet.
 *
 * Performance notes:
 *   • The reticle's rAF loop and the SVG's own SMIL timeline pause via
 *     IntersectionObserver whenever this field scrolls out of view.
 *   • The window-level pointermove handler used to call
 *     getBoundingClientRect() (a layout-forcing read) on every single
 *     mouse movement across the whole page. The rect is now cached and
 *     only refreshed on resize/scroll.
 *   • The halo/reticle/pointermove listener are skipped entirely on
 *     devices with no real hover (touch) — there's no cursor to chase.
 */

const COLORS = ['#FF6B35', '#FF8F5C', '#F4A261', '#E9C46A']

function hashRand(seed: number) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const VIEW = { w: 1440, h: 900 }

const SCAN_ROWS = [14, 52, 88].map((y, i) => ({
  y,
  color: COLORS[i % COLORS.length],
  duration: 11 + (i % 3) * 2,
  offset: (i * 2.3) % 8,
  size: 2.4,
}))

// Step widened 64 → 88 (roughly halves the dot count, ~300 → ~160) —
// these are static (no per-frame cost) but still add DOM/paint weight
// under the mask, and the field reads just as "sparse" either way.
const LATTICE = (() => {
  const step = 88
  const pts: Array<{ x: number; y: number; hot: boolean }> = []
  for (let y = step; y < VIEW.h; y += step) {
    for (let x = step; x < VIEW.w; x += step) {
      const hot = hashRand(x * 13 + y * 7) > 0.92
      pts.push({ x, y, hot })
    }
  }
  return pts
})()

// CSS mask replicating the old SVG <mask>+radialGradient vignette.
const FIELD_FADE_MASK =
  'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.75) 70%, rgba(255,255,255,0) 100%)'

export function HeroAnnotationField() {
  const svgRef = useRef<SVGSVGElement>(null)
  const reticleRef = useRef<SVGGElement | null>(null)
  const haloRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const shouldReduce = useReducedMotion()

  // Defaults to true for SSR/first paint, corrected after mount — see
  // the matching pattern in HeroWorkspaceScene.
  const [pointerFine, setPointerFine] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setPointerFine(mq.matches)
    const onChange = () => setPointerFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // See the matching comment in HeroWorkspaceScene: useReducedMotion()
  // resolves synchronously from the real OS setting on the client's
  // first render, which would hydrate-mismatch against the server
  // (always shouldReduce=false) for JSX that renders elements
  // conditionally rather than just varying an animation value.
  // Deferring to after mount keeps the first render identical.
  const [reducedMotionApplied, setReducedMotionApplied] = useState(false)
  useEffect(() => {
    setReducedMotionApplied(!!shouldReduce)
  }, [shouldReduce])

  const cursor = useRef<{ x: number; y: number; active: boolean }>({
    x: VIEW.w * 0.5,
    y: VIEW.h * 0.5,
    active: false,
  })
  const rectRef = useRef<DOMRect | null>(null)
  const inViewRef = useRef(true)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Pause the reticle rAF loop and the SVG's SMIL timeline whenever
  // this field scrolls out of view.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting
        if (shouldReduce) return
        if (entry.isIntersecting) {
          if ('unpauseAnimations' in svg) svg.unpauseAnimations()
        } else {
          if ('pauseAnimations' in svg) svg.pauseAnimations()
          if (haloRef.current) haloRef.current.style.opacity = '0'
        }
      },
      { rootMargin: '150px 0px' },
    )
    io.observe(svg)
    return () => io.disconnect()
  }, [shouldReduce])

  useEffect(() => {
    if (shouldReduce || !pointerFine) return
    const svg = svgRef.current
    if (!svg) return

    const refreshRect = () => {
      rectRef.current = svg.getBoundingClientRect()
    }
    refreshRect()
    window.addEventListener('resize', refreshRect, { passive: true })
    window.addEventListener('scroll', refreshRect, { passive: true })

    const onMove = (e: PointerEvent) => {
      if (!inViewRef.current) return
      const rect = rectRef.current
      if (!rect) return
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      if (!inside) {
        cursor.current.active = false
        if (haloRef.current) haloRef.current.style.opacity = '0'
        return
      }
      const x = ((e.clientX - rect.left) / rect.width) * VIEW.w
      const y = ((e.clientY - rect.top) / rect.height) * VIEW.h
      cursor.current = { x, y, active: true }
      if (haloRef.current) {
        haloRef.current.style.setProperty('--hx', `${e.clientX - rect.left}px`)
        haloRef.current.style.setProperty('--hy', `${e.clientY - rect.top}px`)
        haloRef.current.style.opacity = '1'
      }
    }
    const onLeave = () => {
      cursor.current.active = false
      if (haloRef.current) haloRef.current.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', refreshRect)
      window.removeEventListener('scroll', refreshRect)
    }
  }, [shouldReduce, pointerFine])

  // Reticle position — updated on rAF, paused while off-screen.
  useEffect(() => {
    if (shouldReduce || !pointerFine) return
    let raf = 0
    const tick = () => {
      if (inViewRef.current && reticleRef.current) {
        if (cursor.current.active) {
          reticleRef.current.setAttribute(
            'transform',
            `translate(${cursor.current.x - VIEW.w / 2} ${cursor.current.y - VIEW.h / 2})`,
          )
          reticleRef.current.style.opacity = '0.55'
        } else {
          reticleRef.current.style.opacity = '0'
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [shouldReduce, pointerFine])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {pointerFine && <div ref={haloRef} className="hero-cursor-halo" style={{ opacity: 0 }} />}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ maskImage: FIELD_FADE_MASK, WebkitMaskImage: FIELD_FADE_MASK }}
      >
        <defs>
          {COLORS.map((c, i) => (
            <linearGradient key={`sg-${i}`} id={`scan-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c} stopOpacity="0" />
              <stop offset="50%" stopColor={c} stopOpacity="0.55" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        <g opacity={0.55}>
          {/* Sparse dot lattice */}
          {LATTICE.map((p, i) => (
            <circle
              key={`d-${i}`}
              cx={p.x}
              cy={p.y}
              r={p.hot ? 1.3 : 0.55}
              fill={p.hot ? '#FF8F5C' : 'rgba(255,240,220,0.28)'}
              opacity={p.hot ? 0.55 : 0.2}
            />
          ))}

          {/* Horizontal scan rows — quiet, only three, edges only. The
              static line always renders; the moving packet (raw SMIL,
              untouched by the CSS reduced-motion rule) is skipped under
              shouldReduce. */}
          {SCAN_ROWS.map((row, i) => {
            const y = (row.y / 100) * VIEW.h
            return (
              <g key={`scan-${i}`}>
                <line
                  x1={0}
                  y1={y}
                  x2={VIEW.w}
                  y2={y}
                  stroke={`url(#scan-grad-${i % COLORS.length})`}
                  strokeWidth={0.5}
                  opacity={0.15}
                />
                {!reducedMotionApplied && (
                  <g visibility="hidden">
                    <set attributeName="visibility" to="visible" begin="0.08s" fill="freeze" />
                    <animateMotion
                      dur={`${row.duration}s`}
                      repeatCount="indefinite"
                      begin={`-${row.offset}s`}
                      path={`M -30 ${y} L ${VIEW.w + 30} ${y}`}
                    />
                    <circle cx={0} cy={0} r={row.size + 3} fill={row.color} opacity={0}>
                      <animate
                        attributeName="r"
                        values={`${row.size + 2};${row.size + 9};${row.size + 2}`}
                        dur="1.6s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0; 0.22; 0.22; 0"
                        keyTimes="0; 0.15; 0.85; 1"
                        dur={`${row.duration}s`}
                        begin={`-${row.offset}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle cx={0} cy={0} r={row.size} fill={row.color} opacity={0}>
                      <animate
                        attributeName="opacity"
                        values="0; 0.65; 0.65; 0"
                        keyTimes="0; 0.15; 0.85; 1"
                        dur={`${row.duration}s`}
                        begin={`-${row.offset}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                )}
              </g>
            )
          })}

          {/* Cursor reticle — a motion-chasing element by nature, so it
              (and the rotation animating it) is skipped outright under
              reduced motion or on touch, not just left permanently
              invisible. */}
          {!reducedMotionApplied && pointerFine && (
            <g ref={reticleRef} className="hero-reticle" style={{ transition: 'opacity 300ms ease', opacity: 0 }}>
              <g transform={`translate(${VIEW.w / 2} ${VIEW.h / 2})`}>
                <circle
                  r={26}
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth={0.7}
                  opacity={0.45}
                  strokeDasharray="3 4"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="14s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  r={18}
                  fill="none"
                  stroke="#FF8F5C"
                  strokeWidth={0.7}
                  opacity={0.4}
                  strokeDasharray="2 3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="360"
                    to="0"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle r={2} fill="#FF6B35" />
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
