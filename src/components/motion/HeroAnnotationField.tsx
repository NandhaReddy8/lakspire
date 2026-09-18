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

const LATTICE = (() => {
  const step = 64
  const pts: Array<{ x: number; y: number; hot: boolean }> = []
  for (let y = step; y < VIEW.h; y += step) {
    for (let x = step; x < VIEW.w; x += step) {
      const hot = hashRand(x * 13 + y * 7) > 0.92
      pts.push({ x, y, hot })
    }
  }
  return pts
})()

export function HeroAnnotationField() {
  const svgRef = useRef<SVGSVGElement>(null)
  const reticleRef = useRef<SVGGElement | null>(null)
  const haloRef = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const shouldReduce = useReducedMotion()

  const cursor = useRef<{ x: number; y: number; active: boolean }>({
    x: VIEW.w * 0.5,
    y: VIEW.h * 0.5,
    active: false,
  })

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    if (shouldReduce) return
    const svg = svgRef.current
    if (!svg) return

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect()
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
    }
  }, [shouldReduce])

  // Reticle position — updated on rAF
  useEffect(() => {
    if (shouldReduce) return
    let raf = 0
    const tick = () => {
      if (reticleRef.current) {
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
  }, [shouldReduce])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div ref={haloRef} className="hero-cursor-halo" style={{ opacity: 0 }} />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id="fld-fade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.75" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fld-mask">
            <rect width={VIEW.w} height={VIEW.h} fill="url(#fld-fade)" />
          </mask>

          {COLORS.map((c, i) => (
            <linearGradient key={`sg-${i}`} id={`scan-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={c} stopOpacity="0" />
              <stop offset="50%" stopColor={c} stopOpacity="0.55" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        <g mask="url(#fld-mask)" opacity={0.55}>
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

          {/* Horizontal scan rows — quiet, only three, edges only */}
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
                <circle r={row.size} fill={row.color} opacity={0}>
                  <animateMotion
                    dur={`${row.duration}s`}
                    repeatCount="indefinite"
                    begin={`-${row.offset}s`}
                    path={`M -30 ${y} L ${VIEW.w + 30} ${y}`}
                  />
                  {/* Fade at the ends so the reset snap-back is invisible */}
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
            )
          })}

          {/* Cursor reticle — center-relative crosshair. Class hook
              lets CSS punch up ring/fill brightness in light mode where
              ember-on-cream reads dimmer than ember-on-dark. */}
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
        </g>
      </svg>
    </div>
  )
}
