'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * HeroWorkspaceScene
 * ──────────────────
 * The hero's focal visual — a live "annotation workspace" that reads
 * like a product-in-action rather than decorative background. Inspired
 * by superannotate's landing hero, which shows a workspace being
 * annotated in real time as the primary storytelling device.
 *
 * Composition:
 *   • A neural-processing scene: three layers of colored nodes, curved
 *     connections between them, and two highlighted paths carrying
 *     streaming data packets. This is the "content" being annotated.
 *   • Ember corner brackets frame the working area (no rectangular card).
 *   • A rotating three-box annotation loop overlays the network:
 *     each bbox draws in with a dashed border, holds with a class-and-
 *     confidence label chip, then fades so the next box takes its turn.
 *   • A ring-arc progress indicator at the top-right: "annotation 87%".
 *   • A metadata chip at the top-left and a live-metrics strip at the
 *     bottom sell the "product working" story.
 *
 * Interaction:
 *   • Nodes near the cursor swell + brighten
 *   • Edges near the cursor strengthen
 *   • Whichever bbox is currently visible gets a bigger detail chip
 *     when the cursor is near it
 *
 * The scene is UNFRAMED — no illust-frame, no card. Soft radial fades
 * blend it into the hero atmosphere so it feels sculpted-in rather than
 * walled-off. Copy sits to its left in the hero grid.
 */

const VIEW = { w: 1000, h: 560 }
const COLORS = ['#FF6B35', '#FF8F5C', '#F4A261', '#E9C46A']
const LAYER_COLORS = ['#E9C46A', '#F4A261', '#FF8F5C', '#FF6B35']

// ─── Node network ──────────────────────────────────────────────
// Four-layer feedforward: 4 → 7 → 7 → 3. Wider aspect ratio + more
// nodes so the CNN reads as a real, dense pipeline rather than a
// sparse diagram. Colors run cool→warm as the flow moves left→right.
const LAYERS = [
  { count: 4, x: 120, label: 'INGEST' },
  { count: 7, x: 380, label: 'ENCODE' },
  { count: 7, x: 640, label: 'REASON' },
  { count: 3, x: 890, label: 'INSIGHT' },
]

type Pt = { x: number; y: number }

function layerNodes(): Pt[][] {
  // Tighter vertical margin so dense layers (7 nodes) get comfortable
  // spacing without touching, and shorter layers (3-4 nodes) centered
  // within the same working range.
  return LAYERS.map((layer) => {
    const marginY = 110
    const usable = VIEW.h - marginY * 2
    const step = usable / Math.max(1, layer.count - 1)
    return Array.from({ length: layer.count }, (_, i) => ({
      x: layer.x,
      y: marginY + i * step,
    }))
  })
}

// Curved cubic between two points
function curvePath(a: Pt, b: Pt) {
  const midX = (a.x + b.x) / 2
  return `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`
}

// Deterministic pseudo-random from a seed
function hashRand(seed: number) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// ─── Annotation loop ──────────────────────────────────────────
// Three bounding boxes that cycle through the scene, each annotating
// a different region. The cycle: each box has a 4.2s slot in which it
// (1) draws in over 0.6s, (2) holds with label chip 3.0s, (3) fades 0.6s.
const ANNOTATIONS = [
  {
    // Wraps the two hidden ENCODE + REASON layers — the "thinking" middle
    x: 290, y: 110, w: 460, h: 360,
    label: 'pattern_cluster',
    conf: 0.94,
    color: COLORS[0],
    accent: 'ember',
  },
  {
    // Wraps the INGEST column on the left
    x: 60, y: 90, w: 200, h: 380,
    label: 'signal_ingest',
    conf: 0.91,
    color: COLORS[3],
    accent: 'gold',
  },
  {
    // Wraps REASON+INSIGHT on the right
    x: 560, y: 120, w: 400, h: 340,
    label: 'insight_hot',
    conf: 0.96,
    color: COLORS[1],
    accent: 'amber',
  },
]

const ANNO_SLOT = 4.2 // seconds per annotation
const ANNO_DRAW = 0.6
const ANNO_FADE = 0.6

