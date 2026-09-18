'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * AboutTeamScene — hexagonal values constellation
 * ────────────────────────────────────────────────
 * The six Lakspire values sit on a hexagon around a central signature
 * mark. Two hex frames rotate in opposite directions (fast outer +
 * slow inner) and one value point at a time pulses on a 2.4-second
 * cadence. Purely orbital motion — deliberately no streaming packets
 * or convergent arcs (those are already the FinalCTA/hero grammar,
 * and re-using them made About feel redundant).
 *
 * State-driven active-value cycle so the sequence is reliable across
 * SSR and reduced-motion.
 */

const VIEW = { w: 520, h: 420 }
const CENTER = { x: VIEW.w / 2, y: VIEW.h / 2 }
const RADIUS = 130
const N = 6
const SLOT_MS = 2400

const VALUES = [
  { label: 'ACCURACY', color: '#FF6B35' },
  { label: 'INTEGRITY', color: '#F4A261' },
  { label: 'SECURITY', color: '#FF8F5C' },
  { label: 'COLLAB', color: '#E9C46A' },
  { label: 'ADAPT', color: '#FABD6C' },
  { label: 'IMPROVE', color: '#FF6B35' },
]

const round3 = (n: number) => Number(n.toFixed(3))

// Hex vertices starting from top, clockwise
function hexPoint(i: number, r = RADIUS) {
  const angle = -Math.PI / 2 + (i / N) * Math.PI * 2
  return {
    x: round3(CENTER.x + Math.cos(angle) * r),
    y: round3(CENTER.y + Math.sin(angle) * r),
  }
}

const OUTER_HEX = Array.from({ length: N }, (_, i) => hexPoint(i, RADIUS))
const INNER_HEX = Array.from({ length: N }, (_, i) => hexPoint(i, 70))

// Hexagon path (outer + inner as attribute strings for <polygon>)
const outerPoints = OUTER_HEX.map((p) => `${p.x},${p.y}`).join(' ')
const innerPoints = INNER_HEX.map((p) => `${p.x},${p.y}`).join(' ')

export function AboutTeamScene() {
  const [active, setActive] = useState(0)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % N)
    }, SLOT_MS)
    return () => window.clearInterval(id)
  }, [shouldReduce])

  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="seal-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hex-edge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E9C46A" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#F4A261" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Backing halo */}
      <circle cx={CENTER.x} cy={CENTER.y} r="150" fill="url(#seal-halo)">
        <animate attributeName="r" values="135; 165; 135" dur="4.5s" repeatCount="indefinite" />
      </circle>

      {/* Rotating outer dashed circle — slow */}
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={RADIUS + 24}
        fill="none"
        stroke="rgba(255,143,92,0.22)"
        strokeWidth="0.7"
        strokeDasharray="2 6"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CENTER.x} ${CENTER.y}`}
          to={`360 ${CENTER.x} ${CENTER.y}`}
          dur="90s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Outer hex frame — rotates clockwise slowly */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CENTER.x} ${CENTER.y}`}
          to={`360 ${CENTER.x} ${CENTER.y}`}
          dur="60s"
          repeatCount="indefinite"
        />
        <polygon
          points={outerPoints}
          fill="none"
          stroke="url(#hex-edge)"
          strokeWidth="0.9"
          opacity="0.55"
        />
      </g>

      {/* Inner hex frame — counter-rotates */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CENTER.x} ${CENTER.y}`}
          to={`-360 ${CENTER.x} ${CENTER.y}`}
          dur="42s"
          repeatCount="indefinite"
        />
        <polygon
          points={innerPoints}
          fill="rgba(20,15,11,0.6)"
          stroke="rgba(255,143,92,0.4)"
          strokeWidth="0.7"
          opacity="0.8"
        />
      </g>

      {/* Star-of-David style cross links between opposing vertices */}
      {[0, 1, 2].map((i) => {
        const a = OUTER_HEX[i]
        const b = OUTER_HEX[(i + 3) % 6]
        return (
          <line
            key={`x-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="rgba(255,143,92,0.14)"
            strokeWidth="0.6"
            strokeDasharray="2 5"
          />
        )
      })}

      {/* Six value points — one pulses at a time */}
      {VALUES.map((v, i) => {
        const p = OUTER_HEX[i]
        const isActive = i === active
        const labelBelow = p.y > CENTER.y
        return (
          <g key={v.label}>
            {/* base dot */}
            <circle
              cx={p.x}
              cy={p.y}
              r="6"
              fill="rgba(20,15,11,0.9)"
              stroke={v.color}
              strokeWidth="1"
              opacity="0.85"
            />
            <circle cx={p.x} cy={p.y} r="2.4" fill={v.color} opacity="0.9" />

            {/* active-state ping */}
            <g
              style={{
                opacity: isActive ? 1 : 0,
                transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="9"
                fill={v.color}
                opacity="0.85"
                style={{ filter: `drop-shadow(0 0 10px ${v.color}dd)` }}
              />
              <circle cx={p.x} cy={p.y} r="14" fill="none" stroke={v.color} strokeWidth="0.8">
                <animate attributeName="r" values="12; 28" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.75; 0" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* label */}
            <text
              x={p.x}
              y={p.y + (labelBelow ? 26 : -14)}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-mono)"
              fill={v.color}
              opacity={isActive ? 0.95 : 0.55}
              style={{ letterSpacing: '0.16em', transition: 'opacity 500ms ease' }}
            >
              {v.label}
            </text>
          </g>
        )
      })}

      {/* Central signature mark — a compact "L" monogram sealed within
          the inner hex. Steady, not pulsing — the anchor of the piece. */}
      <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
        <circle r="28" fill="rgba(20,15,11,0.85)" stroke="rgba(255,143,92,0.55)" strokeWidth="0.8" />
        <circle r="20" fill="none" stroke="rgba(255,143,92,0.28)" strokeWidth="0.5" />
        {/* Stylised "L" mark for Lakspire */}
        <path
          d="M -10 -12 L -10 12 L 10 12"
          stroke="#FF8F5C"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="12" cy="12" r="2.4" fill="#FF6B35">
          <animate attributeName="opacity" values="1; 0.5; 1" dur="2.8s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}
