/**
 * IndustryGlyphs
 * ──────────────
 * Hand-drawn SVG icons for each of the seven industries listed on the
 * Industries page. Bigger than Lucide defaults and shaped to feel
 * particular to the sector — no generic stock icons.
 *
 * 32×32 viewBox with roughly 26px silhouette. Strokes and accent fills
 * use `currentColor` so the icon-plate accent tint carries through.
 */

type GlyphProps = { className?: string; size?: number }

const s = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ─── Healthcare — plus with heartbeat trace ─────────────
export function HealthcareGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 4 20 L 9 20 L 11 16 L 13 24 L 15 20 L 21 20" {...s} strokeWidth="1.6" opacity="0.7" />
      <rect x="19" y="6" width="8" height="20" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="16" y="13" width="14" height="6" rx="1.5" fill="currentColor" />
      <rect x="20" y="9" width="6" height="14" rx="1.5" fill="currentColor" />
      <circle cx="23" cy="16" r="1.2" fill="rgba(20,15,11,0.9)" />
    </svg>
  )
}

// ─── Financial Services — vault door with coin stack ───
export function FinanceGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* coin stack (left) */}
      <ellipse cx="8" cy="10" rx="5" ry="1.6" fill="currentColor" opacity="0.75" />
      <path d="M 3 10 L 3 14 A 5 1.6 0 0 0 13 14 L 13 10" {...s} opacity="0.7" />
      <ellipse cx="8" cy="14" rx="5" ry="1.6" fill="currentColor" opacity="0.85" />
      <path d="M 3 14 L 3 18 A 5 1.6 0 0 0 13 18 L 13 14" {...s} opacity="0.7" />
      <ellipse cx="8" cy="18" rx="5" ry="1.6" fill="currentColor" />
      {/* vault door (right) */}
      <rect x="17" y="6" width="12" height="20" rx="2" {...s} strokeWidth="1.5" />
      <circle cx="23" cy="16" r="4" {...s} opacity="0.85" />
      <circle cx="23" cy="16" r="1.2" fill="currentColor" />
      <path d="M 23 12 v -1.5 M 23 20 v 1.5 M 19 16 h -1.5 M 27 16 h 1.5" {...s} strokeWidth="1.4" opacity="0.55" />
    </svg>
  )
}

// ─── Technology — CPU chip with radiating traces ───────
export function TechnologyGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <rect x="10" y="10" width="12" height="12" rx="1.5" {...s} opacity="0.7" />
      <rect x="13" y="13" width="6" height="6" rx="0.8" fill="currentColor" opacity="0.9" />
      {/* pin traces */}
      {[
        'M 16 3 v 7 M 12 3 v 7 M 20 3 v 7',
        'M 16 22 v 7 M 12 22 v 7 M 20 22 v 7',
        'M 3 16 h 7 M 3 12 h 7 M 3 20 h 7',
        'M 22 16 h 7 M 22 12 h 7 M 22 20 h 7',
      ].map((d, i) => (
        <path key={i} d={d} {...s} strokeWidth="1.3" opacity="0.55" />
      ))}
      {/* pin nodes */}
      {[[12,3],[16,3],[20,3],[12,29],[16,29],[20,29],[3,12],[3,16],[3,20],[29,12],[29,16],[29,20]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="1" fill="currentColor" opacity="0.85" />
      ))}
    </svg>
  )
}

