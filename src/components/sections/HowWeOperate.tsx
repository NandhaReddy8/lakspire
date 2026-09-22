'use client'

import type { ComponentType } from 'react'
import { useEffect, useRef } from 'react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'

/**
 * HowWeOperate — pinned scrollytelling that walks the visitor through
 * the six moves of a Lakspire annotation engagement. Replaces the old
 * "six disciplines" grid with an operational narrative: discovery →
 * analyse → prepare → label → QA → deliver.
 *
 * Every step has a bespoke SVG illustration that reads the operation
 * at a glance. Illustrations are inline (SVG + CSS keyframes) so they
 * carry no extra runtime and honor prefers-reduced-motion.
 *
 * Scroll logic is lifted from the retired WhatWeDoStory: sticky
 * card stack, direct DOM mutation via refs, no per-frame re-renders.
 */

/* ─────────────────────────────────────────────────────────────
   Illustrations — one per move
   Each SVG uses the offset off-white color rgba(246,235,218,…)
   so it sidesteps the global light-theme SVG shim (which only
   catches the site's default rgba(255,240,220,…) prefix).
   ────────────────────────────────────────────────────────── */

function DiscoveryScene() {
  return (
    <svg viewBox="0 0 340 260" className="op-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="disc-glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="rgba(255,143,92,0.28)" />
          <stop offset="1" stopColor="rgba(255,143,92,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="170" cy="140" rx="130" ry="80" fill="url(#disc-glow)" />
      {/* Client silhouette (left) — shifted down so the top area is
          clear of the two speech bubbles and the corner label. */}
      <g transform="translate(52 110)" className="op-fade-in" style={{ animationDelay: '0.15s' }}>
        <circle cx="34" cy="20" r="16" fill="rgba(246,235,218,0.08)"
          stroke="rgba(246,235,218,0.55)" strokeWidth="1.4" />
        <path d="M6 88 c 0 -26 12 -42 28 -42 c 16 0 28 16 28 42 z"
          fill="rgba(246,235,218,0.05)" stroke="rgba(246,235,218,0.45)" strokeWidth="1.4" />
        <text x="34" y="104" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1"
          fill="rgba(246,235,218,0.65)" textAnchor="middle">CLIENT</text>
      </g>
      {/* Lakspire silhouette (right) */}
      <g transform="translate(220 110)" className="op-fade-in" style={{ animationDelay: '0.35s' }}>
        <circle cx="34" cy="20" r="16" fill="rgba(255,143,92,0.14)"
          stroke="#FF8F5C" strokeWidth="1.4" />
        <path d="M6 88 c 0 -26 12 -42 28 -42 c 16 0 28 16 28 42 z"
          fill="rgba(255,143,92,0.10)" stroke="#FF8F5C" strokeWidth="1.4" />
        <text x="34" y="104" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1"
          fill="#FFB98A" textAnchor="middle">LAKSPIRE</text>
      </g>
      {/* Connecting exchange line — dashes march right-to-left so
          the flow feels alive. Pulsing dot rides the midpoint. */}
      <line className="op-dashflow" x1="118" y1="140" x2="222" y2="140"
        stroke="rgba(255,143,92,0.5)" strokeWidth="1.4"
        strokeDasharray="4 4" />
      <circle cx="170" cy="140" r="4" fill="#FF6B35" className="op-pulse" />
      {/* Speech bubbles above the silhouettes. Widened to 128 to
          hold their captions comfortably. */}
      <g transform="translate(22 44)" className="op-bubble-in" style={{ animationDelay: '0.6s' }}>
        <rect width="128" height="22" rx="11" fill="rgba(246,235,218,0.08)"
          stroke="rgba(246,235,218,0.4)" strokeWidth="1" />
        <circle cx="16" cy="11" r="2.2" fill="rgba(246,235,218,0.75)" />
        <circle cx="24" cy="11" r="2.2" fill="rgba(246,235,218,0.55)" />
        <circle cx="32" cy="11" r="2.2" fill="rgba(246,235,218,0.35)" />
        <text x="44" y="14.4" fontFamily="var(--font-mono)" fontSize="7"
          fill="rgba(246,235,218,0.85)">brief · goals</text>
      </g>
      <g transform="translate(190 44)" className="op-bubble-in" style={{ animationDelay: '0.9s' }}>
        <rect width="128" height="22" rx="11" fill="rgba(255,143,92,0.14)"
          stroke="#FF8F5C" strokeWidth="1" />
        <path d="M12 11 l4 4 l8 -8" fill="none" stroke="#8BC34A" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <text x="30" y="14.4" fontFamily="var(--font-mono)" fontSize="7"
          fill="#FFB98A">plan agreed</text>
      </g>
      {/* Corner label */}
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="9"
        letterSpacing="2" fill="rgba(246,235,218,0.4)">01 · DISCOVERY</text>
    </svg>
  )
}

function AnalyseScene() {
  // Four evenly-spaced recommendation chips across the 340-wide
  // viewBox: each 52 wide, 20px gap → 4·52 + 3·20 = 268, left
  // margin (340-268)/2 = 36.
  const chips = [
    { x: 36, label: '2D BBOX', color: '#FF8F5C' },
    { x: 108, label: 'NER', color: '#E9C46A' },
    { x: 180, label: 'LiDAR', color: '#F4A261' },
    { x: 252, label: 'OCR', color: '#FFB98A' },
  ]
  return (
    <svg viewBox="0 0 340 260" className="op-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* Audit document */}
      <g transform="translate(38 32)">
        <path d="M0 0 h100 l14 14 v148 h-114 z" fill="rgba(246,235,218,0.06)"
          stroke="rgba(246,235,218,0.32)" strokeWidth="1.1" />
        <path d="M100 0 v14 h14" fill="none" stroke="rgba(246,235,218,0.4)" strokeWidth="1.1" />
        <text x="10" y="22" fontFamily="var(--font-mono)" fontSize="8"
          letterSpacing="1.4" fill="rgba(246,235,218,0.7)">DATA AUDIT</text>
        {/* text lines — each line blinks in and out on its own delay
            so the doc reads as living text being scanned. */}
        {[36, 50, 64, 82, 96, 110, 128, 142].map((y, i) => (
          <rect key={i} className="op-appear"
            style={{ animationDelay: `${(i * 0.32).toFixed(2)}s` }}
            x="10" y={y} width={72 - (i % 3) * 12} height="3.5" rx="1"
            fill="rgba(246,235,218,0.38)" />
        ))}
        {/* scan sweep */}
        <rect className="op-sweep" x="0" y="10" width="114" height="14"
          fill="url(#analyse-sweep)" />
        <defs>
          <linearGradient id="analyse-sweep" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(255,143,92,0)" />
            <stop offset="0.5" stopColor="rgba(255,143,92,0.45)" />
            <stop offset="1" stopColor="rgba(255,143,92,0)" />
          </linearGradient>
        </defs>
      </g>
      {/* Magnifier hovering over doc — CSS transform is safe because
          this group has no transform attribute of its own. */}
      <g className="op-mag-hover">
        <circle cx="132" cy="130" r="24" fill="none" stroke="#FF6B35" strokeWidth="2" />
        <line x1="150" y1="148" x2="164" y2="162" stroke="#FF6B35" strokeWidth="2.6"
          strokeLinecap="round" />
        <circle cx="132" cy="130" r="18" fill="rgba(255,107,53,0.05)" />
      </g>
      {/* Recommendation chips popping into the plan */}
      <g transform="translate(0 208)">
        <text x="40" y="0" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.4"
          fill="rgba(246,235,218,0.6)">RECOMMENDED LABEL TYPES</text>
        {chips.map((chip, i) => (
          <g key={chip.label} className="op-appear"
            style={{ animationDelay: `${(i * 0.9).toFixed(2)}s` }}
            transform={`translate(${chip.x} 12)`}>
            <rect width="52" height="20" rx="4" fill={chip.color} />
            <text x="26" y="14" fontSize="9" fontFamily="var(--font-mono)"
              fontWeight="700" fill="#0A0805" textAnchor="middle">{chip.label}</text>
          </g>
        ))}
      </g>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="9"
        letterSpacing="2" fill="rgba(246,235,218,0.4)">02 · ANALYSE & RECOMMEND</text>
    </svg>
  )
}

function PrepareScene() {
  return (
    <svg viewBox="0 0 340 260" className="op-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* Guidelines doc */}
      <g transform="translate(38 46)" className="op-fade-in" style={{ animationDelay: '0.15s' }}>
        <path d="M0 0 h64 l10 10 v92 h-74 z" fill="rgba(255,143,92,0.08)"
          stroke="#FF8F5C" strokeWidth="1.2" />
        <path d="M64 0 v10 h10" fill="none" stroke="#FF8F5C" strokeWidth="1.2" />
        <text x="8" y="18" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1"
          fill="#FFB98A" fontWeight="700">GUIDE v2.3</text>
        {[30, 44, 58, 72, 86].map((y) => (
          <line key={y} x1="8" y1={y} x2="66" y2={y}
            stroke="rgba(246,235,218,0.32)" strokeWidth="1" />
        ))}
      </g>
      {/* Taxonomy tree */}
      <g transform="translate(148 46)" className="op-fade-in" style={{ animationDelay: '0.3s' }}>
        <text x="0" y="0" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1"
          fill="rgba(246,235,218,0.6)">TAXONOMY</text>
        {/* Root */}
        <rect x="0" y="10" width="60" height="16" rx="3" fill="rgba(246,235,218,0.08)"
          stroke="rgba(246,235,218,0.4)" strokeWidth="1" />
        <text x="30" y="21" fontFamily="var(--font-mono)" fontSize="7" fontWeight="600"
          fill="rgba(246,235,218,0.8)" textAnchor="middle">schema</text>
        {/* Branches with staggered appear cycle — each leaf pops in
            individually so the taxonomy visibly assembles itself. */}
        {[
          { y: 40, label: 'PERSON' },
          { y: 60, label: 'VEHICLE' },
          { y: 80, label: 'SIGN' },
        ].map((n, i) => (
          <g key={n.label} className="op-appear"
            style={{ animationDelay: `${(i * 0.9).toFixed(2)}s` }}>
            <path d={`M20 26 Q 20 ${n.y}, 40 ${n.y}`} fill="none"
              stroke="rgba(233,196,106,0.65)" strokeWidth="1.2" />
            <rect x="40" y={n.y - 6} width="60" height="12" rx="2.5" fill="#E9C46A" />
            <text x="70" y={n.y + 2.6} fontFamily="var(--font-mono)" fontSize="6.6"
              fontWeight="700" fill="#0A0805" textAnchor="middle">{n.label}</text>
          </g>
        ))}
      </g>
      {/* Batch stack loading */}
      <g transform="translate(48 180)">
        <text fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.2"
          fill="rgba(246,235,218,0.55)">BATCHES QUEUED · 12</text>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} className="op-shimmer"
            style={{ animationDelay: `${(i * 0.28).toFixed(2)}s` }}
            x={i * 44} y="14" width="38" height="42" rx="4"
            fill="rgba(246,235,218,0.05)" stroke="rgba(255,143,92,0.55)" strokeWidth="1"
            strokeDasharray="3 3" />
        ))}
        {/* progress bar */}
        <rect x="0" y="66" width="220" height="4" rx="2" fill="rgba(246,235,218,0.08)" />
        <rect x="0" y="66" width="220" height="4" rx="2" fill="url(#prep-fill)" className="op-progress-fill" />
        <defs>
          <linearGradient id="prep-fill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#FF6B35" />
            <stop offset="1" stopColor="#E9C46A" />
          </linearGradient>
        </defs>
      </g>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="9"
        letterSpacing="2" fill="rgba(246,235,218,0.4)">03 · PREPARE</text>
    </svg>
  )
}

