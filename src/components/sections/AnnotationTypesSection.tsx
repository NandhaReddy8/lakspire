'use client'
import type { ComponentType } from 'react'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { SectionLabel } from '@/components/blocks/SectionLabel'

/**
 * AI Annotation Types — the "what we actually label" catalogue on the
 * Services page. Nine landscape cards (animation left ≈ 3/7, text
 * right ≈ 4/7). Each animation reads the annotation type at a glance
 * so a scanning visitor understands the deliverable without reading.
 *
 * Animations are pure SVG + CSS keyframes (no motion library) and
 * loop continuously — they must convey the label operation, not just
 * decorate. Palette stays inside the site's ember/gold system.
 */

// ─────────────────────────────────────────────────────────────
//  Animation cells — one per annotation type
// ─────────────────────────────────────────────────────────────

function BBoxAnim() {
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      {/* photo-plate background */}
      <defs>
        <linearGradient id="bbox-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,143,92,0.10)" />
          <stop offset="1" stopColor="rgba(255,107,53,0.02)" />
        </linearGradient>
      </defs>
      <rect x="14" y="14" width="152" height="152" rx="10" fill="url(#bbox-sky)" />
      {/* subject silhouette — abstract person */}
      <g opacity="0.85" fill="currentColor" transform="translate(56 40)">
        <circle cx="34" cy="20" r="12" opacity="0.55" />
        <path d="M8 92 c 0 -30 12 -46 26 -46 c 14 0 26 16 26 46 z" opacity="0.55" />
      </g>
      {/* animated bounding box */}
      <g className="bbox-box">
        <rect x="46" y="30" width="88" height="118" rx="2" fill="none"
          stroke="#FF8F5C" strokeWidth="1.6" strokeDasharray="412" />
      </g>
      {/* corner brackets */}
      {[
        [46, 30, 1, 1],
        [134, 30, -1, 1],
        [46, 148, 1, -1],
        [134, 148, -1, -1],
      ].map(([x, y, sx, sy], i) => (
        <g key={i} className="bbox-corner" style={{ animationDelay: `${(0.25 + i * 0.08).toFixed(2)}s` }}>
          <path d={`M${x} ${y + 10 * sy} L${x} ${y} L${x + 10 * sx} ${y}`}
            fill="none" stroke="#FFB98A" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ))}
      {/* class label chip */}
      <g className="bbox-label" transform="translate(46 18)">
        <rect x="0" y="0" width="66" height="14" rx="3" fill="#FF6B35" />
        <text x="6" y="10" fontSize="8" fontFamily="var(--font-mono)" fill="#0A0805" fontWeight="600">
          person 0.94
        </text>
      </g>
      {/* target crosshair — appears then fades before box lands */}
      <g className="bbox-target">
        <circle cx="90" cy="90" r="18" fill="none" stroke="rgba(255,175,120,0.7)" strokeWidth="0.8" />
        <path d="M90 74 v6 M90 100 v6 M74 90 h6 M100 90 h6" stroke="rgba(255,175,120,0.8)" strokeWidth="0.8" />
      </g>
    </svg>
  )
}

