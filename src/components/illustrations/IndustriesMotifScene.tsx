'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * IndustriesMotifScene
 * ────────────────────
 * A rotating carousel of sector motifs — healthcare plus, finance bars,
 * technology nodes, retail cart, education cap, professional documents,
 * public sector building. One motif is active at a time; a React state
 * cycle drives the swap (setInterval + useState), and CSS opacity
 * transitions handle the fade — reliable in a way that stacked SVG
 * <animate keyTimes> pipelines aren't.
 *
 * Around the center: a warm halo, small ember particles drifting, and
 * seven sector dots orbiting on a slow ring (one lights up as its
 * motif takes the stage).
 */

const VIEW = { w: 520, h: 420 }
const CENTER = { x: VIEW.w / 2, y: VIEW.h / 2 }
const N = 7
const SLOT_MS = 3000 // 3 seconds per motif

// Ring positions for the seven sector dots. Rounded so SSR & CSR
// produce identical string serialisations (avoids hydration warnings).
function ringPos(i: number, radius = 140) {
  const angle = -Math.PI / 2 + (i / N) * Math.PI * 2
  return {
    x: Number((CENTER.x + Math.cos(angle) * radius).toFixed(3)),
    y: Number((CENTER.y + Math.sin(angle) * radius).toFixed(3)),
  }
}

const SECTORS = [
  { name: 'HEALTHCARE', color: '#FF6B35' },
  { name: 'FINANCE', color: '#F4A261' },
  { name: 'TECHNOLOGY', color: '#FF8F5C' },
  { name: 'RETAIL', color: '#E9C46A' },
  { name: 'EDUCATION', color: '#FABD6C' },
  { name: 'PROFESSIONAL', color: '#F4A261' },
  { name: 'PUBLIC', color: '#FF6B35' },
]