function LabelScene() {
  // Grid of sample tiles being labelled by annotators. Reviewer
  // avatars now sit BETWEEN the corner label and the grid so nothing
  // stacks over the "04 · LABEL & REVIEW" caption.
  const rows = 3
  const cols = 4
  return (
    <svg viewBox="0 0 340 260" className="op-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* Corner label — abbreviated to "04 · LABEL" so it can't
          bump into the reviewer avatars on the right. */}
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="9"
        letterSpacing="2" fill="rgba(246,235,218,0.4)">04 · LABEL</text>
      {/* Reviewer avatars — three annotators on the top-right, well
          clear of the corner label. No caption needed; the illustration
          reads "reviewers on a grid of samples". */}
      {[238, 274, 310].map((x, i) => (
        <g key={x} className="op-reviewer" style={{ animationDelay: `${(1.4 + i * 0.4).toFixed(2)}s` }}
          transform={`translate(${x - 12} 8)`}>
          <circle cx="10" cy="10" r="9" fill="rgba(20,15,11,0.9)"
            stroke="#FFB98A" strokeWidth="1.3" />
          <circle cx="10" cy="9" r="3" fill="#FFB98A" />
          <path d="M4 18 c 0 -3 2.5 -6 6 -6 c 3.5 0 6 3 6 6" fill="#FFB98A" />
        </g>
      ))}
      {/* Sample grid — pushed down so reviewer strip has room */}
      <g transform="translate(28 60)">
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const idx = r * cols + c
            const x = c * 60
            const y = r * 50
            const delay = (0.2 + idx * 0.12).toFixed(2)
            return (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y} width="52" height="44" rx="3"
                  fill="rgba(246,235,218,0.05)" stroke="rgba(246,235,218,0.2)" strokeWidth="0.8" />
                <circle cx={x + 26} cy={y + 20} r="7.5" fill="rgba(246,235,218,0.12)" />
                <rect className="op-lbl-box" style={{ animationDelay: `${delay}s` }}
                  x={x + 6} y={y + 8} width="40" height="28" rx="1.5" fill="none"
                  stroke="#FF8F5C" strokeWidth="1.2" strokeDasharray="136" />
                <g className="op-lbl-tag" style={{ animationDelay: `${(parseFloat(delay) + 0.35).toFixed(2)}s` }}
                  transform={`translate(${x + 6} ${y + 38})`}>
                  <rect width="24" height="6" rx="1.5" fill="#E9C46A" />
                  <text x="12" y="4.6" fontSize="4.6" fontFamily="var(--font-mono)"
                    fontWeight="700" fill="#0A0805" textAnchor="middle">CAR</text>
                </g>
              </g>
            )
          }),
        )}
      </g>
      {/* Progress counter */}
      <g transform="translate(28 226)">
        <text fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.4"
          fill="rgba(246,235,218,0.6)">LABELS · <tspan fill="#FFB98A" fontWeight="700">2,148</tspan> / 4,000</text>
        <rect x="0" y="10" width="284" height="4" rx="2" fill="rgba(246,235,218,0.08)" />
        <rect x="0" y="10" width="284" height="4" rx="2" fill="#FF6B35" className="op-progress-fill" />
      </g>
    </svg>
  )
}