function PolygonAnim() {
  const pts = [
    [40, 92], [58, 60], [92, 44], [124, 52], [140, 82],
    [138, 118], [110, 140], [78, 138], [50, 122],
  ]
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L ') + ' Z'
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      <defs>
        <linearGradient id="poly-fill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,107,53,0.55)" />
          <stop offset="1" stopColor="rgba(233,196,106,0.35)" />
        </linearGradient>
      </defs>
      {/* background subject silhouette */}
      <path d="M32 96 c 4 -32 30 -52 62 -52 c 34 0 56 22 56 54 c 0 34 -30 46 -60 46 c -30 0 -62 -14 -58 -48 z"
        fill="rgba(246,235,218,0.06)" stroke="rgba(246,235,218,0.18)" strokeWidth="0.8" />
      {/* polygon fill fades in first */}
      <path d={d} fill="url(#poly-fill)" className="poly-fill" />
      {/* polygon outline draws */}
      <path d={d} fill="none" stroke="#FF8F5C" strokeWidth="1.6" strokeLinejoin="round"
        strokeDasharray="640" className="poly-outline" />
      {/* vertex handles pop one after another */}
      {pts.map(([x, y], i) => (
        <g key={i} className="poly-vertex" style={{ animationDelay: `${(0.15 + i * 0.09).toFixed(2)}s` }}>
          <rect x={x - 3.2} y={y - 3.2} width="6.4" height="6.4" rx="1" fill="#0A0805"
            stroke="#E9C46A" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  )
}

function PoseAnim() {
  // 13-point skeleton (COCO-lite)
  const kp: Record<string, [number, number]> = {
    head: [90, 34],
    ls: [70, 62], rs: [110, 62],
    le: [58, 92], re: [122, 92],
    lw: [50, 122], rw: [130, 122],
    lh: [78, 104], rh: [102, 104],
    lk: [72, 134], rk: [108, 134],
    la: [68, 160], ra: [112, 160],
  }
  const bones: [keyof typeof kp, keyof typeof kp][] = [
    ['head', 'ls'], ['head', 'rs'], ['ls', 'rs'],
    ['ls', 'le'], ['le', 'lw'], ['rs', 're'], ['re', 'rw'],
    ['ls', 'lh'], ['rs', 'rh'], ['lh', 'rh'],
    ['lh', 'lk'], ['lk', 'la'], ['rh', 'rk'], ['rk', 'ra'],
  ]
  const order: (keyof typeof kp)[] = ['head', 'ls', 'rs', 'le', 're', 'lw', 'rw', 'lh', 'rh', 'lk', 'rk', 'la', 'ra']
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      {/* faint body silhouette */}
      <path d="M90 22 c 8 0 14 6 14 14 c 0 8 -6 14 -14 14 c -8 0 -14 -6 -14 -14 c 0 -8 6 -14 14 -14 z
               M60 60 h60 v46 h-16 v56 h-12 v-40 h-4 v40 h-12 v-56 h-16 z"
        fill="rgba(246,235,218,0.05)" />
      {/* bones — draw in with dash trick */}
      {bones.map(([a, b], i) => {
        const [x1, y1] = kp[a]
        const [x2, y2] = kp[b]
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#FF8F5C" strokeWidth="1.6" strokeLinecap="round"
            strokeDasharray="80" className="pose-bone"
            style={{ animationDelay: `${(0.9 + i * 0.06).toFixed(2)}s` }} />
        )
      })}
      {/* keypoints — pop in one after another */}
      {order.map((k, i) => {
        const [x, y] = kp[k]
        return (
          <g key={k} className="pose-kp" style={{ animationDelay: `${(0.15 + i * 0.06).toFixed(2)}s` }}>
            <circle cx={x} cy={y} r="4" fill="#0A0805" stroke="#E9C46A" strokeWidth="1.3" />
            <circle cx={x} cy={y} r="1.3" fill="#E9C46A" />
          </g>
        )
      })}
    </svg>
  )
}

function CuboidAnim() {
  // 3D wireframe cuboid — front + back rects + connecting edges
  const F = { x: 40, y: 60, w: 88, h: 88 }
  const dx = 26, dy = -18
  const front = [
    [F.x, F.y], [F.x + F.w, F.y], [F.x + F.w, F.y + F.h], [F.x, F.y + F.h],
  ]
  const back = front.map(([x, y]) => [x + dx, y + dy])
  return (
    <svg viewBox="0 0 180 180" className="annot-svg cuboid-svg" aria-hidden>
      {/* ground plane grid — 3D floor feel */}
      <g opacity="0.35" stroke="rgba(246,235,218,0.18)" strokeWidth="0.6">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={20 + i * 12} y1={158} x2={80 + i * 12} y2={110} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line key={`v${i}`} x1={20 + i * 30} y1={158} x2={40 + i * 30} y2={110} />
        ))}
      </g>
      {/* Rotation happens on the whole cuboid group */}
      <g className="cuboid-rot" style={{ transformOrigin: '90px 104px' }}>
        {/* back face */}
        <polygon
          points={back.map((p) => p.join(',')).join(' ')}
          fill="rgba(255,143,92,0.05)"
          stroke="#E9C46A"
          strokeWidth="1.2"
          opacity="0.8"
        />
        {/* connecting edges */}
        {front.map(([fx, fy], i) => (
          <line key={i} x1={fx} y1={fy} x2={back[i][0]} y2={back[i][1]}
            stroke="#E9C46A" strokeWidth="1.2" opacity="0.75" />
        ))}
        {/* front face */}
        <polygon
          points={front.map((p) => p.join(',')).join(' ')}
          fill="rgba(255,107,53,0.16)"
          stroke="#FF8F5C"
          strokeWidth="1.6"
        />
        {/* axis chips */}
        <g fontFamily="var(--font-mono)" fontSize="7" fill="#FFB98A" opacity="0.9">
          <text x={F.x - 4} y={F.y - 4}>W</text>
          <text x={F.x + F.w + 2} y={F.y + F.h + 10}>H</text>
          <text x={F.x + F.w + dx + 4} y={F.y + dy + 4}>D</text>
        </g>
      </g>
    </svg>
  )
}

