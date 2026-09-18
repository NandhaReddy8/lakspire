/**
 * ServiceGlyphs
 * ─────────────
 * Custom SVG icons for the four capability groups on the Services page.
 * 32×32 viewBox, distinctive shapes per group so they don't read as
 * generic tech-stock icons.
 */

type GlyphProps = { className?: string; size?: number }

const s = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ─── Data Services — stacked database with flowing dots ─
export function DataServicesGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* database stack */}
      <ellipse cx="10" cy="7" rx="6" ry="2" fill="currentColor" opacity="0.85" />
      <path d="M 4 7 v 5 A 6 2 0 0 0 16 12 V 7" {...s} opacity="0.75" />
      <ellipse cx="10" cy="12" rx="6" ry="2" fill="currentColor" opacity="0.6" />
      <path d="M 4 12 v 5 A 6 2 0 0 0 16 17 V 12" {...s} opacity="0.7" />
      <ellipse cx="10" cy="17" rx="6" ry="2" fill="currentColor" opacity="0.85" />
      <path d="M 4 17 v 5 A 6 2 0 0 0 16 22 V 17" {...s} opacity="0.65" />
      <ellipse cx="10" cy="22" rx="6" ry="2" fill="currentColor" opacity="0.55" />
      {/* flow to destination */}
      <path d="M 16 15 L 22 15" {...s} strokeDasharray="2 3" opacity="0.75" />
      <path d="M 20 12 L 23 15 L 20 18" {...s} strokeWidth="1.4" />
      {/* destination box */}
      <rect x="23" y="9" width="7" height="14" rx="1.5" {...s} fill="currentColor" fillOpacity="0.2" />
      <path d="M 25 13 h 3 M 25 16 h 3 M 25 19 h 2" {...s} strokeWidth="1.1" opacity="0.7" />
    </svg>
  )
}

// ─── Analytics & Reporting — bar chart with magnifier ──
export function AnalyticsGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* baseline */}
      <path d="M 3 25 h 22" {...s} strokeWidth="1.4" opacity="0.55" />
      {/* bars */}
      <rect x="5" y="19" width="3" height="6" fill="currentColor" opacity="0.55" />
      <rect x="10" y="14" width="3" height="11" fill="currentColor" opacity="0.75" />
      <rect x="15" y="10" width="3" height="15" fill="currentColor" opacity="0.9" />
      <rect x="20" y="16" width="3" height="9" fill="currentColor" opacity="0.55" />
      {/* trend line rising */}
      <path d="M 6 20 L 11 15 L 16 11 L 21 17" {...s} strokeWidth="1.4" opacity="0.9" />
      <circle cx="16" cy="11" r="1.4" fill="currentColor" />
      {/* magnifier over top-right */}
      <circle cx="24" cy="10" r="4.5" {...s} strokeWidth="1.6" opacity="0.9" />
      <path d="M 27.2 13.2 L 30 16" {...s} strokeWidth="1.8" />
      <path d="M 22 10 h 4 M 24 8 v 4" {...s} strokeWidth="1.2" opacity="0.6" />
    </svg>
  )
}

// ─── AI & ML Data — neural network node cluster ────────
export function AIMLGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* connections behind nodes */}
      {[
        'M 6 8 L 16 16',
        'M 6 24 L 16 16',
        'M 26 8 L 16 16',
        'M 26 24 L 16 16',
        'M 6 16 L 16 16',
        'M 16 6 L 16 16',
        'M 16 26 L 16 16',
      ].map((d, i) => (
        <path key={i} d={d} {...s} strokeWidth="1" opacity="0.5" strokeDasharray="1.5 3" />
      ))}
      {/* nodes */}
      {[[6,8],[6,24],[26,8],[26,24],[6,16],[16,6],[16,26]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="currentColor" opacity="0.75" />
      ))}
      {/* central node — larger, filled */}
      <circle cx="16" cy="16" r="4" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="rgba(20,15,11,0.9)" />
    </svg>
  )
}

// ─── Business Support — clipboard with check + support wave ─
export function BusinessSupportGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      {/* clipboard body */}
      <rect x="7" y="6" width="18" height="22" rx="2" {...s} fill="currentColor" fillOpacity="0.15" />
      {/* clipboard clip */}
      <rect x="12" y="3" width="8" height="5" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="13.5" y="4" width="5" height="2.5" rx="0.4" fill="rgba(20,15,11,0.9)" />
      {/* rows */}
      <path d="M 11 14 h 10 M 11 18 h 10 M 11 22 h 6" {...s} strokeWidth="1.2" opacity="0.55" />
      {/* prominent check disc bottom-right */}
      <circle cx="23" cy="24" r="5" fill="currentColor" />
      <path d="M 20.5 24 L 22.5 26 L 25.5 22.5" stroke="rgba(20,15,11,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