function QaScene() {
  const bars = [
    { label: 'Precision', value: 0.94, color: '#FF8F5C' },
    { label: 'Recall', value: 0.89, color: '#E9C46A' },
    { label: 'F1', value: 0.91, color: '#FFB98A' },
    { label: 'IAA (κ)', value: 0.86, color: '#F4A261' },
  ]
  return (
    <svg viewBox="0 0 340 260" className="op-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* Big dial */}
      <g transform="translate(90 118)">
        <path d="M-60 0 A60 60 0 0 1 60 0" fill="none" stroke="rgba(246,235,218,0.14)" strokeWidth="10" strokeLinecap="round" />
        {/* Dash is 220 (longer than the ~188.5 path) so at offset=220
            no sliver renders at the right cap on loop reset. */}
        <path d="M-60 0 A60 60 0 0 1 60 0" fill="none" stroke="url(#qa-dial-g)" strokeWidth="10" strokeLinecap="round"
          strokeDasharray="220" className="op-dial" />
        <defs>
          <linearGradient id="qa-dial-g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#FF6B35" />
            <stop offset="1" stopColor="#E9C46A" />
          </linearGradient>
        </defs>
        <line className="op-needle" x1="0" y1="0" x2="0" y2="-54" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="0" r="4.4" fill="#FF6B35" />
        <text x="0" y="20" fontSize="9" fontFamily="var(--font-mono)"
          fill="rgba(246,235,218,0.7)" textAnchor="middle" letterSpacing="1.4">GOLD SCORE</text>
        <text x="0" y="36" fontSize="14" fontFamily="var(--font-mono)"
          fill="#FFB98A" fontWeight="700" textAnchor="middle" className="op-fade-in"
          style={{ animationDelay: '1.4s' }}>0.91</text>
      </g>
      {/* Metrics bars right side */}
      {bars.map((b, i) => {
        const y = 60 + i * 38
        return (
          <g key={b.label} transform={`translate(180 ${y})`}>
            <text x="0" y="-3" fontSize="8.5" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.75)">{b.label}</text>
            <rect x="0" y="0" width="130" height="8" rx="3"
              fill="rgba(246,235,218,0.08)" />
            <rect className="op-bar" x="0" y="0" height="8" rx="3" fill={b.color}
              style={{
                width: `${(b.value * 130).toFixed(2)}px`,
                animationDelay: `${(0.4 + i * 0.22).toFixed(2)}s`,
              }} />
            <text x="130" y="-3" fontSize="8" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.55)" textAnchor="end">
              {(b.value * 100).toFixed(0)}
            </text>
          </g>
        )
      })}
      {/* Small "AI check" pip */}
      <g transform="translate(180 226)" className="op-fade-in" style={{ animationDelay: '1.6s' }}>
        <rect width="130" height="20" rx="4" fill="rgba(139,195,74,0.14)" stroke="#8BC34A" strokeWidth="1" />
        <path d="M10 10 l4 4 l8 -8" fill="none" stroke="#8BC34A" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" transform="translate(0 -1)" />
        <text x="30" y="13" fontSize="7.4" fontFamily="var(--font-mono)"
          fontWeight="700" fill="#8BC34A" letterSpacing="0.6">AI-ASSISTED PASSED</text>
      </g>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="9"
        letterSpacing="2" fill="rgba(246,235,218,0.4)">05 · QA & METRICS</text>
    </svg>
  )
}