function LidarAnim() {
  // Generate a deterministic scatter of 3D-ish points. All computed
  // coords are rounded to a fixed precision so server-rendered and
  // client-rendered attribute strings match (avoids hydration diffs
  // from floating-point drift between Node and V8).
  const round = (n: number, p = 3) => Math.round(n * 10 ** p) / 10 ** p
  const points: [number, number, number][] = []
  for (let i = 0; i < 90; i++) {
    const t = i / 90
    const r = 20 + 60 * Math.abs(Math.sin(t * 9.7))
    const theta = t * Math.PI * 4.3
    const x = round(90 + Math.cos(theta) * r)
    const y = round(96 + Math.sin(theta) * r * 0.55)
    const depth = round(0.35 + 0.65 * Math.abs(Math.cos(t * 5)))
    points.push([x, y, depth])
  }
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      {/* concentric radar rings */}
      {[24, 46, 68].map((r, i) => (
        <ellipse key={i} cx="90" cy="96" rx={r} ry={r * 0.55}
          fill="none" stroke="rgba(246,235,218,0.16)" strokeWidth="0.6"
          strokeDasharray="2 3" />
      ))}
      {/* points */}
      {points.map(([x, y, d], i) => (
        <circle key={i} cx={x} cy={y} r={round(0.9 + d * 1.3)}
          fill={d > 0.7 ? '#FF8F5C' : d > 0.45 ? '#E9C46A' : 'rgba(246,235,218,0.55)'}
          className="lidar-pt"
          style={{ animationDelay: `${((i % 20) * 0.09).toFixed(2)}s`, transformOrigin: `${x}px ${y}px` }} />
      ))}
      {/* sweep beam */}
      <g className="lidar-sweep" style={{ transformOrigin: '90px 96px' }}>
        <path d="M90 96 L170 96 A80 44 0 0 0 90 52 Z" fill="url(#lidar-beam)" />
      </g>
      <defs>
        <linearGradient id="lidar-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="rgba(255,143,92,0.42)" />
          <stop offset="1" stopColor="rgba(255,143,92,0)" />
        </linearGradient>
      </defs>
      {/* origin sensor dot */}
      <circle cx="90" cy="96" r="3" fill="#FF6B35" />
    </svg>
  )
}

function VideoTrackAnim() {
  // three boxes traveling with trails
  const tracks = [
    { id: '#01', y: 44, dur: '5.4s', delay: '0s', color: '#FF8F5C' },
    { id: '#02', y: 82, dur: '6.2s', delay: '-1.8s', color: '#E9C46A' },
    { id: '#03', y: 122, dur: '4.8s', delay: '-3.1s', color: '#F4A261' },
  ]
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      {/* frame */}
      <rect x="14" y="14" width="152" height="152" rx="8" fill="rgba(255,143,92,0.03)"
        stroke="rgba(246,235,218,0.12)" strokeWidth="0.8" strokeDasharray="3 4" />
      {/* film sprocket ticks */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={22 + i * 15} y={4} width="6" height="4" rx="1"
          fill="rgba(246,235,218,0.16)" />
      ))}
      {tracks.map((t, i) => (
        <g key={i} className="track-mover" style={{
          animationDuration: t.dur,
          animationDelay: t.delay,
        }}>
          {/* trail — three ghost boxes with decreasing opacity */}
          {[0.5, 0.25, 0.12].map((op, k) => (
            <rect key={k} x={-24 - k * 18} y={t.y} width="34" height="26" rx="2"
              fill="none" stroke={t.color} strokeWidth="1" opacity={op}
              strokeDasharray="2 2" />
          ))}
          {/* live box */}
          <rect x="0" y={t.y} width="34" height="26" rx="2" fill="none"
            stroke={t.color} strokeWidth="1.6" />
          <rect x="0" y={t.y - 10} width="20" height="9" rx="1.5" fill={t.color} />
          <text x="2" y={t.y - 3} fontSize="6.6" fontFamily="var(--font-mono)"
            fill="#0A0805" fontWeight="700">{t.id}</text>
        </g>
      ))}
    </svg>
  )
}

