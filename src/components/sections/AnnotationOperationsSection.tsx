'use client'
import type { ComponentType } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowLeft, LayoutGrid, ChevronRight } from 'lucide-react'
import { FadeIn } from '@/components/motion/FadeIn'
import { SectionLabel } from '@/components/blocks/SectionLabel'

/**
 * Annotation Operations — two views, toggled from a chip at the top:
 *
 *  1. `single` (default) — pinned horizontal-scroll carousel on
 *     desktop, native snap-scroll on mobile. One op at a time,
 *     animation cross-fades as scroll advances.
 *  2. `all` — vertical timeline of alternating hero rows connected
 *     by a spine with numbered pips. Every op visible in one scroll.
 *
 * The two views are mutually exclusive; the inactive one is not
 * rendered so the two layouts never collide.
 */

// ─────────────────────────────────────────────────────────────
//  Animation cells
// ─────────────────────────────────────────────────────────────

function CollectionAnim() {
  // Each source chip fires a packet that follows a curved SMIL path into
  // the funnel centre — no CSS translateY so no transform-box issues.
  const sources = [
    { x: 22, label: 'IMG', color: '#FF8F5C' },
    { x: 74, label: 'TXT', color: '#E9C46A' },
    { x: 126, label: 'AUD', color: '#F4A261' },
    { x: 178, label: 'VID', color: '#FFB98A' },
  ]
  // Funnel chute centre (x=110) is where all packets converge.
  // Packet starts at (s.x+12, 34) → dx/dy relative motion for animateMotion.
  const funnelCX = 110
  const packetStartY = 34  // SVG y where packet originates (below chip)
  const funnelEntryY = 108 // SVG y inside chute
  return (
    <svg viewBox="0 0 220 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* clip funnel interior so packets disappear inside */}
        <clipPath id="funnel-clip">
          <path d="M32 68 h156 l-52 36 v20 h-52 v-20 z" />
        </clipPath>
      </defs>

      {/* source chips */}
      {sources.map((s, i) => {
        const chipCX = s.x + 12   // horizontal centre of chip
        const dx = funnelCX - chipCX
        const dy = funnelEntryY - packetStartY
        return (
          <g key={s.label} transform={`translate(${s.x} 12)`}>
            <rect width="24" height="14" rx="3" fill={s.color} />
            <text x="12" y="10" fontSize="7.4" fontFamily="ui-monospace,monospace"
              fill="#0A0805" fontWeight="700" textAnchor="middle">
              {s.label}
            </text>
            {/* packet — SMIL curved path into funnel, no CSS transform-box */}
            <rect x="10" y="16" width="4" height="4" rx="1" fill={s.color}>
              <animateMotion
                dur="3s"
                begin={`${(i * 0.65).toFixed(2)}s`}
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.4 0 0.6 1"
                path={`M0,0 Q${(dx / 2).toFixed(1)},${(dy * 0.55).toFixed(1)} ${dx},${dy}`}
              />
              <animate attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.07;0.72;0.85"
                dur="3s"
                begin={`${(i * 0.65).toFixed(2)}s`}
                repeatCount="indefinite" />
            </rect>
          </g>
        )
      })}

      {/* funnel body */}
      <path d="M32 68 h156 l-52 36 v20 h-52 v-20 z"
        fill="rgba(255,143,92,0.06)" stroke="#FF8F5C" strokeWidth="1.4" strokeLinejoin="round" />
      {/* top opening guide dashes */}
      <path d="M32 68 h156" stroke="rgba(246,235,218,0.25)" strokeWidth="0.8" strokeDasharray="2 3" />

      {/* output stream */}
      <line x1="110" y1="124" x2="110" y2="152" stroke="rgba(246,235,218,0.18)" strokeWidth="0.6" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="110" cy="125" r="2.6" fill="#FF6B35">
          <animate attributeName="cy" values="125;150;150" keyTimes="0;0.7;1"
            dur="1.8s" begin={`${(i * 0.38).toFixed(2)}s`} repeatCount="indefinite"
            calcMode="spline" keySplines="0.4 0 0.6 1;0 0 0 0" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.65;0.8"
            dur="1.8s" begin={`${(i * 0.38).toFixed(2)}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* provenance ticks — below the stream, clear of dots */}
      <g fontFamily="ui-monospace,monospace" fontSize="6.2" fill="rgba(246,235,218,0.5)">
        <text x="10" y="168">✓ consent</text>
        <text x="78" y="168">✓ provenance</text>
        <text x="156" y="168">✓ coverage</text>
      </g>
    </svg>
  )
}

function SchemaAnim() {
  const nodes = [
    { x: 26, y: 36, label: 'intent' },
    { x: 26, y: 90, label: 'entity' },
    { x: 26, y: 144, label: 'topic' },
  ]
  const leaves = [
    { x: 138, y: 18, label: 'greet' },
    { x: 138, y: 38, label: 'ask' },
    { x: 138, y: 68, label: 'PER' },
    { x: 138, y: 88, label: 'ORG' },
    { x: 138, y: 108, label: 'LOC' },
    { x: 138, y: 132, label: 'sports' },
    { x: 138, y: 155, label: 'ops' },
  ]
  const links = leaves.map((l) => {
    let closest = nodes[0]
    let dmin = Infinity
    for (const n of nodes) {
      const d = Math.abs(n.y - l.y)
      if (d < dmin) { dmin = d; closest = n }
    }
    return { from: closest, to: l }
  })
  return (
    <svg viewBox="0 0 230 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* backbone */}
      <line x1="14" y1="16" x2="14" y2="162" stroke="rgba(246,235,218,0.22)" strokeWidth="0.8" strokeDasharray="2 3" />
      {/* connectors */}
      {links.map((lk, i) => (
        <path key={i} d={`M${lk.from.x + 44} ${lk.from.y} C ${lk.from.x + 74} ${lk.from.y}, ${lk.to.x - 24} ${lk.to.y}, ${lk.to.x - 4} ${lk.to.y}`}
          fill="none" stroke="rgba(233,196,106,0.55)" strokeWidth="0.9"
          strokeDasharray="80" className="schema-link"
          style={{ animationDelay: `${(0.9 + i * 0.09).toFixed(2)}s` }} />
      ))}
      {/* parent nodes — wider rects so labels like "intent" have room */}
      {nodes.map((n) => (
        <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
          <rect x="0" y="-9" width="44" height="18" rx="3" fill="rgba(255,107,53,0.16)"
            stroke="#FF8F5C" strokeWidth="1.1" />
          <text x="22" y="3.5" fontSize="8" fontFamily="ui-monospace,monospace"
            fill="#FFB98A" fontWeight="600" textAnchor="middle">{n.label}</text>
          <circle cx="44" cy="0" r="1.6" fill="#FF8F5C" />
        </g>
      ))}
      {/* leaf tags — pop in one by one */}
      {leaves.map((l, i) => (
        <g key={l.label} className="schema-leaf" style={{ animationDelay: `${(0.25 + i * 0.14).toFixed(2)}s` }}
          transform={`translate(${l.x} ${l.y})`}>
          <rect x="0" y="-7" width="40" height="14" rx="3" fill="#E9C46A" />
          <text x="20" y="2.6" fontSize="7.5" fontFamily="ui-monospace,monospace"
            fill="#0A0805" fontWeight="700" textAnchor="middle">{l.label}</text>
        </g>
      ))}
    </svg>
  )
}

function QaPipelineAnim() {
  // Records flow through filter stages: dedup → redact → normalise → clean.
  const stages = [
    { x: 30, label: 'dedup' },
    { x: 82, label: 'redact' },
    { x: 134, label: 'normalise' },
    { x: 186, label: 'clean' },
  ]
  return (
    <svg viewBox="0 0 220 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* pipeline rail */}
      <line x1="18" y1="96" x2="202" y2="96" stroke="rgba(246,235,218,0.16)" strokeWidth="0.8"
        strokeDasharray="3 4" />
      {/* stage funnels */}
      {stages.map((s, i) => (
        <g key={s.label} transform={`translate(${s.x} 96)`}>
          <path d="M-16 -20 h32 l-8 20 v14 h-16 v-14 z" fill="rgba(255,107,53,0.08)"
            stroke={i === 3 ? '#FF6B35' : '#E9C46A'} strokeWidth="1.2" />
          <text x="0" y="30" fontSize="7.4" fontFamily="var(--font-mono)"
            fill="rgba(246,235,218,0.7)" textAnchor="middle" letterSpacing="0.4">
            {s.label}
          </text>
        </g>
      ))}
      {/* traveling packets */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="qa-packet" style={{ animationDelay: `${(i * 0.9).toFixed(2)}s` }}>
          <rect x="-6" y="92" width="12" height="8" rx="1.5" fill="#FF8F5C" />
        </g>
      ))}
      {/* reject stream (below rail, from redact stage) */}
      <g fontFamily="var(--font-mono)" fontSize="6" fill="rgba(246,235,218,0.5)">
        <text x="82" y="150" textAnchor="middle">PII stripped</text>
        <path d="M82 128 v14" stroke="rgba(232,107,69,0.55)" strokeWidth="0.8"
          strokeDasharray="2 2" />
      </g>
      {/* input/output chips */}
      <g fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.4"
        fill="rgba(246,235,218,0.55)">
        <text x="12" y="28">IN</text>
        <text x="196" y="28" textAnchor="end">OUT</text>
      </g>
    </svg>
  )
}

function QualityScoreAnim() {
  // Precision/Recall bars + gauge dial rising to a target.
  const bars = [
    { label: 'P', value: 0.92, color: '#FF8F5C' },
    { label: 'R', value: 0.86, color: '#E9C46A' },
    { label: 'F1', value: 0.89, color: '#FFB98A' },
    { label: 'κ', value: 0.81, color: '#F4A261' },
  ]
  return (
    <svg viewBox="0 0 220 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* dial */}
      <g transform="translate(60 108)">
        <path d="M-44 0 A44 44 0 0 1 44 0" fill="none" stroke="rgba(246,235,218,0.14)" strokeWidth="7" strokeLinecap="butt" />
        <path d="M-44 0 A44 44 0 0 1 44 0" fill="none" stroke="url(#dial-g)" strokeWidth="7" strokeLinecap="butt"
          strokeDasharray="138" className="qs-dial" />
        <defs>
          <linearGradient id="dial-g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#FF6B35" />
            <stop offset="1" stopColor="#E9C46A" />
          </linearGradient>
        </defs>
        {/* needle */}
        <line className="qs-needle" x1="0" y1="0" x2="0" y2="-38" stroke="#FF6B35" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="0" cy="0" r="3.4" fill="#FF6B35" />
        <text x="0" y="18" fontSize="8" fontFamily="var(--font-mono)"
          fill="rgba(246,235,218,0.7)" textAnchor="middle" letterSpacing="1">SCORE</text>
        <text x="0" y="32" fontSize="10" fontFamily="var(--font-mono)"
          fill="#FFB98A" fontWeight="700" textAnchor="middle" className="qs-score-text">0.89</text>
      </g>
      {/* bars */}
      {bars.map((b, i) => {
        const y = 26 + i * 30
        return (
          <g key={b.label} transform={`translate(126 ${y})`}>
            <text x="0" y="-3" fontSize="7.5" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.75)">{b.label}</text>
            <rect x="14" y="-8" width="72" height="8" rx="2"
              fill="rgba(246,235,218,0.08)" />
            <rect className="qs-bar" x="14" y="-8" height="8" rx="2" fill={b.color}
              style={{
                width: `${(b.value * 72).toFixed(2)}px`,
                animationDelay: `${(0.5 + i * 0.22).toFixed(2)}s`,
              }} />
            <text x="90" y="-2" fontSize="7" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.55)" textAnchor="end">
              {(b.value * 100).toFixed(0)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function HitlAnim() {
  // Model prediction card → reviewer stamps it, correction propagates.
  return (
    <svg viewBox="0 0 220 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* model card */}
      <g transform="translate(24 32)">
        <rect width="90" height="60" rx="5" fill="rgba(246,235,218,0.05)"
          stroke="rgba(246,235,218,0.22)" strokeWidth="0.8" />
        <text x="8" y="14" fontSize="7.4" fontFamily="var(--font-mono)"
          fill="rgba(246,235,218,0.55)" letterSpacing="1.2">MODEL · v3</text>
        {/* prediction line */}
        <rect x="8" y="22" width="74" height="8" rx="2" fill="rgba(255,143,92,0.28)" />
        <text x="12" y="28.4" fontSize="6.2" fontFamily="var(--font-mono)"
          fill="#FFB98A" fontWeight="600">person 0.71</text>
        {/* correction line (strikethrough → new) */}
        <g className="hitl-fix">
          <rect x="8" y="36" width="74" height="8" rx="2" fill="rgba(232,107,69,0.22)" />
          <text x="12" y="42.4" fontSize="6.2" fontFamily="var(--font-mono)"
            fill="#E86B45" fontWeight="600" textDecoration="line-through">cat</text>
          <text x="34" y="42.4" fontSize="6.2" fontFamily="var(--font-mono)"
            fill="#8BC34A" fontWeight="700">dog ✓</text>
        </g>
      </g>
      {/* arrow */}
      <path d="M120 62 h20 m-6 -4 l6 4 l-6 4" stroke="#FF8F5C" strokeWidth="1.2"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* reviewer */}
      <g transform="translate(144 32)">
        <rect width="52" height="60" rx="5" fill="rgba(255,107,53,0.08)"
          stroke="#FF8F5C" strokeWidth="1.1" />
        {/* person icon */}
        <circle cx="26" cy="24" r="6" fill="none" stroke="#E9C46A" strokeWidth="1.2" />
        <path d="M14 46 c 0 -8 5 -12 12 -12 c 7 0 12 4 12 12" fill="none" stroke="#E9C46A" strokeWidth="1.2" />
        <text x="26" y="56" fontSize="7" fontFamily="var(--font-mono)"
          fill="rgba(246,235,218,0.7)" textAnchor="middle" letterSpacing="0.6">REVIEWER</text>
      </g>
      {/* correction stamp */}
      <g transform="translate(110 116)" className="hitl-stamp">
        <rect width="98" height="24" rx="4" fill="rgba(139, 195, 74, 0.12)"
          stroke="#8BC34A" strokeWidth="1.1" />
        <path d="M12 12 l6 6 l14 -12" fill="none" stroke="#8BC34A" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
        <text x="42" y="15.4" fontSize="8" fontFamily="var(--font-mono)"
          fill="#8BC34A" fontWeight="700" letterSpacing="0.6">APPROVED</text>
      </g>
      {/* correction loop back to model */}
      <path d="M22 128 h84" stroke="#E9C46A" strokeWidth="0.9" fill="none"
        strokeDasharray="3 3" className="hitl-loop" />
      <path d="M28 132 l-6 -4 l6 -4" stroke="#E9C46A" strokeWidth="0.9" fill="none"
        strokeLinecap="round" />
      <text x="24" y="150" fontSize="6.4" fontFamily="var(--font-mono)"
        fill="rgba(233,196,106,0.85)" letterSpacing="0.6">RETRAIN LOOP</text>
    </svg>
  )
}

function ValidationAnim() {
  // Sample rows scan-checked one by one, pass/fail marks appear.
  const rows = [
    { label: 'sample-0001', pass: true },
    { label: 'sample-0002', pass: true },
    { label: 'sample-0003', pass: false },
    { label: 'sample-0004', pass: true },
    { label: 'sample-0005', pass: true },
  ]
  return (
    <svg viewBox="0 0 220 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* header */}
      <g transform="translate(16 20)">
        <text fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.2"
          fill="rgba(246,235,218,0.55)">GOLD-SET · VALIDATION</text>
        <g transform="translate(150 -4)">
          <rect width="42" height="14" rx="3" fill="#FF6B35" />
          <text x="21" y="10" fontSize="7.6" fontFamily="var(--font-mono)"
            fill="#0A0805" fontWeight="700" textAnchor="middle">4 / 5 ✓</text>
        </g>
      </g>
      {/* scan line sweep */}
      <rect className="val-scan" x="0" y="40" width="220" height="20"
        fill="url(#val-scan-g)" />
      <defs>
        <linearGradient id="val-scan-g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,143,92,0)" />
          <stop offset="0.5" stopColor="rgba(255,143,92,0.35)" />
          <stop offset="1" stopColor="rgba(255,143,92,0)" />
        </linearGradient>
      </defs>
      {/* rows */}
      {rows.map((r, i) => {
        const y = 46 + i * 22
        return (
          <g key={r.label} transform={`translate(16 ${y})`}>
            <rect x="0" y="0" width="152" height="16" rx="3"
              fill="rgba(246,235,218,0.04)" stroke="rgba(246,235,218,0.14)" strokeWidth="0.6" />
            <text x="8" y="11" fontSize="7.4" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.8)">{r.label}</text>
            <text x="98" y="11" fontSize="6.6" fontFamily="var(--font-mono)"
              fill="rgba(246,235,218,0.4)">v3.4.1</text>
            {/* mark — appears with row delay */}
            <g className="val-mark" style={{ animationDelay: `${(0.4 + i * 0.5).toFixed(2)}s` }}
              transform="translate(158 8)">
              {r.pass ? (
                <>
                  <circle r="7" fill="rgba(139,195,74,0.16)" stroke="#8BC34A" strokeWidth="1.1" />
                  <path d="M-3 0 l2 2 l4 -4" fill="none" stroke="#8BC34A" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <circle r="7" fill="rgba(232,107,69,0.16)" stroke="#E86B45" strokeWidth="1.1" />
                  <path d="M-3 -3 l6 6 M3 -3 l-6 6" stroke="#E86B45" strokeWidth="1.4"
                    strokeLinecap="round" />
                </>
              )}
            </g>
          </g>
        )
      })}
    </svg>
  )
}

function AssistedAnim() {
  // Raw sample → model pre-labels → reviewer polishes.
  return (
    <svg viewBox="0 0 220 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* raw sample block */}
      <g transform="translate(14 46)">
        <rect width="52" height="60" rx="4" fill="rgba(246,235,218,0.05)"
          stroke="rgba(246,235,218,0.2)" strokeWidth="0.8" strokeDasharray="3 3" />
        {/* placeholder pixels */}
        {Array.from({ length: 3 }).flatMap((_, r) =>
          Array.from({ length: 4 }).map((_, c) => (
            <rect key={`${r}-${c}`} x={6 + c * 10} y={10 + r * 14} width="8" height="10" rx="1"
              fill={`rgba(246,235,218,${0.08 + (r + c) * 0.03})`} />
          )),
        )}
        <text x="26" y="76" fontSize="6.4" fontFamily="var(--font-mono)"
          fill="rgba(246,235,218,0.55)" textAnchor="middle" letterSpacing="1">RAW</text>
      </g>
      {/* arrow 1 */}
      <path d="M74 76 h20 m-6 -4 l6 4 l-6 4" stroke="#FF8F5C" strokeWidth="1.1"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* model draws pre-labels */}
      <g transform="translate(102 46)">
        <rect width="52" height="60" rx="4" fill="rgba(255,143,92,0.06)"
          stroke="#FF8F5C" strokeWidth="1.2" />
        {/* auto boxes appearing */}
        {[
          { x: 6, y: 8, w: 20, h: 12, d: 0 },
          { x: 30, y: 6, w: 16, h: 14, d: 0.4 },
          { x: 8, y: 26, w: 12, h: 16, d: 0.8 },
          { x: 26, y: 30, w: 20, h: 14, d: 1.2 },
        ].map((b, i) => (
          <rect key={i} className="ast-autobox" style={{ animationDelay: `${b.d}s` }}
            x={b.x} y={b.y} width={b.w} height={b.h} rx="1.4" fill="none"
            stroke="#E9C46A" strokeWidth="1.1" strokeDasharray="3 2" />
        ))}
        <text x="26" y="55" fontSize="6.4" fontFamily="var(--font-mono)"
          fill="#FFB98A" textAnchor="middle" letterSpacing="1">MODEL</text>
      </g>
      {/* arrow 2 */}
      <path d="M162 76 h20 m-6 -4 l6 4 l-6 4" stroke="#FF8F5C" strokeWidth="1.1"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* reviewer polishes */}
      <g transform="translate(190 46)">
        <rect width="16" height="60" rx="4" fill="rgba(255,107,53,0.10)"
          stroke="#FF6B35" strokeWidth="1.2" />
        <circle cx="8" cy="18" r="4" fill="none" stroke="#FFB98A" strokeWidth="1" />
        <path d="M2 40 c 0 -5 3 -8 6 -8 c 3 0 6 3 6 8" fill="none" stroke="#FFB98A" strokeWidth="1" />
        <path d="M2 50 l3 3 l6 -6" stroke="#8BC34A" strokeWidth="1.3" fill="none"
          strokeLinecap="round" strokeLinejoin="round" className="ast-check"
          transform="translate(0 3)" />
      </g>
      {/* throughput chip */}
      <g transform="translate(66 130)">
        <rect width="88" height="16" rx="3" fill="rgba(255,107,53,0.12)"
          stroke="#FF8F5C" strokeWidth="0.9" />
        <text x="44" y="11" fontSize="7.4" fontFamily="var(--font-mono)"
          fill="#FFB98A" fontWeight="700" textAnchor="middle" letterSpacing="0.6">
          6× THROUGHPUT
        </text>
      </g>
    </svg>
  )
}

function GuidelineAnim() {
  // Guideline document with rules turning into a calibrated reviewer bench.
  // Rule strings are kept short so they never spill outside the doc panel
  // and collide with the reviewer icons to the right.
  const rules = ['1. Bounds tight', '2. Flag occlusion', '3. Ambiguous → QA']
  return (
    <svg viewBox="0 0 240 180" className="annot-svg" aria-hidden preserveAspectRatio="xMidYMid meet">
      {/* doc — widened slightly to give the rule text more room */}
      <g transform="translate(14 20)">
        <path d="M0 0 h72 l10 10 v128 h-82 z" fill="rgba(246,235,218,0.05)"
          stroke="rgba(246,235,218,0.25)" strokeWidth="0.9" />
        <path d="M72 0 v10 h10" fill="none" stroke="rgba(246,235,218,0.32)" strokeWidth="0.9" />
        <text x="8" y="20" fontSize="7" fontFamily="var(--font-mono)"
          fill="rgba(246,235,218,0.7)" letterSpacing="1">GUIDELINE.MD</text>
        {rules.map((r, i) => (
          <g key={i} className="gl-rule" style={{ animationDelay: `${(0.3 + i * 0.55).toFixed(2)}s` }}>
            <text x="8" y={40 + i * 24} fontSize="6.6" fontFamily="var(--font-mono)"
              fill="#FFB98A" fontWeight="600">{r}</text>
            <line x1="6" y1={44 + i * 24} x2="74" y2={44 + i * 24}
              stroke="#E9C46A" strokeWidth="0.9" opacity="0.7" />
          </g>
        ))}
        {/* revision tag */}
        <g transform="translate(8 122)">
          <rect width="46" height="10" rx="2" fill="#FF6B35" />
          <text x="23" y="7.2" fontSize="6.2" fontFamily="var(--font-mono)"
            fill="#0A0805" fontWeight="700" textAnchor="middle">v2.3.1</text>
        </g>
      </g>
      {/* arrow into calibration bench — pushed right so it starts clear of the doc */}
      <path d="M100 90 h20 m-6 -4 l6 4 l-6 4" stroke="#FF8F5C" strokeWidth="1.1"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* reviewer bench — 4 seats, shifted right to clear the arrow */}
      <g transform="translate(130 30)">
        <text fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.2"
          fill="rgba(246,235,218,0.6)">CALIBRATED REVIEWERS</text>
        {[0, 1, 2, 3].map((i) => {
          const x = i * 24
          const yOff = i * 0.6
          return (
            <g key={i} transform={`translate(${x} ${18 + yOff})`}>
              <circle cx="10" cy="10" r="6" fill="none" stroke="#FFB98A" strokeWidth="1.1" />
              <path d="M0 30 c 0 -7 4 -12 10 -12 c 6 0 10 5 10 12" fill="none" stroke="#FFB98A" strokeWidth="1.1" />
              {/* agreement chip */}
              <g className="gl-chip" style={{ animationDelay: `${(0.9 + i * 0.28).toFixed(2)}s` }}
                transform="translate(2 40)">
                <rect width="16" height="8" rx="1.5" fill="#8BC34A" />
                <text x="8" y="6" fontSize="5.4" fontFamily="var(--font-mono)"
                  fill="#0A0805" fontWeight="700" textAnchor="middle">κ .9</text>
              </g>
            </g>
          )
        })}
        {/* agreement bar */}
        <g transform="translate(0 108)">
          <text fontFamily="var(--font-mono)" fontSize="6.6"
            fill="rgba(246,235,218,0.55)" y="-4">Inter-annotator agreement</text>
          <rect x="0" y="0" width="94" height="7" rx="3"
            fill="rgba(246,235,218,0.08)" />
          <rect className="gl-agree" x="0" y="0" width="0" height="7" rx="3" fill="#E9C46A" />
          <text x="94" y="-4" fontSize="6.6" fontFamily="var(--font-mono)"
            fill="rgba(246,235,218,0.55)" textAnchor="end">0.92</text>
        </g>
      </g>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────
//  Role catalogue
// ─────────────────────────────────────────────────────────────

type Role = {
  id: string
  Anim: ComponentType
  title: string
  blurb: string
  meta: string[]
}

const roles: Role[] = [
  {
    id: 'OP1',
    Anim: CollectionAnim,
    title: 'Raw data collection',
    blurb: 'Gathering text, images, audio and video from the sources you specify — with consent, provenance and coverage tracked end to end before a single label is applied.',
    meta: ['Sourcing', 'Consent'],
  },
  {
    id: 'OP2',
    Anim: SchemaAnim,
    title: 'Schema-driven labelling',
    blurb: 'Your labelling schema applied consistently at scale — every sample carries the exact tags your model was designed to consume, even as edge cases pile up.',
    meta: ['Taxonomy', 'Scale'],
  },
  {
    id: 'OP3',
    Anim: QaPipelineAnim,
    title: 'Pre- & post-labelling QA',
    blurb: 'Deduplication, redaction, normalisation and quality checks either side of labelling — no dirty data reaches your annotators, and no bad labels reach your model.',
    meta: ['QA', 'PII'],
  },
  {
    id: 'OP4',
    Anim: QualityScoreAnim,
    title: 'Annotation quality scoring',
    blurb: 'Precision, recall, F1 and inter-annotator agreement measured against annotated gold sets — the regression signal ship-blockers care about.',
    meta: ['Metrics', 'Gold set'],
  },
  {
    id: 'OP5',
    Anim: HitlAnim,
    title: 'Human-in-the-loop review',
    blurb: 'Reviewers correcting live model predictions in the loop — the safety net that turns a promising model into a production one, and produces correction sets for retraining.',
    meta: ['HITL', 'Correction'],
  },
  {
    id: 'OP6',
    Anim: ValidationAnim,
    title: 'Annotation validation',
    blurb: 'An independent second pass on annotation quality — guideline adherence, agreement scoring, and the sample-level defects that quietly ruin evaluation metrics.',
    meta: ['Audit', 'Guideline'],
  },
  {
    id: 'OP7',
    Anim: AssistedAnim,
    title: 'Model-assisted pre-labelling',
    blurb: 'Model-drafted labels that human reviewers polish — throughput without giving up the accuracy that matters at review time, tuned pipeline by pipeline.',
    meta: ['Throughput', 'Assisted'],
  },
  {
    id: 'OP8',
    Anim: GuidelineAnim,
    title: 'Guideline authoring & calibration',
    blurb: 'Written labelling guidelines, reviewer onboarding and calibration rounds — so the whole bench agrees on the same edge cases before they hit production data.',
    meta: ['Docs', 'Calibration'],
  },
]

// ─────────────────────────────────────────────────────────────
//  Section
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
//  Section
// ─────────────────────────────────────────────────────────────

function useReducedMotionQuery(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return desktop
}

type Mode = 'single' | 'all'

export function AnnotationOperationsSection() {
  const total = roles.length
  const pinRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [mode, setMode] = useState<Mode>('single')
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotionQuery()

  // Desktop pin + scroll-drive: use raw window scroll math (no
  // GSAP dep). Section is `total * 100vh` tall; the inner stage
  // sticks to the viewport top. Vertical scroll progress maps to
  // active slide index. Only active while `mode === 'single'`.
  useEffect(() => {
    if (!isDesktop || reduced) return
    if (mode !== 'single') return
    const pin = pinRef.current
    if (!pin) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = pin.getBoundingClientRect()
        const vh = window.innerHeight
        // Scrolled distance INTO the section (0 → totalScroll)
        const scrolled = Math.max(0, -rect.top)
        const totalScroll = pin.offsetHeight - vh
        if (totalScroll <= 0) return
        const p = Math.min(1, Math.max(0, scrolled / totalScroll))
        // Map [0..1] to slide index. Each slide gets equal share.
        const idx = Math.min(total - 1, Math.floor(p * total * 0.999))
        setActiveIdx(idx)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [isDesktop, reduced, total, mode])

  const jumpTo = (i: number) => {
    const pin = pinRef.current
    if (!pin) return
    const vh = window.innerHeight
    const totalScroll = pin.offsetHeight - vh
    const step = totalScroll / (total - 1)
    const targetY = pin.getBoundingClientRect().top + window.scrollY + i * step
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    // Reset active index so the carousel starts clean when we come
    // back from `all`. Scroll to the top of the section so the user
    // sees the switched layout from the start.
    setActiveIdx(0)
    requestAnimationFrame(() => {
      document
        .getElementById('annotation-operations')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const active = roles[activeIdx] ?? roles[0]
  const goldActive = activeIdx % 2 === 0
  const accent = goldActive ? '#E9C46A' : '#FF8F5C'
  const accentSoft = goldActive ? 'rgba(233,196,106,0.14)' : 'rgba(255,143,92,0.14)'

  return (
    <section
      id="annotation-operations"
      className="border-t border-white/[0.05]"
      data-scroll-anchor="operations"
    >
      {/* Header — sits above the pinned stage on desktop, above the
          swipeable strip on mobile. Contains the "View all" chip. */}
      <div className="mx-auto max-w-container container-pad pt-section">
        <FadeIn>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <SectionLabel className="mb-4">The operations bench</SectionLabel>
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
                Eight operations{' '}
                <span className="editorial" style={{ color: 'var(--color-gold, #E9C46A)' }}>
                  behind every dataset
                </span>{' '}
                we deliver.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <p
                className="max-w-md text-[15.5px] leading-relaxed lg:text-right"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
              >
                {mode === 'single'
                  ? 'Scroll to walk the bench card by card, or open all eight at once. The disciplined operations that surround every labelling engagement.'
                  : 'Every operation laid out in a vertical timeline. Flip back to the guided one-at-a-time walkthrough any time.'}
              </p>

              {/* Mode toggle — two pill segments in one control */}
              <div
                role="tablist"
                aria-label="Operations view mode"
                className="ops-mode inline-flex items-center gap-1 rounded-full border p-1"
                style={{
                  borderColor: 'var(--border-glass-strong)',
                  background: 'var(--card-surface)',
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'single'}
                  onClick={() => switchMode('single')}
                  className={`ops-mode-btn ${mode === 'single' ? 'is-on' : ''}`}
                >
                  <ChevronRight size={13} />
                  ONE AT A TIME
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'all'}
                  onClick={() => switchMode('all')}
                  className={`ops-mode-btn ${mode === 'all' ? 'is-on' : ''}`}
                >
                  <LayoutGrid size={13} />
                  VIEW ALL 08
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ─── SINGLE MODE ─── */}
      {mode === 'single' && !reduced && (
        <div
          ref={pinRef}
          className="ops-pin hidden lg:block"
          style={{ height: `${total * 100}vh` }}
        >
          <div ref={stageRef} className="ops-pin-inner">
            <div
              className="ops-stage-card"
              style={{
                ['--annot-accent' as string]: accent,
                ['--annot-accent-soft' as string]: accentSoft,
              }}
            >
              {/* Slides — all rendered, but only active is visible */}
              {roles.map((role, i) => {
                const state = i === activeIdx ? 'active' : i < activeIdx ? 'past' : 'next'
                return (
                  <div key={role.id} className="ops-slide" data-state={state}>
                    <div className="ops-slide-anim annot-anim">
                      <role.Anim />
                    </div>
                    <div className="ops-slide-copy">
                      <span
                        className="text-[11px] font-semibold uppercase"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          letterSpacing: '0.22em',
                          color: i % 2 === 0 ? '#E9C46A' : '#FF8F5C',
                        }}
                      >
                        Operation {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className="mt-3"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1.8rem, 1.4rem + 1.4vw, 2.5rem)',
                          fontWeight: 400,
                          letterSpacing: '-0.025em',
                          color: 'var(--text-strong)',
                          lineHeight: 1.1,
                        }}
                      >
                        {role.title}
                      </h3>
                      <p
                        className="mt-4 text-[15.5px] leading-relaxed"
                        style={{
                          fontFamily: 'var(--font-body)',
                          color: 'var(--text-body)',
                          maxWidth: '36rem',
                        }}
                      >
                        {role.blurb}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-1.5">
                        {role.meta.map((m) => (
                          <span
                            key={m}
                            className="rounded-full border px-2.5 py-[3px] text-[10px] font-medium uppercase"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              letterSpacing: '0.14em',
                              borderColor: 'var(--border-glass)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Progress + prev/next controls */}
            <div className="ops-controls">
              <button
                type="button"
                onClick={() => jumpTo(Math.max(0, activeIdx - 1))}
                disabled={activeIdx === 0}
                aria-label="Previous operation"
                className="ops-nav-btn"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="ops-progress" aria-live="polite">
                <span className="ops-progress-num">{String(activeIdx + 1).padStart(2, '0')}</span>
                <span className="ops-progress-sep">/</span>
                <span className="ops-progress-tot">{String(total).padStart(2, '0')}</span>
                <span className="ops-progress-title">{active.title}</span>
              </div>
              <div className="ops-progress-dots" role="tablist">
                {roles.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => jumpTo(i)}
                    role="tab"
                    aria-selected={i === activeIdx}
                    aria-label={`Go to ${r.title}`}
                    className={`ops-dot ${i === activeIdx ? 'is-active' : ''}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => jumpTo(Math.min(total - 1, activeIdx + 1))}
                disabled={activeIdx === total - 1}
                aria-label="Next operation"
                className="ops-nav-btn"
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Scroll hint — fades away after first advance */}
            <div className={`ops-hint ${activeIdx > 0 ? 'is-hidden' : ''}`} aria-hidden>
              scroll to advance
              <span className="ops-hint-arrow">↓</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── SINGLE MODE — Mobile snap-scroll strip ─── */}
      {mode === 'single' && (
      <div className="ops-mobile lg:hidden">
        <div className="ops-mobile-track">
          {roles.map((role, i) => (
            <article
              key={role.id}
              className="ops-mobile-slide"
              style={{
                ['--annot-accent' as string]: i % 2 === 0 ? '#E9C46A' : '#FF8F5C',
              }}
            >
              <div className="ops-slide-anim annot-anim">
                <role.Anim />
              </div>
              <div className="ops-mobile-copy">
                <span
                  className="text-[10px] font-semibold uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.2em',
                    color: i % 2 === 0 ? '#E9C46A' : '#FF8F5C',
                  }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <h3
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 1.15rem + 1vw, 1.8rem)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-strong)',
                    lineHeight: 1.15,
                  }}
                >
                  {role.title}
                </h3>
                <p
                  className="mt-2 text-[14px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
                >
                  {role.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="ops-mobile-hint">swipe →</div>
      </div>
      )}

      {/* ─── ALL MODE — vertical timeline (also used for reduced-motion) ─── */}
      {(mode === 'all' || reduced) && (
        <div className="mx-auto max-w-container container-pad pb-section pt-6 lg:pt-10">
          <div className="ops-timeline">
            <span aria-hidden className="ops-spine" />
            {roles.map((role, i) => {
              const flip = i % 2 === 1
              const gold = i % 2 === 0
              const accent = gold ? '#E9C46A' : '#FF8F5C'
              const accentSoft = gold ? 'rgba(233,196,106,0.14)' : 'rgba(255,143,92,0.14)'
              const num = String(i + 1).padStart(2, '0')
              return (
                <FadeIn key={role.id} delay={i * 0.04}>
                  <article
                    className="ops-row"
                    data-flip={flip ? 'true' : 'false'}
                    style={{
                      ['--annot-accent' as string]: accent,
                      ['--annot-accent-soft' as string]: accentSoft,
                    }}
                  >
                    <div className="ops-pip" aria-hidden>
                      <span className="ops-pip-ring" />
                      <span className="ops-pip-core">{num}</span>
                    </div>
                    <div className="ops-stage">
                      <div className="ops-anim annot-anim">
                        <role.Anim />
                      </div>
                      <div className="ops-copy">
                        <span
                          className="text-[10px] font-semibold uppercase"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.22em',
                            color: accent,
                          }}
                        >
                          Operation
                        </span>
                        <h3
                          className="mt-3"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.35rem, 1.05rem + 0.8vw, 1.75rem)',
                            fontWeight: 400,
                            letterSpacing: '-0.02em',
                            color: 'var(--text-strong)',
                            lineHeight: 1.15,
                          }}
                        >
                          {role.title}
                        </h3>
                        <p
                          className="mt-3 text-[14.5px] leading-relaxed"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: 'var(--text-body)',
                            maxWidth: '34rem',
                          }}
                        >
                          {role.blurb}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {role.meta.map((m) => (
                            <span
                              key={m}
                              className="rounded-full border px-2.5 py-[3px] text-[10px] font-medium uppercase"
                              style={{
                                fontFamily: 'var(--font-mono)',
                                letterSpacing: '0.14em',
                                borderColor: 'var(--border-glass)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