function DeliverScene() {
  const artifacts = [
    { label: 'train/', size: '3.2k' },
    { label: 'val/', size: '640' },
    { label: 'test/', size: '520' },
    { label: 'gold/', size: '128' },
  ]
  return (
    <svg viewBox="0 0 340 260" className="op-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* Dataset package */}
      <g transform="translate(38 46)" className="op-fade-in" style={{ animationDelay: '0.1s' }}>
        <rect width="130" height="150" rx="8" fill="rgba(255,143,92,0.06)"
          stroke="#FF8F5C" strokeWidth="1.4" />
        <text x="10" y="18" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.2"
          fill="#FFB98A" fontWeight="700">dataset · v1.2</text>
        {artifacts.map((a, i) => (
          <g key={a.label} className="op-artifact-in"
            style={{ animationDelay: `${(0.4 + i * 0.22).toFixed(2)}s` }}
            transform={`translate(10 ${32 + i * 26})`}>
            <rect width="110" height="20" rx="3" fill="rgba(246,235,218,0.05)"
              stroke="rgba(246,235,218,0.22)" strokeWidth="0.9" />
            <path d="M8 10 h8 v-4 h-2 v4 M18 10 h4" stroke="rgba(246,235,218,0.55)" strokeWidth="1" fill="none" />
            <text x="26" y="13.6" fontSize="7.4" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.85)">{a.label}</text>
            <text x="102" y="13.6" fontSize="7" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.5)" textAnchor="end">{a.size}</text>
          </g>
        ))}
      </g>
      {/* Delivery arrow */}
      <path d="M180 130 h24 m-6 -4 l6 4 l-6 4" stroke="#FF8F5C" strokeWidth="1.6"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dashboard */}
      <g transform="translate(214 46)">
        <rect width="90" height="150" rx="8" fill="rgba(246,235,218,0.06)"
          stroke="rgba(246,235,218,0.28)" strokeWidth="1.2" />
        <text x="8" y="16" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1"
          fill="rgba(246,235,218,0.65)">DASHBOARD</text>
        {/* Sparkline */}
        <path d="M8 44 L20 32 L32 40 L44 22 L56 30 L68 16 L80 24" fill="none"
          stroke="#FF6B35" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="120" className="op-spark" />
        <line x1="8" y1="52" x2="82" y2="52" stroke="rgba(246,235,218,0.18)" strokeWidth="0.6" />
        {/* KPI rows */}
        {['throughput', 'accuracy', 'IAA', 'defects'].map((k, i) => (
          <g key={k} transform={`translate(8 ${64 + i * 20})`}>
            <text fontFamily="var(--font-mono)" fontSize="6.4"
              fill="rgba(246,235,218,0.55)">{k}</text>
            <rect x="0" y="6" width="74" height="4" rx="2" fill="rgba(246,235,218,0.08)" />
            <rect className="op-bar" x="0" y="6" height="4" rx="2" fill="#E9C46A"
              style={{
                width: `${(74 * [0.86, 0.94, 0.88, 0.18][i]).toFixed(2)}px`,
                animationDelay: `${(0.7 + i * 0.14).toFixed(2)}s`,
              }} />
          </g>
        ))}
        {/* Support pip — subtle pulse (op-pulse-sm) so the dot
            doesn't outgrow its chip. */}
        <g transform="translate(8 138)">
          <circle cx="4" cy="4" r="3.6" fill="#8BC34A" className="op-pulse-sm" />
          <text x="12" y="6.4" fontSize="6.6" fontFamily="var(--font-mono)"
            fill="rgba(246,235,218,0.85)">support live</text>
        </g>
      </g>
      <text x="16" y="24" fontFamily="var(--font-mono)" fontSize="9"
        letterSpacing="2" fill="rgba(246,235,218,0.4)">06 · DELIVER & SUPPORT</text>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Workflow step data + illustration lookup
   ────────────────────────────────────────────────────────── */