function NerAnim() {
  // One prominent sentence with entity spans that light up in sequence.
  // Tokens are laid out explicitly so highlights + label chips land
  // exactly under each word regardless of proportional font width.
  type Tok = { word: string; label?: string; color?: string }
  const tokens: Tok[] = [
    { word: 'Sam', label: 'PER', color: '#FF8F5C' },
    { word: 'works' },
    { word: 'at' },
    { word: 'Google', label: 'ORG', color: '#E9C46A' },
    { word: 'in' },
    { word: 'Dublin', label: 'LOC', color: '#F4A261' },
  ]
  // Approximate glyph width — using tabular-ish mono spacing so
  // highlight rectangles align. 8.6px per char at fontSize 14.
  const ch = 8.6
  const gap = 6
  const fontSize = 14
  const y = 78
  const rowStart = 12
  // Position each token
  let cursor = rowStart
  const placed = tokens.map((t) => {
    const w = t.word.length * ch
    const x = cursor
    cursor += w + gap
    return { ...t, x, w }
  })
  let entityIdx = 0
  return (
    <svg viewBox="0 0 280 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* faint horizontal guides */}
      <line x1="10" y1={y + 8} x2="268" y2={y + 8} stroke="rgba(246,235,218,0.10)" strokeWidth="0.6" />
      {placed.map((t, i) => (
        <g key={i}>
          {t.label && (
            <g className="ner-span" style={{ animationDelay: `${(0.4 + entityIdx++ * 0.9).toFixed(2)}s` }}>
              {/* highlight fill */}
              <rect x={t.x - 3} y={y - fontSize + 2} width={t.w + 6} height={fontSize + 4}
                rx="3" fill={t.color} opacity="0.24" />
              {/* underline */}
              <rect x={t.x - 3} y={y + 4} width={t.w + 6} height="2" fill={t.color} />
              {/* label chip below */}
              <g transform={`translate(${t.x + t.w / 2 - 14} ${y + 12})`}>
                <rect width="28" height="12" rx="2" fill={t.color} />
                <text x="14" y="8.6" fontSize="7.4" fontFamily="var(--font-mono)"
                  fill="#0A0805" fontWeight="700" textAnchor="middle">
                  {t.label}
                </text>
              </g>
            </g>
          )}
          <text x={t.x} y={y} fontFamily="var(--font-mono)" fontSize={fontSize}
            fill="#F6EBDA" fontWeight={t.label ? 600 : 500}>
            {t.word}
          </text>
        </g>
      ))}
      {/* period */}
      <text x={cursor - gap + 2} y={y} fontFamily="var(--font-mono)" fontSize={fontSize}
        fill="#F6EBDA">.</text>
      {/* tag legend along top */}
      <g fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.4"
        fill="rgba(246,235,218,0.55)">
        <text x="12" y="26">TAGS · PER · ORG · LOC</text>
      </g>
    </svg>
  )
}