// Each motif is centered at (0,0). Visibility is driven by the parent's
// `active` state, so no per-motif SVG timing math — the parent picks who
// is on stage and this component fades in/out via CSS transition.
function Motif({ index, active }: { index: number; active: boolean }) {
  const color = SECTORS[index].color

  const glyphs: Record<number, React.ReactNode> = {
    // 0 — HEALTHCARE plus with pulse
    0: (
      <g>
        {/* pulsing ring */}
        <circle r="46" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4">
          <animate attributeName="r" values="40; 56" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6; 0" dur="1.6s" repeatCount="indefinite" />
        </circle>
        {/* plus sign */}
        <rect x="-24" y="-8" width="48" height="16" rx="3" fill={color} opacity="0.95" style={{ filter: `drop-shadow(0 0 10px ${color}bb)` }} />
        <rect x="-8" y="-24" width="16" height="48" rx="3" fill={color} opacity="0.95" style={{ filter: `drop-shadow(0 0 10px ${color}bb)` }} />
        {/* heartbeat line */}
        <path
          d="M -60 40 L -30 40 L -20 20 L -10 60 L 0 30 L 10 40 L 60 40"
          fill="none"
          stroke="rgba(255,240,220,0.85)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="200"
          strokeDashoffset="200"
        >
          <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.4s" repeatCount="indefinite" />
        </path>
      </g>
    ),
    // 1 — FINANCE bars anchored to a common baseline, growing upward.
    // Each bar's y = baseline - height, so bars sit on a shared floor
    // and get taller left-to-right (a proper ascending chart).
    1: (
      <g>
        {(() => {
          const baseline = 28
          return [-30, -10, 10, 30].map((x, i) => {
            const h = 22 + i * 12
            return (
              <rect
                key={i}
                x={x - 5}
                y={baseline - h}
                width="10"
                height={h}
                rx="1.5"
                fill={color}
                opacity={0.4 + i * 0.15}
                style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
              >
                <animate
                  attributeName="height"
                  values={`${h}; ${h - 8}; ${h}`}
                  dur={`${1.6 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values={`${baseline - h}; ${baseline - (h - 8)}; ${baseline - h}`}
                  dur={`${1.6 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </rect>
            )
          })
        })()}
        {/* Baseline line */}
        <line x1="-42" y1="30" x2="42" y2="30" stroke={color} strokeWidth="0.8" opacity="0.4" />
        {/* Ascending trend line — sits above the bar tops, moves up-right */}
        <path
          d="M -40 6 L -20 -2 L 0 -10 L 20 -20 L 40 -30"
          stroke="rgba(255,240,220,0.9)"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Arrow head at the end pointing up-right */}
        <path d="M 40 -30 L 34 -28 M 40 -30 L 38 -24" stroke="rgba(255,240,220,0.9)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="40" cy="-30" r="3" fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </g>
    ),
    // 2 — TECHNOLOGY node network
    2: (
      <g>
        {[
          { x: -34, y: -18 },
          { x: 34, y: -18 },
          { x: 0, y: 4 },
          { x: -30, y: 26 },
          { x: 30, y: 26 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="9" fill={color} opacity="0.85" style={{ filter: `drop-shadow(0 0 6px ${color}bb)` }}>
              <animate attributeName="r" values="7; 10; 7" dur={`${1.6 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        {/* connections */}
        {[
          'M -34 -18 L 0 4',
          'M 34 -18 L 0 4',
          'M 0 4 L -30 26',
          'M 0 4 L 30 26',
          'M -34 -18 L 34 -18',
        ].map((d, i) => (
          <path key={i} d={d} stroke={color} strokeWidth="0.8" opacity="0.55" fill="none" strokeDasharray="3 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="2s" repeatCount="indefinite" />
          </path>
        ))}
      </g>
    ),
    // 3 — RETAIL cart / basket
    3: (
      <g>
        <path
          d="M -30 -18 L -22 -18 L -14 14 L 26 14 L 32 -8 L -18 -8"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
        <circle cx="-8" cy="24" r="4" fill={color} />
        <circle cx="20" cy="24" r="4" fill={color} />
        {/* falling item */}
        <rect x="0" y="-40" width="10" height="10" rx="1" fill="rgba(255,240,220,0.85)">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 32"
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="1; 1; 0" keyTimes="0; 0.6; 1" dur="1.6s" repeatCount="indefinite" />
        </rect>
      </g>
    ),
    // 4 — EDUCATION mortarboard
    4: (
      <g>
        <path d="M -34 -6 L 0 -22 L 34 -6 L 0 10 Z" fill={color} opacity="0.95" style={{ filter: `drop-shadow(0 0 8px ${color}bb)` }} />
        <path d="M -22 -1 L -22 16 Q 0 30 22 16 L 22 -1" fill="none" stroke={color} strokeWidth="1.5" />
        {/* tassel */}
        <line x1="34" y1="-6" x2="34" y2="18" stroke="rgba(255,240,220,0.8)" strokeWidth="1.2" />
        <circle cx="34" cy="22" r="3" fill="rgba(255,240,220,0.85)">
          <animate attributeName="cy" values="20; 24; 20" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </g>
    ),
    // 5 — PROFESSIONAL documents fanned out like a card stack. Bigger
    // offsets + rotation so each page reads as a distinct sheet rather
    // than overlapping mush. Front doc gets the stamp.
    5: (
      <g>
        {[
          { x: -22, y: 6, r: -14, o: 0.55 },
          { x: -4, y: 0, r: -4, o: 0.75 },
          { x: 14, y: -4, r: 8, o: 1 },
        ].map((d, i) => (
          <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.r})`} opacity={d.o}>
            <rect
              x="-14"
              y="-20"
              width="28"
              height="38"
              rx="2"
              fill="rgba(20,15,11,0.9)"
              stroke={color}
              strokeWidth="1"
            />
            {/* doc header line — coloured */}
            <rect x="-10" y="-15" width="14" height="2" rx="1" fill={color} opacity="0.9" />
            {/* body lines */}
            {[-9, -4, 1, 6, 11].map((y, ii) => (
              <rect
                key={ii}
                x="-10"
                y={y}
                width={ii === 4 ? 14 : ii === 3 ? 20 : 18}
                height="1.4"
                fill={color}
                opacity="0.55"
              />
            ))}
          </g>
        ))}
        {/* Stamp on the front doc — rotates gently */}
        <g transform="translate(20 -18)">
          <circle r="9" fill="none" stroke={color} strokeWidth="1.6" opacity="0.95">
            <animate attributeName="opacity" values="0.55; 1; 0.55" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <path d="M -4 0 L -1 3 L 5 -4" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    ),
    // 6 — PUBLIC SECTOR classical building
    6: (
      <g>
        {/* roof */}
        <path d="M -36 -14 L 0 -30 L 36 -14 Z" fill={color} opacity="0.9" />
        <rect x="-36" y="-14" width="72" height="4" fill={color} opacity="0.85" />
        {/* columns */}
        {[-24, -8, 8, 24].map((x, i) => (
          <rect key={i} x={x - 3} y="-10" width="6" height="22" fill={color} opacity="0.85">
            <animate attributeName="opacity" values="0.6; 0.95; 0.6" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" />
          </rect>
        ))}
        <rect x="-38" y="12" width="76" height="6" fill={color} opacity="0.85" />
        {/* rays */}
        {[-40, -20, 0, 20, 40].map((x, i) => (
          <line key={i} x1={x} y1="-40" x2={x} y2="-32" stroke={color} strokeWidth="1.2" opacity="0.55">
            <animate attributeName="opacity" values="0; 0.9; 0" dur="1.6s" begin={`-${i * 0.3}s`} repeatCount="indefinite" />
          </line>
        ))}
      </g>
    ),
  }

  return (
    <g
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
      }}
    >
      {glyphs[index]}
    </g>
  )
}