type Move = {
  id: string
  Icon: ComponentType
  title: string
  overline: string
  body: string
  variant: 'pebble' | 'wave' | 'petal' | 'drop'
}

const moves: Move[] = [
  {
    id: 'discovery',
    Icon: DiscoveryScene,
    overline: 'We listen first',
    title: 'Discovery',
    body:
      'We start by learning your model, your data and the outcome you\'re chasing — a short working session, not a pitch deck. You walk away knowing exactly what we heard and what we\'d propose.',
    variant: 'pebble',
  },
  {
    id: 'analyse',
    Icon: AnalyseScene,
    overline: 'We audit before we label',
    title: 'Analyse & recommend',
    body:
      'A hands-on audit of your data and edge cases. We map what needs labelling to the right formats — 2D boxes, NER, LiDAR, OCR — and hand you a plan you can sanity-check line by line.',
    variant: 'wave',
  },
  {
    id: 'prepare',
    Icon: PrepareScene,
    overline: 'Guidelines before pens',
    title: 'Prepare the console',
    body:
      'Written guidelines, taxonomy, batches, tools and reviewer calibration — everything that has to be in place before the first label is drawn, so quality is baked in from batch 001.',
    variant: 'petal',
  },
  {
    id: 'label',
    Icon: LabelScene,
    overline: 'Expert humans in the loop',
    title: 'Label & review',
    body:
      'Trained annotators work the queue, senior reviewers approve inline, and every sample carries who touched it and when. Model-assisted pre-labels lift throughput without softening the standard.',
    variant: 'drop',
  },
  {
    id: 'qa',
    Icon: QaScene,
    overline: 'Scored against gold',
    title: 'QA & metrics',
    body:
      'Precision, recall, F1 and inter-annotator agreement measured against gold sets — plus an AI-assisted second-pass that catches the sample-level defects that quietly wreck evaluation.',
    variant: 'wave',
  },
  {
    id: 'deliver',
    Icon: DeliverScene,
    overline: 'Support after handover',
    title: 'Deliver & support',
    body:
      'Versioned datasets, coverage dashboards, correction loops and a named contact — the labelled data lands in your pipeline, and the bench stays available to iterate as your model does.',
    variant: 'pebble',
  },
]