// ─── Retail & E-commerce — storefront with awning ───────
export function RetailGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* awning stripes */}
      <path d="M 4 8 L 6 4 L 10 4 L 8 8 Z" fill="currentColor" opacity="0.85" />
      <path d="M 8 8 L 10 4 L 14 4 L 12 8 Z" fill="currentColor" opacity="0.45" />
      <path d="M 12 8 L 14 4 L 18 4 L 16 8 Z" fill="currentColor" opacity="0.85" />
      <path d="M 16 8 L 18 4 L 22 4 L 20 8 Z" fill="currentColor" opacity="0.45" />
      <path d="M 20 8 L 22 4 L 26 4 L 24 8 Z" fill="currentColor" opacity="0.85" />
      <path d="M 24 8 L 26 4 L 28 4 L 28 8 Z" fill="currentColor" opacity="0.45" />
      {/* store body */}
      <rect x="6" y="8" width="20" height="20" {...s} opacity="0.75" />
      {/* door */}
      <rect x="13" y="16" width="6" height="12" fill="currentColor" opacity="0.35" />
      <circle cx="17.5" cy="22" r="0.6" fill="currentColor" />
      {/* windows */}
      <rect x="8" y="11" width="4" height="4" {...s} strokeWidth="1.3" opacity="0.6" />
      <rect x="20" y="11" width="4" height="4" {...s} strokeWidth="1.3" opacity="0.6" />
      <path d="M 5 28 h 22" {...s} strokeWidth="1.4" opacity="0.7" />
    </svg>
  )
}

// ─── Education — open book with bookmark ───────────────
export function EducationGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 4 8 L 16 6 L 16 26 L 4 24 Z" {...s} fill="currentColor" fillOpacity="0.18" />
      <path d="M 28 8 L 16 6 L 16 26 L 28 24 Z" {...s} fill="currentColor" fillOpacity="0.35" />
      {/* text lines left page */}
      <path d="M 7 12 h 6 M 7 15 h 6 M 7 18 h 4" {...s} strokeWidth="1.1" opacity="0.55" />
      {/* text lines right page */}
      <path d="M 19 12 h 6 M 19 15 h 6 M 19 18 h 6 M 19 21 h 4" {...s} strokeWidth="1.1" opacity="0.75" />
      {/* bookmark ribbon */}
      <path d="M 22 6 L 22 12 L 24 10 L 26 12 L 26 6" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

// ─── Professional Services — briefcase with monogram ───
export function ProfessionalGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* handle */}
      <path d="M 12 8 v -2 a 2 2 0 0 1 2 -2 h 4 a 2 2 0 0 1 2 2 v 2" {...s} opacity="0.8" />
      {/* body */}
      <rect x="5" y="8" width="22" height="18" rx="2" {...s} fill="currentColor" fillOpacity="0.15" />
      {/* seam */}
      <path d="M 5 16 h 22" {...s} strokeWidth="1.2" opacity="0.55" />
      {/* central lock plate */}
      <rect x="14" y="14" width="4" height="4" rx="0.6" fill="currentColor" opacity="0.9" />
      <path d="M 15.5 16 h 1" stroke="rgba(20,15,11,0.9)" strokeWidth="1.1" strokeLinecap="round" />
      {/* corner clasps */}
      <rect x="7" y="10" width="2.5" height="1.5" rx="0.3" fill="currentColor" opacity="0.55" />
      <rect x="22.5" y="10" width="2.5" height="1.5" rx="0.3" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

// ─── Public Sector — classical building with columns ───
export function PublicSectorGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* pediment */}
      <path d="M 3 12 L 16 4 L 29 12 Z" fill="currentColor" opacity="0.7" />
      <path d="M 3 12 L 16 4 L 29 12" {...s} strokeWidth="1.3" />
      {/* frieze */}
      <rect x="3" y="12" width="26" height="2.5" fill="currentColor" opacity="0.85" />
      {/* columns */}
      {[6, 12, 18, 24].map((x, i) => (
        <g key={i}>
          <rect x={x} y="14.5" width="3" height="9" fill="currentColor" opacity="0.8" />
          <path d={`M ${x - 0.4} 14.5 h 3.8`} {...s} strokeWidth="1" opacity="0.7" />
          <path d={`M ${x - 0.4} 23.5 h 3.8`} {...s} strokeWidth="1" opacity="0.7" />
        </g>
      ))}
      {/* base + steps */}
      <rect x="2" y="24" width="28" height="2" fill="currentColor" opacity="0.85" />
      <rect x="1" y="26" width="30" height="2" fill="currentColor" opacity="0.55" />
      {/* small star on pediment */}
      <circle cx="16" cy="10" r="1" fill="rgba(255,240,220,0.85)" />
    </svg>
  )
}