function AudioAnim() {
  // Waveform bars + moving playhead + caption
  const bars = 42
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars
    return (
      0.4 +
      0.28 * Math.sin(t * Math.PI * 3) +
      0.18 * Math.sin(t * Math.PI * 7) +
      0.14 * Math.sin(t * Math.PI * 13)
    )
  })
  const totalW = 152
  const barGap = 1.6
  const barW = (totalW - barGap * (bars - 1)) / bars
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      {/* waveform */}
      <g transform="translate(14 46)">
        {heights.map((h, i) => {
          const x = i * (barW + barGap)
          const bh = Math.max(3, Math.abs(h) * 46)
          const y = (46 - bh) / 2
          return (
            <rect key={i} x={x} y={y} width={barW} height={bh} rx={barW / 2}
              fill="#FF8F5C" opacity={0.55 + Math.abs(h) * 0.4} />
          )
        })}
        {/* playhead */}
        <g className="audio-play">
          <line x1="0" y1="-6" x2="0" y2="52" stroke="#E9C46A" strokeWidth="1.4" />
          <circle cx="0" cy="-6" r="2.4" fill="#E9C46A" />
        </g>
      </g>
      {/* caption box */}
      <g transform="translate(14 118)">
        <rect width="152" height="44" rx="6" fill="rgba(20,15,11,0.6)"
          stroke="rgba(246,235,218,0.18)" strokeWidth="0.8" />
        {/* transcript lines cycling */}
        <g className="audio-cap-1">
          <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="8"
            fill="rgba(246,235,218,0.9)">00:00 → 00:03</text>
          <text x="10" y="34" fontFamily="var(--font-body)" fontSize="10"
            fill="#FFB98A">&quot;we ship data models&quot;</text>
        </g>
        <g className="audio-cap-2">
          <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="8"
            fill="rgba(246,235,218,0.9)">00:03 → 00:06</text>
          <text x="10" y="34" fontFamily="var(--font-body)" fontSize="10"
            fill="#FFB98A">&quot;every week, on schedule&quot;</text>
        </g>
      </g>
    </svg>
  )
}