// ─── Component ────────────────────────────────────────────────
export function HeroWorkspaceScene() {
  const shouldReduce = useReducedMotion()
  const nodes = useMemo(() => layerNodes(), [])
  // Edges: dense between adjacent layers
  const edges = useMemo(() => {
    const list: Array<{ a: Pt; b: Pt; li: number }> = []
    for (let li = 0; li < nodes.length - 1; li++) {
      for (const a of nodes[li]) {
        for (const b of nodes[li + 1]) {
          list.push({ a, b, li })
        }
      }
    }
    return list
  }, [nodes])

  // Highlighted paths — spread across all four layer transitions so
  // the streaming packets keep every part of the pipeline alive.
  const highlights = useMemo(
    () => [
      // Ingest → Encode
      { a: nodes[0][0], b: nodes[1][2], color: LAYER_COLORS[1], delay: 0 },
      { a: nodes[0][1], b: nodes[1][4], color: LAYER_COLORS[0], delay: 2.2 },
      { a: nodes[0][3], b: nodes[1][1], color: LAYER_COLORS[1], delay: 3.6 },
      // Encode → Reason
      { a: nodes[1][2], b: nodes[2][0], color: LAYER_COLORS[2], delay: 1.6 },
      { a: nodes[1][6], b: nodes[2][3], color: LAYER_COLORS[2], delay: 0.8 },
      { a: nodes[1][0], b: nodes[2][5], color: LAYER_COLORS[1], delay: 2.9 },
      { a: nodes[1][3], b: nodes[2][6], color: LAYER_COLORS[2], delay: 4.2 },
      // Reason → Insight
      { a: nodes[2][1], b: nodes[3][0], color: LAYER_COLORS[3], delay: 1.2 },
      { a: nodes[2][3], b: nodes[3][1], color: LAYER_COLORS[3], delay: 2.6 },
      { a: nodes[2][5], b: nodes[3][2], color: LAYER_COLORS[3], delay: 3.8 },
    ],
    [nodes],
  )

  // Drift orbs — soft ambient particles that actually drift instead of
  // pulsing in place. Each orb gets its own looping bezier "orbit" so the
  // ambient layer reads as flow, not a field of static dots. cx/cy stay
  // at 0 (see the highlighted-packet fix for why) and the base position
  // lives in the animateMotion path's M-coordinate.
  const DRIFT_ORBS = useMemo(() => {
    const orbs: Array<{
      cx: number
      cy: number
      r: number
      color: string
      pulseDur: number
      driftDur: number
      driftPath: string
      pulseDelay: number
      driftDelay: number
    }> = []
    for (let i = 0; i < 14; i++) {
      // Base positions kept well inside the frame so the wandering
      // ellipse can never carry an orb into a corner. Previously
      // cx=80 + rx=90 let orbs cross x=-10, showing them briefly
      // clustered at the left edge — the glitch the user kept flagging.
      const cx = 170 + hashRand(i * 17) * (VIEW.w - 340)
      const cy = 150 + hashRand(i * 29) * (VIEW.h - 280)
      const rx = 30 + hashRand(i * 83) * 50
      const ry = 20 + hashRand(i * 89) * 30
      const driftPath =
        `M ${cx} ${cy - ry} ` +
        `C ${cx + rx} ${cy - ry}, ${cx + rx} ${cy + ry}, ${cx} ${cy + ry} ` +
        `C ${cx - rx} ${cy + ry}, ${cx - rx} ${cy - ry}, ${cx} ${cy - ry} Z`
      orbs.push({
        cx,
        cy,
        r: 0.8 + hashRand(i * 41) * 1.8,
        color: COLORS[i % COLORS.length],
        pulseDur: 3 + hashRand(i * 53) * 3,
        driftDur: 9 + hashRand(i * 47) * 8,
        driftPath,
        pulseDelay: hashRand(i * 71) * -3,
        driftDelay: hashRand(i * 61) * -12,
      })
    }
    return orbs
  }, [])

  const svgRef = useRef<SVGSVGElement>(null)
  const nodeRefs = useRef<(SVGCircleElement | null)[][]>([])
  const edgeRefs = useRef<(SVGPathElement | null)[]>([])
  const annoRefs = useRef<(SVGGElement | null)[]>([])
  const progressArcRef = useRef<SVGPathElement | null>(null)
  const progressLabelRef = useRef<SVGTextElement | null>(null)
  const chipRefs = useRef<(SVGGElement | null)[]>([])
  const [visible, setVisible] = useState(false)

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
        return
      }
      const x = ((e.clientX - rect.left) / rect.width) * VIEW.w
      const y = ((e.clientY - rect.top) / rect.height) * VIEW.h
      cursor.current = { x, y, active: true }
    }
    const onLeave = () => {
      cursor.current.active = false
    }
    svg.addEventListener('pointermove', onMove, { passive: true })
    svg.addEventListener('pointerleave', onLeave)
    return () => {
      svg.removeEventListener('pointermove', onMove)
      svg.removeEventListener('pointerleave', onLeave)
    }
  }, [shouldReduce])

  // ─── Animation loop ─────────────────────────────────────────
  useEffect(() => {
    if (shouldReduce) return
    let raf = 0
    const start = performance.now()

    const arcTarget = 2 * Math.PI * 0.87 // 87% around the ring
    const arcR = 24
    const arcCx = VIEW.w - 82
    const arcCy = 62

    const tick = (now: number) => {
      const t = (now - start) / 1000

      // Nodes — pulse + cursor-swell
      for (let li = 0; li < nodes.length; li++) {
        const row = nodes[li]
        for (let i = 0; i < row.length; i++) {
          const el = nodeRefs.current[li]?.[i]
          if (!el) continue
          const n = row[i]
          const phase = hashRand(li * 13 + i * 7)
          const pulse = 1 + Math.sin(t * 1.4 + phase * 6) * 0.15
          let boost = 1
          let opacity = 0.85
          if (cursor.current.active) {
            const d = Math.hypot(cursor.current.x - n.x, cursor.current.y - n.y)
            const pull = Math.max(0, 1 - d / 220)
            boost = 1 + pull * 1.4
            opacity = 0.85 + pull * 0.15
          }
          el.setAttribute('r', String(8 * pulse * boost))
          el.style.opacity = String(opacity)
        }
      }

      // Edges — strengthen near cursor
      for (let i = 0; i < edges.length; i++) {
        const el = edgeRefs.current[i]
        if (!el) continue
        const e = edges[i]
        let strength = 0.18
        if (cursor.current.active) {
          const da = Math.hypot(cursor.current.x - e.a.x, cursor.current.y - e.a.y)
          const db = Math.hypot(cursor.current.x - e.b.x, cursor.current.y - e.b.y)
          const closer = Math.min(da, db)
          const pull = Math.max(0, 1 - closer / 200)
          strength = 0.18 + pull * 0.5
        }
        el.style.opacity = String(strength)
      }

      // Annotation loop — figure out which bbox is currently on-stage
      const cycle = ANNOTATIONS.length * ANNO_SLOT
      const localT = t % cycle
      const activeIdx = Math.floor(localT / ANNO_SLOT)
      const withinSlot = localT - activeIdx * ANNO_SLOT

      for (let i = 0; i < ANNOTATIONS.length; i++) {
        const el = annoRefs.current[i]
        const chip = chipRefs.current[i]
        if (!el) continue
        let alpha = 0
        let dash = 0
        let scale = 1
        if (i === activeIdx) {
          if (withinSlot < ANNO_DRAW) {
            const p = withinSlot / ANNO_DRAW
            alpha = p
            dash = 200 * (1 - p) // dashOffset for draw-in effect
            scale = 0.985 + p * 0.015
          } else if (withinSlot < ANNO_SLOT - ANNO_FADE) {
            alpha = 1
            dash = 0
            scale = 1
          } else {
            const p = (withinSlot - (ANNO_SLOT - ANNO_FADE)) / ANNO_FADE
            alpha = 1 - p
            dash = 0
            scale = 1 - p * 0.02
          }
        }
        el.style.opacity = String(alpha)
        const a = ANNOTATIONS[i]
        const cx = a.x + a.w / 2
        const cy = a.y + a.h / 2
        el.setAttribute(
          'transform',
          `translate(${cx - cx * scale} ${cy - cy * scale}) scale(${scale})`,
        )
        // The dashed rect uses this for its stroke-dashoffset
        const rect = el.querySelector('rect[data-anim="border"]') as SVGRectElement | null
        if (rect) rect.style.strokeDashoffset = String(dash)

        // Chip expands when cursor is inside the bbox
        if (chip) {
          let expand = 0
          if (i === activeIdx && cursor.current.active) {
            const inside =
              cursor.current.x >= a.x &&
              cursor.current.x <= a.x + a.w &&
              cursor.current.y >= a.y &&
              cursor.current.y <= a.y + a.h
            expand = inside ? 1 : 0
          }
          chip.style.transform = `translate(0px, ${expand * -3}px)`
          const detail = chip.querySelector('[data-detail]') as SVGGElement | null
          if (detail) detail.style.opacity = String(expand)
        }
      }

      // Progress ring — subtle bob, otherwise fixed
      if (progressArcRef.current) {
        const bob = 0.87 + Math.sin(t * 1.1) * 0.008
        const stopAngle = 2 * Math.PI * bob
        // Redraw the arc path
        const startAng = -Math.PI / 2
        const endAng = startAng + stopAngle
        const sx = arcCx + arcR * Math.cos(startAng)
        const sy = arcCy + arcR * Math.sin(startAng)
        const ex = arcCx + arcR * Math.cos(endAng)
        const ey = arcCy + arcR * Math.sin(endAng)
        const large = stopAngle > Math.PI ? 1 : 0
        progressArcRef.current.setAttribute(
          'd',
          `M ${sx} ${sy} A ${arcR} ${arcR} 0 ${large} 1 ${ex} ${ey}`,
        )
        if (progressLabelRef.current) {
          progressLabelRef.current.textContent = `${Math.round(bob * 100)}%`
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // silence unused
    void arcTarget
    return () => cancelAnimationFrame(raf)
  }, [shouldReduce, nodes, edges, highlights])

  return (
    <div
      className="relative w-full"
      aria-hidden="true"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Ambient ember bloom behind the whole scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 -m-8"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 55% 50%, rgba(255,107,53,0.28) 0%, rgba(244,162,97,0.12) 40%, transparent 72%)',
          filter: 'blur(22px)',
        }}
      />

      {/* Workspace canvas — .illust-frame carries the reverse SVG shim
          so off-white strokes/fills stay light in both themes AND gives
          the workspace its own warm-dark viewport. Inline overrides
          soften the card feel: bigger radius, subtle border, no harsh
          padding, ember shadow that gives it a lifted screen aesthetic
          without walling it off from the hero atmosphere. */}
      <div
        className="illust-frame"
        style={{
          borderRadius: 22,
          border: '1px solid rgba(255, 143, 92, 0.22)',
          // Tightened from clamp(12,1.4vw,20) — the earlier padding
          // wasted a fat ring of dark around the scene which made the
          // visualization feel undersized inside its own frame.
          padding: 'clamp(4px, 0.5vw, 9px)',
          backdropFilter: 'none',
        }}
      >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="h-auto w-full"
        style={{ pointerEvents: 'auto', display: 'block' }}
      >
        <defs>
          {/* Softly fade the outer edges so the scene doesn't hit a
              hard rectangle — it dissolves into the hero atmosphere */}
          <radialGradient id="ws-fade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="0.94" />
            <stop offset="100%" stopColor="white" stopOpacity="0.35" />
          </radialGradient>
          <mask id="ws-mask">
            <rect width={VIEW.w} height={VIEW.h} fill="url(#ws-fade)" />
          </mask>

          <linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E9C46A" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#F4A261" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.7" />
          </linearGradient>

          {/* Subtle workspace grid pattern */}
          <pattern id="ws-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,240,220,0.05)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        <g mask="url(#ws-mask)">
          {/* Grid backdrop */}
          <rect width={VIEW.w} height={VIEW.h} fill="url(#ws-grid)" />

          {/* Drift orbs — each orbits its own base position along a soft
              looping bezier while pulsing on an independent phase. Wrapped
              in a hidden <g> that flips visible once motion attaches, so
              no orb flashes at (0,0). */}
          {DRIFT_ORBS.map((o, i) => (
            <g key={`orb-${i}`} visibility="hidden">
              <set
                attributeName="visibility"
                to="visible"
                begin="0.08s"
                fill="freeze"
              />
              <animateMotion
                dur={`${o.driftDur}s`}
                repeatCount="indefinite"
                begin={`${o.driftDelay}s`}
                path={o.driftPath}
                calcMode="linear"
              />
              <circle cx={0} cy={0} r={o.r} fill={o.color} opacity={0.5}>
                <animate
                  attributeName="opacity"
                  values="0.15;0.7;0.15"
                  dur={`${o.pulseDur}s`}
                  repeatCount="indefinite"
                  begin={`${o.pulseDelay}s`}
                />
                <animate
                  attributeName="r"
                  values={`${o.r * 0.7};${o.r * 1.4};${o.r * 0.7}`}
                  dur={`${o.pulseDur}s`}
                  repeatCount="indefinite"
                  begin={`${o.pulseDelay}s`}
                />
              </circle>
            </g>
          ))}

          {/* Layer eyebrow labels — bumped 9 → 11.5 so INGEST / ENCODE /
              REASON / INSIGHT read cleanly at hero display sizes. */}
          {LAYERS.map((layer, li) => (
            <text
              key={`ll-${li}`}
              x={layer.x}
              y={VIEW.h - 86}
              textAnchor="middle"
              fontSize="11.5"
              letterSpacing="2.2"
              fill="rgba(250,245,238,0.55)"
              fontFamily="var(--font-mono)"
            >
              {layer.label}
            </text>
          ))}

          {/* Curved connection edges */}
          {edges.map((e, i) => (
            <path
              key={`e-${i}`}
              ref={(el) => {
                edgeRefs.current[i] = el
              }}
              d={curvePath(e.a, e.b)}
              fill="none"
              stroke="url(#conn-grad)"
              strokeWidth={0.8}
              opacity={0.18}
              style={{ transition: 'opacity 250ms ease' }}
            />
          ))}

          {/* Highlighted paths + streaming packets.

              animateMotion adds a translate transform on top of a circle's
              cx/cy — so if cx/cy are non-zero, the packet ends up at
              (cx + motion_x, cy + motion_y), off the path. Circle stays
              at (0,0); wrapping <g> starts hidden and flips visible after
              a tick so the (0,0) frame before motion attaches never
              paints. Together this kills the corner glitch AND keeps the
              packet on the flow line. */}
          {highlights.map((h, i) => (
            <g key={`hl-${i}`}>
              <path
                d={curvePath(h.a, h.b)}
                fill="none"
                stroke={h.color}
                strokeWidth={1.6}
                strokeDasharray="5 9"
                strokeLinecap="round"
                opacity={0.65}
                className="flowing-line"
                style={{ animationDuration: '5s', animationDelay: `${h.delay}s` }}
              />
              <g visibility="hidden">
                <set
                  attributeName="visibility"
                  to="visible"
                  begin="0.08s"
                  fill="freeze"
                />
                <animateMotion
                  dur="4.2s"
                  repeatCount="indefinite"
                  begin={`-${h.delay}s`}
                  path={curvePath(h.a, h.b)}
                />
                {/* Trailing aura — soft filled disc breathing 4→13px
                    around the packet on a 1.4s loop while the outer
                    opacity envelope keeps it in sync with packet
                    visibility. Gives every dot a warm comet halo. */}
                <circle cx={0} cy={0} r={5} fill={h.color} opacity={0}>
                  <animate
                    attributeName="r"
                    values="4;13;4"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0; 0.28; 0.28; 0"
                    keyTimes="0; 0.15; 0.85; 1"
                    dur="4.2s"
                    begin={`-${h.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                {/* Bright core dot */}
                <circle cx={0} cy={0} r={3} fill={h.color} opacity={0}>
                  <animate
                    attributeName="opacity"
                    values="0; 0.95; 0.95; 0"
                    keyTimes="0; 0.15; 0.85; 1"
                    dur="4.2s"
                    begin={`-${h.delay}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            </g>
          ))}

          {/* Nodes — the network's heartbeat */}
          {nodes.map((row, li) => (
            <g key={`layer-${li}`}>
              {row.map((n, i) => {
                nodeRefs.current[li] = nodeRefs.current[li] || []
                return (
                  <g key={`n-${li}-${i}`}>
                    {/* radar ping.
                        DO NOT set an inline transform-origin in px here.
                        `.pulse-dot-ring` uses `transform-box: fill-box`
                        + `transform-origin: center`, which scales the
                        circle around its own centre. Adding
                        `transform-origin: <n.x>px <n.y>px` overrode the
                        keyword with an absolute pixel value that lives
                        OUTSIDE the fill-box, so every ping scaled toward
                        the SVG origin — reading as "circles drifting to
                        the corner." Kept animationDelay only. */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={8}
                      fill="none"
                      stroke={LAYER_COLORS[li]}
                      strokeWidth={0.8}
                      className="pulse-dot-ring"
                      style={{ animationDelay: `${(li * 3 + i) * 0.2}s` }}
                      opacity={0.35}
                    />
                    {/* core */}
                    <circle
                      ref={(el) => {
                        nodeRefs.current[li][i] = el
                      }}
                      cx={n.x}
                      cy={n.y}
                      r={8}
                      fill={LAYER_COLORS[li]}
                      opacity={0.85}
                      style={{ filter: `drop-shadow(0 0 6px ${LAYER_COLORS[li]}aa)` }}
                    />
                  </g>
                )
              })}
            </g>
          ))}

          {/* Annotation bounding boxes — cycle through with a draw-in
              animation, hold, then fade. */}
          {ANNOTATIONS.map((a, i) => (
            <g
              key={`anno-${i}`}
              ref={(el) => {
                annoRefs.current[i] = el
              }}
              opacity={0}
              style={{
                transition: 'opacity 400ms ease',
                willChange: 'opacity, transform',
              }}
            >
              {/* Corner brackets — hard ember accents */}
              {(() => {
                const arm = 12
                const { x, y, w, h, color } = a
                return (
                  <path
                    d={`M ${x} ${y + arm} L ${x} ${y} L ${x + arm} ${y}
                       M ${x + w - arm} ${y} L ${x + w} ${y} L ${x + w} ${y + arm}
                       M ${x + w} ${y + h - arm} L ${x + w} ${y + h} L ${x + w - arm} ${y + h}
                       M ${x + arm} ${y + h} L ${x} ${y + h} L ${x} ${y + h - arm}`}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    opacity={0.95}
                  />
                )
              })()}
              {/* Dashed border that draws in via stroke-dashoffset */}
              <rect
                data-anim="border"
                x={a.x}
                y={a.y}
                width={a.w}
                height={a.h}
                rx={4}
                fill="none"
                stroke={a.color}
                strokeWidth={1}
                strokeDasharray="200"
                strokeDashoffset={200}
                opacity={0.55}
                style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
              {/* Interior tint — very subtle warm fill */}
              <rect
                x={a.x}
                y={a.y}
                width={a.w}
                height={a.h}
                rx={4}
                fill={a.color}
                opacity={0.05}
              />

              {/* Label chip */}
              <g
                ref={(el) => {
                  chipRefs.current[i] = el
                }}
                style={{ transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <rect
                  x={a.x}
                  y={a.y - 22}
                  width={a.label.length * 6.6 + 44}
                  height={18}
                  rx={3}
                  fill={a.color}
                  opacity={0.16}
                />
                <rect
                  x={a.x}
                  y={a.y - 22}
                  width={3}
                  height={18}
                  fill={a.color}
                />
                <text
                  x={a.x + 10}
                  y={a.y - 9}
                  fontSize={9.5}
                  fill={a.color}
                  fontFamily="var(--font-mono)"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {a.label}
                </text>
                <text
                  x={a.x + a.label.length * 6.6 + 16}
                  y={a.y - 9}
                  fontSize={9.5}
                  fill="rgba(250,245,238,0.75)"
                  fontFamily="var(--font-mono)"
                >
                  {a.conf.toFixed(2)}
                </text>
                {/* Detail chip revealed when cursor is inside the bbox */}
                <g data-detail opacity={0} style={{ transition: 'opacity 240ms ease' }}>
                  <rect
                    x={a.x}
                    y={a.y + a.h + 8}
                    width={140}
                    height={22}
                    rx={3}
                    fill="rgba(20,15,11,0.85)"
                    stroke={a.color}
                    strokeWidth={0.6}
                    strokeOpacity={0.6}
                  />
                  <text
                    x={a.x + 8}
                    y={a.y + a.h + 22.5}
                    fontSize={9}
                    fill="rgba(250,245,238,0.85)"
                    fontFamily="var(--font-mono)"
                    style={{ letterSpacing: '0.04em' }}
                  >
                    class · {a.accent} · verified
                  </text>
                </g>
              </g>
            </g>
          ))}

          {/* Top-left metadata chip — widened + text bumped 9.5 → 11 so
              the "annotation.pipeline / live" label is readable. */}
          <g>
            <rect
              x={28}
              y={30}
              width={228}
              height={26}
              rx={4}
              fill="rgba(20,15,11,0.72)"
              stroke="rgba(255,143,92,0.45)"
              strokeWidth={0.7}
            />
            <circle cx={42} cy={43} r={3.4} fill="#FF6B35">
              <animate attributeName="opacity" values="1;0.35;1" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <text
              x={56}
              y={47}
              fontSize={11}
              fill="rgba(250,245,238,0.85)"
              fontFamily="var(--font-mono)"
              style={{ letterSpacing: '0.06em' }}
            >
              annotation.pipeline / live
            </text>
          </g>

          {/* Top-right progress ring — "annotation N%" */}
          <g>
            <circle
              cx={VIEW.w - 82}
              cy={62}
              r={24}
              fill="none"
              stroke="rgba(255,240,220,0.10)"
              strokeWidth={2}
            />
            <path
              ref={progressArcRef}
              d=""
              fill="none"
              stroke="#FF6B35"
              strokeWidth={2}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,107,53,0.6))' }}
            />
            <text
              ref={progressLabelRef}
              x={VIEW.w - 82}
              y={66}
              textAnchor="middle"
              fontSize={13}
              fill="rgba(250,245,238,0.95)"
              fontFamily="var(--font-display)"
              style={{ letterSpacing: '-0.02em', fontWeight: 500 }}
            >
              87%
            </text>
            <text
              x={VIEW.w - 82}
              y={104}
              textAnchor="middle"
              fontSize={10}
              fill="rgba(250,245,238,0.55)"
              fontFamily="var(--font-mono)"
              style={{ letterSpacing: '0.14em' }}
            >
              PROGRESS
            </text>
          </g>

          {/* Bottom metrics strip */}
          <g>
            {[
              { x: 60, label: 'LATENCY', value: '12ms', dot: '#E9C46A' },
              { x: 250, label: 'THROUGHPUT', value: '2.4M/s', dot: '#F4A261' },
              { x: 460, label: 'ACCURACY', value: '99.2%', dot: '#FF6B35' },
            ].map((m) => (
              <g key={m.label}>
                <circle
                  cx={m.x}
                  cy={VIEW.h - 44}
                  r={2.5}
                  fill={m.dot}
                  style={{ filter: `drop-shadow(0 0 4px ${m.dot})` }}
                />
                <text
                  x={m.x + 14}
                  y={VIEW.h - 47}
                  fontSize={16}
                  fill="rgba(250,245,238,0.95)"
                  fontFamily="var(--font-display)"
                  style={{ letterSpacing: '-0.02em', fontWeight: 500 }}
                >
                  {m.value}
                </text>
                <text
                  x={m.x + 14}
                  y={VIEW.h - 32}
                  fontSize={10}
                  fill="rgba(250,245,238,0.55)"
                  fontFamily="var(--font-mono)"
                  style={{ letterSpacing: '0.16em' }}
                >
                  {m.label}
                </text>
              </g>
            ))}
          </g>

          {/* Ember corner brackets — frame the whole working area
              without a rectangular card */}
          {(() => {
            const arm = 22
            const inset = 10
            const brackets = [
              { x: inset, y: inset, sx: 1, sy: 1, color: '#FF6B35' },
              { x: VIEW.w - inset, y: inset, sx: -1, sy: 1, color: '#E9C46A' },
              { x: inset, y: VIEW.h - inset, sx: 1, sy: -1, color: '#F4A261' },
              { x: VIEW.w - inset, y: VIEW.h - inset, sx: -1, sy: -1, color: '#FF8F5C' },
            ]
            return brackets.map((c, i) => (
              <path
                key={`br-${i}`}
                d={`M ${c.x} ${c.y + arm * c.sy} L ${c.x} ${c.y} L ${c.x + arm * c.sx} ${c.y}`}
                fill="none"
                stroke={c.color}
                strokeWidth={1.6}
                strokeLinecap="round"
                opacity={0.85}
              />
            ))
          })()}
        </g>
      </svg>
      </div>
    </div>
  )
}