/* ─────────────────────────────────────────────────────────────
   Scrollytelling section (adapted from WhatWeDoStory)
   ────────────────────────────────────────────────────────── */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const SLICE_VH_DESKTOP = 70
const SLICE_VH_MOBILE = 55

export function HowWeOperate() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const copyRefs = useRef<(HTMLDivElement | null)[]>([])
  const illustRefs = useRef<(HTMLDivElement | null)[]>([])
  const railFillRefs = useRef<(HTMLDivElement | null)[]>([])
  const railTipRefs = useRef<(HTMLDivElement | null)[]>([])
  const stepDotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const stepCurrentRef = useRef<HTMLSpanElement | null>(null)

  const N = moves.length

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let raf = 0
    let lastActive = -1

    const compute = () => {
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      const total = container.offsetHeight - vh
      if (total <= 0) return

      const isMobile = window.innerWidth < 1024
      const progress = clamp(-rect.top / total)
      const p = progress * N
      const activeIndex = Math.min(N - 1, Math.max(0, Math.floor(p)))

      for (let i = 0; i < N; i++) {
        const card = cardRefs.current[i]
        const copy = copyRefs.current[i]
        const illust = illustRefs.current[i]
        const railFill = railFillRefs.current[i]
        const railTip = railTipRefs.current[i]
        if (!card) continue

        const isCurrent = i === activeIndex
        const isLast = i === N - 1
        const flip = i >= 3
        const localP = p - i

        if (isCurrent !== (i === lastActive)) {
          card.style.opacity = isCurrent ? '1' : '0'
          card.style.pointerEvents = isCurrent ? 'auto' : 'none'
          card.setAttribute('aria-hidden', isCurrent ? 'false' : 'true')
        }

        if (copy) {
          if (isCurrent) {
            let copyOpacity = 1
            let copyTy = 0
            if (!isLast) {
              if (isMobile) {
                if (localP >= 0.3) copyOpacity = clamp((0.7 - localP) / 0.4)
              } else {
                if (localP >= 0.55) copyOpacity = clamp((1 - localP) / 0.45)
                copyTy = -localP * 64
              }
            }
            copy.style.opacity = String(copyOpacity)
            copy.style.transform = `translate3d(0,${copyTy}px,0)`
          }
        }

        if (illust && isCurrent !== (i === lastActive)) {
          illust.style.transform = isCurrent
            ? 'translate3d(0,0,0) scale(1)'
            : `translate3d(${flip ? '-' : ''}18px,10px,0) scale(0.97)`
        }

        if (railFill && railTip && isCurrent) {
          const fill = isLast ? 1 : clamp(localP)
          const pct = `${(fill * 100).toFixed(2)}%`
          railFill.style.height = pct
          railTip.style.top = pct
        }
      }

      // Update step-dot indicator
      if (lastActive !== activeIndex) {
        for (let i = 0; i < N; i++) {
          const dot = stepDotRefs.current[i]
          if (dot) dot.setAttribute('data-active', String(i === activeIndex))
        }
        if (stepCurrentRef.current) {
          stepCurrentRef.current.textContent = String(activeIndex + 1).padStart(2, '0')
        }
      }

      lastActive = activeIndex
    }

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    lastActive = -1
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [N])

  return (
    <section
      ref={containerRef}
      className="relative op-section"
      style={{
        height: `calc(${N} * var(--slice-vh, ${SLICE_VH_MOBILE}vh))`,
      }}
      data-scroll-anchor="how-we-operate"
      id="how-we-operate"
    >
      <style>{`
        @media (min-width: 1024px) {
          [data-scroll-anchor="how-we-operate"] {
            --slice-vh: ${SLICE_VH_DESKTOP}vh;
          }
        }
      `}</style>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Ambient cinematic backdrop that softly pulses through the section */}
        <span aria-hidden className="op-backdrop" />
        <div className="mx-auto flex h-full max-w-container flex-col justify-center container-pad pt-20 pb-4 lg:pt-24 lg:pb-8">
          {/* Header + step indicator */}
          <div className="mb-4 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <SectionLabel className="mb-3 lg:mb-4">How we operate</SectionLabel>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 1.1rem + 1.8vw, 2.9rem)',
                  fontWeight: 350,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-strong)',
                }}
              >
                From brief to production dataset.{' '}
                <span className="editorial" style={{ color: 'var(--color-gold, #E9C46A)' }}>
                  Six moves, one flow.
                </span>
              </h2>
            </div>
            {/* Step indicator: 01 / 06 + row of dots */}
            <div className="op-step-indicator">
              <div className="op-step-num">
                <span ref={stepCurrentRef}>01</span>
                <span className="op-step-sep">/</span>
                <span>{String(N).padStart(2, '0')}</span>
              </div>
              <div className="op-step-dots" role="presentation">
                {moves.map((m, i) => (
                  <span
                    key={m.id}
                    ref={(el) => {
                      stepDotRefs.current[i] = el
                    }}
                    className="op-step-dot"
                    data-active={i === 0}
                    aria-label={m.title}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card stack */}
          <div className="relative flex-1 min-h-[400px] lg:min-h-[440px]">
            {moves.map((move, i) => {
              const flip = i >= 3
              const initiallyActive = i === 0
              return (
                <div
                  key={move.id}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className="absolute inset-0"
                  aria-hidden={!initiallyActive}
                  style={{
                    opacity: initiallyActive ? 1 : 0,
                    pointerEvents: initiallyActive ? 'auto' : 'none',
                  }}
                >
                  <div className="grid h-full grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-16">
                    {/* Copy column */}
                    <div
                      className={`relative order-2 ${
                        flip ? 'lg:order-2 lg:pr-8' : 'lg:order-1 lg:pl-8'
                      }`}
                    >
                      {/* Vertical rail */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute hidden lg:block"
                        style={{
                          top: '0.25rem',
                          bottom: '0.25rem',
                          width: '2px',
                          left: flip ? 'auto' : 0,
                          right: flip ? 0 : 'auto',
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ background: 'var(--rail-track)' }}
                        />
                        <div
                          ref={(el) => {
                            railFillRefs.current[i] = el
                          }}
                          className="absolute left-0 right-0 top-0"
                          style={{
                            height: '0%',
                            background:
                              'linear-gradient(180deg, rgba(255,107,53,0.35) 0%, #FF6B35 60%, #FABD6C 100%)',
                          }}
                        />
                        <div
                          ref={(el) => {
                            railTipRefs.current[i] = el
                          }}
                          className="themed-rail-tip absolute left-1/2"
                          style={{
                            top: '0%',
                            width: '10px',
                            height: '2px',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      </div>

                      <div
                        ref={(el) => {
                          copyRefs.current[i] = el
                        }}
                        style={{
                          opacity: 1,
                          transform: 'translate3d(0,0,0)',
                          willChange: 'opacity, transform',
                        }}
                      >
                        <p
                          className="mb-3 inline-block text-[12.5px] font-bold uppercase tracking-[0.15em]"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            background: 'linear-gradient(90deg, #FF6B35, #FF8F3C)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          Move 0{i + 1} / 0{N} — {move.overline}
                        </p>
                        <h3
                          className="mb-2 lg:mb-4"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.6rem, 1.2rem + 1.8vw, 2.75rem)',
                            fontWeight: 400,
                            letterSpacing: '-0.025em',
                            lineHeight: 1.1,
                            color: 'var(--text-strong)',
                          }}
                        >
                          {move.title}
                        </h3>
                        <p
                          className="max-w-xl text-[15px] leading-relaxed lg:text-[17px]"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontWeight: 500,
                            color: 'var(--text-body)',
                          }}
                        >
                          {move.body}
                        </p>
                      </div>
                    </div>

                    {/* Illustration column */}
                    <div
                      ref={(el) => {
                        illustRefs.current[i] = el
                      }}
                      className={`order-1 ${flip ? 'lg:order-1' : 'lg:order-2'}`}
                      style={{
                        transform: initiallyActive
                          ? 'translate3d(0,0,0) scale(1)'
                          : `translate3d(${flip ? '-' : ''}18px,10px,0) scale(0.97)`,
                        transition: 'transform 620ms cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'transform',
                      }}
                    >
                      <div className="relative mx-auto w-full max-w-[320px] sm:max-w-md lg:max-w-lg">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-10 -z-10"
                          style={{
                            background: flip
                              ? 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(255,107,53,0.18) 0%, transparent 65%)'
                              : 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(244,162,97,0.16) 0%, transparent 65%)',
                            filter: 'blur(12px)',
                          }}
                        />
                        <ClayFrame variant={move.variant}>
                          <div className="op-illust">
                            <move.Icon />
                          </div>
                        </ClayFrame>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