export function IndustriesMotifScene() {
  // State-driven sector cycle. Starts at 0 (same on server and client
  // for hydration parity), then advances on a 3s tick client-side.
  // Honors reduced-motion by pinning to the first motif.
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
        <radialGradient id="hub-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo */}
      <circle cx={CENTER.x} cy={CENTER.y} r="150" fill="url(#hub-halo)">
        <animate attributeName="r" values="130; 170; 130" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Outer orbit ring */}
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r="140"
        fill="none"
        stroke="rgba(255,143,92,0.25)"
        strokeWidth="0.7"
        strokeDasharray="3 5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CENTER.x} ${CENTER.y}`}
          to={`360 ${CENTER.x} ${CENTER.y}`}
          dur="60s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Sector dots — one lights up per slot */}
      {SECTORS.map((s, i) => {
        const p = ringPos(i)
        const isActive = i === active
        return (
          <g key={s.name}>
            <circle cx={p.x} cy={p.y} r="5" fill="rgba(20,15,11,0.85)" stroke={s.color} strokeWidth="0.9" opacity="0.55" />
            {/* Active-state overlay: fades in when this sector's motif is on stage */}
            <g
              style={{
                opacity: isActive ? 1 : 0,
                transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <circle cx={p.x} cy={p.y} r="7" fill={s.color} style={{ filter: `drop-shadow(0 0 8px ${s.color}dd)` }} />
              <circle cx={p.x} cy={p.y} r="12" fill="none" stroke={s.color} strokeWidth="0.8" opacity="0.55">
                <animate attributeName="r" values="10; 22" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7; 0" dur="1.4s" repeatCount="indefinite" />
              </circle>
            </g>
            {/* label */}
            <text
              x={p.x}
              y={p.y + (p.y > CENTER.y ? 22 : -14)}
              textAnchor="middle"
              fontSize="8.5"
              fontFamily="var(--font-mono)"
              fill={s.color}
              opacity={isActive ? 0.95 : 0.55}
              style={{ letterSpacing: '0.14em', transition: 'opacity 500ms ease' }}
            >
              {s.name}
            </text>
          </g>
        )
      })}

      {/* Center — the current motif plays here */}
      <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
        {/* Center backing plate */}
        <circle r="70" fill="rgba(20,15,11,0.75)" stroke="rgba(255,143,92,0.35)" strokeWidth="0.8" />
        {SECTORS.map((_, i) => (
          <Motif key={i} index={i} active={i === active} />
        ))}
      </g>
    </svg>
  )
}
