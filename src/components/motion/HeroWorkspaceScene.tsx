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
 *     connections between them, and highlighted paths carrying
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
 *
 * Performance notes (read before "optimizing" further):
 *   • The rAF loop pauses itself — and the SVG's own SMIL timeline —
 *     via IntersectionObserver whenever the scene scrolls out of view.
 *   • The 98-edge cursor-distance pass only runs while the pointer is
 *     actually over the scene; at rest edges sit at a constant opacity
 *     and are written once on the transition back to resting, not
 *     every frame.
 *   • Only the currently-active annotation box is touched per frame;
 *     the other two are static (opacity 0) and get one write on the
 *     frame they become inactive, not 60/sec forever.
 *   • Drift orbs and highlight "packets" are pure decoration driven by
 *     raw SVG SMIL (<animate>/<animateMotion>), which prefers-reduced-
 *     motion's CSS media query cannot touch — they're explicitly
 *     skipped when the OS setting is on. Orbs are additionally skipped
 *     on devices with no real hover (touch), since the swell/brighten
 *     interactivity they accent is unreachable there anyway.
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

// Progress ring geometry + a pure function so the arc can be computed
// once for the static/paused state instead of only ever existing as a
// side effect of the per-frame tick loop.
const ARC_CX = VIEW.w - 82
const ARC_CY = 62
const ARC_R = 24

