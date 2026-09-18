'use client'

import { useEffect, useRef, useState } from 'react'
import { NetworkNode, DataStream, FlowingLine } from '@/components/motion/primitives'

/**
 * NeuralNetworkHero
 * ─────────────────
 * A layered ML network visualization for the hero. Four layers:
 *   [Input] → [Hidden 1] → [Hidden 2] → [Output]
 * Nodes pulse with independent phases (radar rings), connections are drawn as
 * translucent lines, data packets stream along a sample of the connections
 * every few seconds. Reacts to cursor: nodes closest to the cursor brighten.
 *
 * Meant as the primary hero illustration when the "AI" angle should read
 * immediately (Home page). Reuse anywhere: import and drop into a container
 * with `aspect-[5/4]` or similar.
 */

// Layer definitions: node counts and X positions (relative to the viewBox width)
const VIEW = { w: 520, h: 420 }
const LAYERS = [
  { count: 5, x: 60, label: 'Ingest' },
  { count: 7, x: 200, label: 'Process' },
  { count: 7, x: 340, label: 'Reason' },
  { count: 3, x: 480, label: 'Insight' },
]

// Colors per layer
const LAYER_COLORS = ['#E9C46A', '#F4A261', '#FF8F5C', '#FF6B35']

// Deterministic node positions (evenly spaced)
function nodePositions() {
  return LAYERS.map((layer) => {
    const step = VIEW.h / (layer.count + 1)
    return Array.from({ length: layer.count }, (_, i) => ({
      x: layer.x,
      y: (i + 1) * step,
    }))
  })
}

// Pick a deterministic subset of connections to animate (data-flow) —
// otherwise the SVG becomes a noisy spaghetti
function pickHighlightedConnections(layers: { x: number; y: number }[][]) {
  const paths: { from: { x: number; y: number }; to: { x: number; y: number }; delay: number }[] = []
  for (let l = 0; l < layers.length - 1; l++) {
    const a = layers[l]
    const b = layers[l + 1]
    // pick 2 connections per layer transition using deterministic hash
    const picks = [
      { i: (l * 3) % a.length, j: (l * 5) % b.length, delay: l * 0.8 },
      { i: (l * 7 + 2) % a.length, j: (l * 11 + 3) % b.length, delay: l * 0.8 + 1.4 },
    ]
    picks.forEach((p) => paths.push({ from: a[p.i], to: b[p.j], delay: p.delay }))
  }
  return paths
}

export function NeuralNetworkHero() {
  const layers = nodePositions()
  const highlights = pickHighlightedConnections(layers)

  // Cursor tracking — nodes near cursor glow more
  const svgRef = useRef<SVGSVGElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * VIEW.w
      const y = ((e.clientY - rect.top) / rect.height) * VIEW.h
      setCursor({ x, y })
    }
    const onLeave = () => setCursor(null)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // Node hover-glow intensity (distance from cursor)
  function nodeIntensity(x: number, y: number) {
    if (!cursor) return 1
    const dx = cursor.x - x
    const dy = cursor.y - y
    const d = Math.sqrt(dx * dx + dy * dy)
    // Within 80 units → full boost; falls off to 1.0 at 220
    const t = Math.max(0, Math.min(1, 1 - (d - 40) / 180))
    return 1 + t * 1.4
  }

  // Curved cubic between two points (for aesthetic connections)
  function curve(from: { x: number; y: number }, to: { x: number; y: number }) {
    const midX = (from.x + to.x) / 2
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 60% 50%, rgba(255,107,53,0.15) 0%, transparent 60%)',
          filter: 'blur(12px)',
        }}
      />

      <div className="illust-frame p-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="h-auto w-full"
        aria-label="AI processing pipeline"
      >
        <defs>
          <linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E9C46A" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#F4A261" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="node-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Layer labels */}
        {LAYERS.map((layer) => (
          <text
            key={layer.label}
            x={layer.x}
            y={VIEW.h - 8}
            textAnchor="middle"
            fontSize="9"
            letterSpacing="1.5"
            fill="rgba(250,245,238,0.35)"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {layer.label.toUpperCase()}
          </text>
        ))}

        {/* All connections — subtle */}
        {layers.slice(0, -1).map((layer, li) =>
          layer.map((from, i) =>
            layers[li + 1].map((to, j) => {
              const key = `${li}-${i}-${j}`
              const intensity = (nodeIntensity(from.x, from.y) + nodeIntensity(to.x, to.y)) / 2 - 1
              return (
                <path
                  key={key}
                  d={curve(from, to)}
                  stroke="url(#conn-grad)"
                  strokeWidth={0.7}
                  fill="none"
                  opacity={0.15 + intensity * 0.25}
                  style={{ transition: 'opacity 300ms ease' }}
                />
              )
            })
          )
        )}

        {/* Highlighted flowing connections + streaming data packets */}
        {highlights.map((h, idx) => (
          <FlowingLine
            key={`flow-${idx}`}
            d={curve(h.from, h.to)}
            color={LAYER_COLORS[Math.floor(idx / 2) + 1] || '#FF6B35'}
            width={1.2}
            speed={5}
            delay={h.delay}
            dash="4 8"
            opacity={0.9}
          />
        ))}

        {highlights.map((h, idx) => (
          <DataStream
            key={`stream-${idx}`}
            path={curve(h.from, h.to)}
            color={LAYER_COLORS[Math.floor(idx / 2) + 1] || '#FF6B35'}
            count={1}
            size={2}
            duration={2.2}
            offset={h.delay * 0.3}
          />
        ))}

        {/* Nodes */}
        {layers.map((layer, li) =>
          layer.map((n, i) => {
            const intensity = nodeIntensity(n.x, n.y)
            const active = (i + li) % 2 === 0
            return (
              <g key={`n-${li}-${i}`} style={{ transition: 'transform 200ms ease' }}>
                <NetworkNode
                  cx={n.x}
                  cy={n.y}
                  r={5 * Math.min(1.6, intensity)}
                  color={LAYER_COLORS[li]}
                  active={active}
                  delay={((li * 7 + i * 3) % 10) / 10}
                />
              </g>
            )
          })
        )}
      </svg>
      </div>

      {/* Bottom KPI strip — data pulse */}
      <div
        className="mt-4 grid grid-cols-3 gap-3 rounded-2xl border p-3 backdrop-blur-md"
        style={{
          background: 'var(--card-surface)',
          borderColor: 'var(--border-glass)',
        }}
      >
        {[
          { label: 'Latency', value: '12ms', dot: '#E9C46A' },
          { label: 'Throughput', value: '2.4M/s', dot: '#F4A261' },
          { label: 'Accuracy', value: '99.2%', dot: '#FF6B35' },
        ].map((k) => (
          <div key={k.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: k.dot, boxShadow: `0 0 8px ${k.dot}` }}
            />
            <div>
              <p
                className="text-[13px] font-semibold text-white/90"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
              >
                {k.value}
              </p>
              <p
                className="text-[9px] uppercase tracking-[0.12em] text-white/40"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {k.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