function OcrAnim() {
  // A scanned document with detected text regions highlighted, and
  // extracted key-value fields sliding out to the right. The doc is
  // sized so the extracted fields sit clear of it with breathing room.
  const lines = [
    { y: 32, w: 74 },
    { y: 46, w: 62 },
    { y: 64, w: 78 },
    { y: 78, w: 52 },
    { y: 96, w: 70 },
    { y: 110, w: 60 },
    { y: 128, w: 80 },
  ]
  const fields = [
    { label: 'INVOICE #', value: 'INV-2091' },
    { label: 'DATE', value: '2026-04-12' },
    { label: 'TOTAL', value: '₹ 18,420' },
  ]
  return (
    <svg viewBox="0 0 260 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* document paper */}
      <g transform="translate(10 12)">
        <path d="M0 4 h80 l14 14 v138 h-94 z" fill="rgba(246,235,218,0.06)"
          stroke="rgba(246,235,218,0.28)" strokeWidth="0.9" />
        <path d="M80 4 v14 h14" fill="none" stroke="rgba(246,235,218,0.4)" strokeWidth="0.9" />
        {/* header stripe */}
        <rect x="8" y="14" width="54" height="6" rx="1" fill="rgba(255,143,92,0.35)" />
        {/* body text lines */}
        {lines.map((ln, i) => (
          <g key={i}>
            <rect x="8" y={ln.y} width={ln.w} height="4" rx="1"
              fill="rgba(246,235,218,0.35)" />
            {/* OCR detection box */}
            <rect className="ocr-box" style={{ animationDelay: `${(0.2 + i * 0.16).toFixed(2)}s` }}
              x="6" y={ln.y - 2} width={ln.w + 4} height="8" rx="1.5"
              fill="none" stroke="#FF8F5C" strokeWidth="1" strokeDasharray="3 2" />
          </g>
        ))}
        {/* scan sweep */}
        <rect className="ocr-scan" x="0" y="10" width="94" height="10"
          fill="url(#ocr-scan-g)" />
        <defs>
          <linearGradient id="ocr-scan-g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(255,143,92,0)" />
            <stop offset="0.5" stopColor="rgba(255,143,92,0.4)" />
            <stop offset="1" stopColor="rgba(255,143,92,0)" />
          </linearGradient>
        </defs>
      </g>
      {/* arrow */}
      <path d="M116 90 h24 m-6 -4 l6 4 l-6 4" stroke="#FF8F5C" strokeWidth="1.2"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* extracted key-value chips */}
      <g transform="translate(150 42)">
        {fields.map((f, i) => (
          <g key={f.label} className="ocr-field"
            style={{ animationDelay: `${(1.5 + i * 0.5).toFixed(2)}s` }}
            transform={`translate(0 ${i * 34})`}>
            <rect x="0" y="0" width="96" height="26" rx="4"
              fill="rgba(255,107,53,0.10)" stroke="#FF8F5C" strokeWidth="0.9" />
            <text x="8" y="10" fontSize="6.4" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.6)" letterSpacing="1.2">{f.label}</text>
            <text x="8" y="21" fontSize="8.4" fontFamily="var(--font-mono)"
              fill="#FFB98A" fontWeight="700">{f.value}</text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function SentimentAnim() {
  // Three category bars, positive/neutral/negative filling to values
  const rows = [
    { label: 'Positive', value: 0.72, color: '#8BC34A' },
    { label: 'Neutral', value: 0.20, color: '#E9C46A' },
    { label: 'Negative', value: 0.08, color: '#E86B45' },
  ]
  return (
    <svg viewBox="0 0 180 180" className="annot-svg" aria-hidden>
      {/* scoreboard header */}
      <g transform="translate(14 24)">
        <text fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.4"
          fill="rgba(246,235,218,0.55)">CLASSIFY · SENTIMENT</text>
        <g transform="translate(114 -4)" className="senti-score">
          <rect width="38" height="14" rx="3" fill="#FF6B35" />
          <text x="19" y="10" fontSize="8" fontFamily="var(--font-mono)"
            fill="#0A0805" fontWeight="700" textAnchor="middle">+0.72</text>
        </g>
      </g>
      {/* bars */}
      {rows.map((r, i) => {
        const y = 52 + i * 30
        return (
          <g key={r.label} transform={`translate(14 ${y})`}>
            <text fontFamily="var(--font-mono)" fontSize="7.5"
              fill="rgba(246,235,218,0.85)" y="-4">{r.label}</text>
            {/* track */}
            <rect x="0" y="0" width="152" height="10" rx="5"
              fill="rgba(246,235,218,0.08)" />
            {/* fill — width animates from 0 */}
            <rect className="senti-fill"
              x="0" y="0" height="10" rx="5" fill={r.color}
              style={{
                width: `${(r.value * 152).toFixed(2)}px`,
                animationDelay: `${(0.4 + i * 0.3).toFixed(2)}s`,
              }} />
            <text x="152" y="-4" fontFamily="var(--font-mono)" fontSize="7.5"
              fill="rgba(246,235,218,0.55)" textAnchor="end">
              {(r.value * 100).toFixed(0)}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
//  Type catalogue
// ─────────────────────────────────────────────────────────────

type AnnotationType = {
  id: string
  Anim: ComponentType
  title: string
  blurb: string
  meta: string[]
}

const types: AnnotationType[] = [
  {
    id: 'T01',
    Anim: BBoxAnim,
    title: '2D Bounding Boxes',
    blurb: 'Tight rectangles around every subject in a frame — the foundational label behind object detection, retail vision and safety AI.',
    meta: ['Vision', 'Detection'],
  },
  {
    id: 'T02',
    Anim: PolygonAnim,
    title: 'Polygon & Semantic Segmentation',
    blurb: 'Pixel-perfect outlines and per-pixel class masks for medical imaging, autonomous driving and precision retail applications.',
    meta: ['Vision', 'Pixel-level'],
  },
  {
    id: 'T03',
    Anim: PoseAnim,
    title: 'Keypoint & Pose Estimation',
    blurb: 'Skeleton-graph labels for sports analytics, ergonomics, fitness apps and human–robot interaction — every joint tagged and linked.',
    meta: ['Vision', 'Keypoints'],
  },
  {
    id: 'T04',
    Anim: CuboidAnim,
    title: '3D Cuboid Annotation',
    blurb: 'Volumetric boxes with width, height and depth for AR overlays, warehouse robotics and driver-assistance systems.',
    meta: ['3D', 'Spatial'],
  },
  {
    id: 'T05',
    Anim: LidarAnim,
    title: 'LiDAR Point-Cloud Labelling',
    blurb: 'Per-point class, instance and cuboid annotation on raw LiDAR scans — the ground truth self-driving and robotics stacks are trained on.',
    meta: ['LiDAR', 'Autonomy'],
  },
  {
    id: 'T06',
    Anim: VideoTrackAnim,
    title: 'Video Tracking & MOT',
    blurb: 'Frame-by-frame object tracking with stable IDs across occlusion — behaviour analytics, sports vision and multi-object tracking.',
    meta: ['Video', 'Tracking'],
  },
  {
    id: 'T07',
    Anim: NerAnim,
    title: 'NLP & Named-Entity Recognition',
    blurb: 'Entity spans, relations, intent and coreference — the linguistic labels behind search, chat, extraction and compliance NLP.',
    meta: ['Text', 'NLP'],
  },
  {
    id: 'T08',
    Anim: AudioAnim,
    title: 'Audio Transcription & Events',
    blurb: 'Word-level transcripts, speaker turns, timestamps and sound-event tags for voice assistants, contact-centre AI and ambient audio.',
    meta: ['Audio', 'Speech'],
  },
  {
    id: 'T09',
    Anim: SentimentAnim,
    title: 'Sentiment & Classification',
    blurb: 'Topic, intent, sentiment and moderation labels applied at scale with disciplined guideline enforcement and inter-annotator checks.',
    meta: ['Text', 'Classification'],
  },
  {
    id: 'T10',
    Anim: OcrAnim,
    title: 'OCR & Document Field Extraction',
    blurb: 'Text detection, key-value field capture and clause labelling on invoices, forms, contracts and records — accuracy under real-world document variation.',
    meta: ['Documents', 'OCR'],
  },
]

// ─────────────────────────────────────────────────────────────
//  Section
// ─────────────────────────────────────────────────────────────

export function AnnotationTypesSection() {
  return (
    <section
      id="annotation-types"
      className="py-section border-t border-white/[0.05]"
      data-scroll-anchor="annotation-types"
    >
      <div className="mx-auto max-w-container container-pad">
        <FadeIn>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <SectionLabel className="mb-4">01 · Annotation types we ship</SectionLabel>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 1.4rem + 2.2vw, 3rem)',
                  fontWeight: 350,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-strong)',
                }}
              >
                Ten label types.{' '}
                <span className="editorial" style={{ color: 'var(--color-gold, #E9C46A)' }}>
                  One annotation console
                </span>{' '}
                behind every dataset.
              </h2>
            </div>
            <p
              className="max-w-md text-[15.5px] leading-relaxed lg:text-right lg:ml-auto"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
            >
              From 2D boxes to LiDAR point clouds, multilingual NLP and document OCR — the label
              formats we deliver as production-ready training and evaluation data for modern AI teams.
            </p>
          </div>
        </FadeIn>

        {/* Landscape card grid — animation left (3/7), text right (4/7) */}
        <StaggerGroup
          staggerDelay={0.06}
          className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-2"
        >
          {types.map(({ id, Anim, title, blurb, meta }, i) => {
            const gold = i % 2 === 0
            const accent = gold ? '#E9C46A' : '#FF8F5C'
            const accentSoft = gold ? 'rgba(233,196,106,0.14)' : 'rgba(255,143,92,0.14)'
            return (
              <StaggerItem key={id}>
                <article
                  className="annot-card group relative flex h-full overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                    ['--annot-accent' as string]: accent,
                    ['--annot-accent-soft' as string]: accentSoft,
                  }}
                >
                  {/* Corner brackets — echo annotation-tool language */}
                  <span aria-hidden className="annot-bracket annot-bracket--tl" />
                  <span aria-hidden className="annot-bracket annot-bracket--tr" />
                  <span aria-hidden className="annot-bracket annot-bracket--bl" />
                  <span aria-hidden className="annot-bracket annot-bracket--br" />

                  {/* Hover glow */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(360px circle at 20% 0%, ${accentSoft}, transparent 60%)`,
                    }}
                  />

                  {/* Animation cell — ≈ 3/7 width */}
                  <div className="annot-anim">
                    <Anim />
                  </div>

                  {/* Text cell — ≈ 4/7 width */}
                  <div className="annot-body">
                    <header className="flex items-center justify-end">
                      <span
                        className="text-[9.5px] font-medium uppercase"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.16em',
                          color: 'var(--text-muted)',
                        }}
                      >
                        Label type
                      </span>
                    </header>
                    <h3
                      className="mt-3 text-[18px] font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.01em',
                        color: 'var(--text-strong)',
                        lineHeight: 1.2,
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      className="mt-2 text-[13.5px] leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--text-body)',
                      }}
                    >
                      {blurb}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {meta.map((m) => (
                        <span
                          key={m}
                          className="rounded-full border px-2 py-[3px] text-[10px] font-medium uppercase"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.12em',
                            borderColor: 'var(--border-glass)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Baseline accent bar animates in on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: accent }}
                  />
                </article>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