function arcPath(fraction: number, cx: number, cy: number, r: number) {
  const stopAngle = 2 * Math.PI * fraction
  const startAng = -Math.PI / 2
  const endAng = startAng + stopAngle
  const sx = cx + r * Math.cos(startAng)
  const sy = cy + r * Math.sin(startAng)
  const ex = cx + r * Math.cos(endAng)
  const ey = cy + r * Math.sin(endAng)
  const large = stopAngle > Math.PI ? 1 : 0
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`
}

const STATIC_ARC_D = arcPath(0.87, ARC_CX, ARC_CY, ARC_R)

// CSS mask replicating the old SVG <mask>+radialGradient vignette —
// same visual fade, but composited by the browser's mask pipeline
// instead of forcing an SVG mask render pass over ~200 animated
// children every frame.
const WS_FADE_MASK =
  'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.94) 70%, rgba(255,255,255,0.35) 100%)'

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

  // Highlighted paths — two per layer transition (was three-to-four).
  // Still spans the whole pipeline so every stage stays visibly alive;
  // just less dense. Each packet drives one <animateMotion> plus two
  // pulsing circles, so this trim alone removes ~20 concurrently
  // looping SMIL animations.
  const highlights = useMemo(
    () => [
      { a: nodes[0][0], b: nodes[1][2], color: LAYER_COLORS[1], delay: 0 },
      { a: nodes[0][1], b: nodes[1][4], color: LAYER_COLORS[0], delay: 2.2 },
      { a: nodes[1][2], b: nodes[2][0], color: LAYER_COLORS[2], delay: 1.6 },
      { a: nodes[1][6], b: nodes[2][3], color: LAYER_COLORS[2], delay: 0.8 },
      { a: nodes[2][1], b: nodes[3][0], color: LAYER_COLORS[3], delay: 1.2 },
      { a: nodes[2][3], b: nodes[3][1], color: LAYER_COLORS[3], delay: 2.6 },
    ],
    [nodes],
  )

  // Drift orbs — soft ambient particles that actually drift instead of
  // pulsing in place. Trimmed from 14 to 8: each orb drives three SMIL
  // animations (opacity, radius, motion path), so this halves that
  // count on its own. Only rendered on hover-capable devices — see
  // `pointerFine` below.
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
    for (let i = 0; i < 8; i++) {
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

  // Defaults to true (full richness) for SSR and the very first paint
  // — matching the existing `visible` fade-in pattern below — then
  // corrects after mount. Gates both the pointermove listener and the
  // drift orbs: the interactivity they accent doesn't exist on touch.
  const [pointerFine, setPointerFine] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setPointerFine(mq.matches)
    const onChange = () => setPointerFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // useReducedMotion() resolves synchronously from the real OS setting
  // on the client's very first render — fine for framer-motion's own
  // `initial={...}` values (same element, different animation target),
  // but our JSX below uses it to decide whether an element renders AT
  // ALL. Doing that with the raw hook value would hydrate mismatched
  // against the server (which always renders with shouldReduce=false).
  // Deferring the "reduced" branch to after mount keeps the first
  // render — server and client alike — identical, same as `pointerFine`.
  const [reducedMotionApplied, setReducedMotionApplied] = useState(false)
  useEffect(() => {
    setReducedMotionApplied(!!shouldReduce)
  }, [shouldReduce])

  const svgRef = useRef<SVGSVGElement>(null)
  const nodeRefs = useRef<(SVGCircleElement | null)[][]>([])
  const edgeRefs = useRef<(SVGPathElement | null)[]>([])
  const annoRefs = useRef<(SVGGElement | null)[]>([])
  const annoBorderRefs = useRef<(SVGRectElement | null)[]>([])
  const chipRefs = useRef<(SVGGElement | null)[]>([])
  const chipDetailRefs = useRef<(SVGGElement | null)[]>([])
  const progressArcRef = useRef<SVGPathElement | null>(null)
  const progressLabelRef = useRef<SVGTextElement | null>(null)
  const [visible, setVisible] = useState(false)

  const cursor = useRef<{ x: number; y: number; active: boolean }>({
    x: VIEW.w * 0.5,
    y: VIEW.h * 0.5,
    active: false,
  })
  const rectRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Pointer tracking — the bounding rect is cached and refreshed only
  // on resize/scroll instead of on every pointermove (which was
  // forcing a synchronous layout read on every mouse movement). Skips
  // entirely on touch devices, where the effect it drives never shows.
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
      const rect = rectRef.current
      if (!rect) return
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
      window.removeEventListener('resize', refreshRect)
      window.removeEventListener('scroll', refreshRect)
    }
  }, [shouldReduce, pointerFine])

  // ─── Animation loop ─────────────────────────────────────────
  // Paused (both the JS loop and the SVG's own SMIL timeline) whenever
  // the scene scrolls out of view, via IntersectionObserver.
  useEffect(() => {
    if (shouldReduce) return
    const svg = svgRef.current
    if (!svg) return

    let raf = 0
    let running = false
    const start = performance.now()
    let edgesWereActive = false
    let prevActiveAnno = -1

    const tick = (now: number) => {
      const t = (now - start) / 1000

      // Nodes — idle pulse always runs (it's the "alive" breathing
      // effect); the cursor-swell distance check only fires when the
      // pointer is actually over the scene.
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

      // Edges — the ~98-edge distance check only runs while the cursor
      // is actually over the scene. At rest they sit at a constant
      // opacity, written once on the transition back to resting rather
      // than recomputed unconditionally on every frame.
      if (cursor.current.active) {
        for (let i = 0; i < edges.length; i++) {
          const el = edgeRefs.current[i]
          if (!el) continue
          const e = edges[i]
          const da = Math.hypot(cursor.current.x - e.a.x, cursor.current.y - e.a.y)
          const db = Math.hypot(cursor.current.x - e.b.x, cursor.current.y - e.b.y)
          const closer = Math.min(da, db)
          const pull = Math.max(0, 1 - closer / 200)
          el.style.opacity = String(0.18 + pull * 0.5)
        }
        edgesWereActive = true
      } else if (edgesWereActive) {
        for (let i = 0; i < edges.length; i++) {
          const el = edgeRefs.current[i]
          if (el) el.style.opacity = '0.18'
        }
        edgesWereActive = false
      }

      // Annotation loop — only the currently-active bbox is touched
      // per frame. The other two sit fully transparent and get a
      // single write on the frame they become inactive, not 60/sec.
      const cycle = ANNOTATIONS.length * ANNO_SLOT
      const localT = t % cycle
      const activeIdx = Math.floor(localT / ANNO_SLOT)
      const withinSlot = localT - activeIdx * ANNO_SLOT

      if (activeIdx !== prevActiveAnno && prevActiveAnno !== -1) {
        const prevEl = annoRefs.current[prevActiveAnno]
        const prevChip = chipRefs.current[prevActiveAnno]
        const prevDetail = chipDetailRefs.current[prevActiveAnno]
        if (prevEl) prevEl.style.opacity = '0'
        if (prevChip) prevChip.style.transform = 'translate(0px, 0px)'
        if (prevDetail) prevDetail.style.opacity = '0'
      }
      prevActiveAnno = activeIdx

      const activeEl = annoRefs.current[activeIdx]
      if (activeEl) {
        let alpha = 0
        let dash = 0
        let scale = 1
        if (withinSlot < ANNO_DRAW) {
          const p = withinSlot / ANNO_DRAW
          alpha = p
          dash = 200 * (1 - p)
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
        activeEl.style.opacity = String(alpha)
        const a = ANNOTATIONS[activeIdx]
        const cx = a.x + a.w / 2
        const cy = a.y + a.h / 2
        activeEl.setAttribute(
          'transform',
          `translate(${cx - cx * scale} ${cy - cy * scale}) scale(${scale})`,
        )
        const border = annoBorderRefs.current[activeIdx]
        if (border) border.style.strokeDashoffset = String(dash)

        const chip = chipRefs.current[activeIdx]
        if (chip) {
          let expand = 0
          if (cursor.current.active) {
            const inside =
              cursor.current.x >= a.x &&
              cursor.current.x <= a.x + a.w &&
              cursor.current.y >= a.y &&
              cursor.current.y <= a.y + a.h
            expand = inside ? 1 : 0
          }
          chip.style.transform = `translate(0px, ${expand * -3}px)`
          const detail = chipDetailRefs.current[activeIdx]
          if (detail) detail.style.opacity = String(expand)
        }
      }

      // Progress ring — updated at ~15fps instead of every frame. The
      // "bob" it draws shifts by fractions of a percent; redrawing the
      // arc geometry 60x/sec bought nothing visible.
      if (Math.floor(t * 15) !== Math.floor((t - 1 / 60) * 15)) {
        if (progressArcRef.current) {
          const bob = 0.87 + Math.sin(t * 1.1) * 0.008
          progressArcRef.current.setAttribute('d', arcPath(bob, ARC_CX, ARC_CY, ARC_R))
          if (progressLabelRef.current) {
            progressLabelRef.current.textContent = `${Math.round(bob * 100)}%`
          }
        }
      }

      if (running) raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!running) {
            running = true
            if ('unpauseAnimations' in svg) svg.unpauseAnimations()
            raf = requestAnimationFrame(tick)
          }
        } else if (running) {
          running = false
          if ('pauseAnimations' in svg) svg.pauseAnimations()
          cancelAnimationFrame(raf)
        }
      },
      { rootMargin: '150px 0px' },
    )
    io.observe(svg)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [shouldReduce, nodes, edges])

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
        style={{
          pointerEvents: 'auto',
          display: 'block',
          maskImage: WS_FADE_MASK,
          WebkitMaskImage: WS_FADE_MASK,
        }}
      >
        <defs>
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

        <g>
          {/* Grid backdrop */}
          <rect width={VIEW.w} height={VIEW.h} fill="url(#ws-grid)" />

          {/* Drift orbs — ambient only, skipped on touch devices (no
              hover to accent) and rendered static under reduced motion. */}
          {pointerFine &&
            DRIFT_ORBS.map((o, i) =>
              reducedMotionApplied ? (
                <circle key={`orb-${i}`} cx={o.cx} cy={o.cy} r={o.r} fill={o.color} opacity={0.35} />
              ) : (
                <g key={`orb-${i}`} visibility="hidden">
                  <set attributeName="visibility" to="visible" begin="0.08s" fill="freeze" />
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
              ),
            )}

          {/* Layer eyebrow labels */}
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

          {/* Highlighted paths + streaming packets. The dashed line
              itself is a CSS animation (.flowing-line) already gated by
              the site-wide prefers-reduced-motion rule; only the raw
              SMIL packet/halo circles need an explicit shouldReduce
              check here. */}
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
              {!reducedMotionApplied && (
                <g visibility="hidden">
                  <set attributeName="visibility" to="visible" begin="0.08s" fill="freeze" />
                  <animateMotion
                    dur="4.2s"
                    repeatCount="indefinite"
                    begin={`-${h.delay}s`}
                    path={curvePath(h.a, h.b)}
                  />
                  <circle cx={0} cy={0} r={5} fill={h.color} opacity={0}>
                    <animate attributeName="r" values="4;13;4" dur="1.4s" repeatCount="indefinite" />
                    <animate
                      attributeName="opacity"
                      values="0; 0.28; 0.28; 0"
                      keyTimes="0; 0.15; 0.85; 1"
                      dur="4.2s"
                      begin={`-${h.delay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
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
              )}
            </g>
          ))}

          {/* Nodes — the network's heartbeat */}
          {nodes.map((row, li) => (
            <g key={`layer-${li}`}>
              {row.map((n, i) => {
                nodeRefs.current[li] = nodeRefs.current[li] || []
                return (
                  <g key={`n-${li}-${i}`}>
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
                ref={(el) => {
                  annoBorderRefs.current[i] = el
                }}
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
                <g
                  ref={(el) => {
                    chipDetailRefs.current[i] = el
                  }}
                  opacity={0}
                  style={{ transition: 'opacity 240ms ease' }}
                >
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

          {/* Top-left metadata chip */}
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

          {/* Top-right progress ring — "annotation N%". Seeded with
              the static arc so it renders correctly even before the
              tick loop's first pass (or permanently, under reduced
              motion, when the loop never runs at all). */}
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
              d={STATIC_ARC_D}
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
