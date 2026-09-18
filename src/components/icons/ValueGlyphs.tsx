/**
 * ValueGlyphs
 * ───────────
 * Custom SVG glyphs for the About page — Mission/Vision and each of
 * the six Values. Deliberately hand-drawn silhouettes so they don't
 * read as stock Lucide "AI icons." Every glyph uses currentColor and
 * strokes/fills in warm ember palette so the icon-plate accent tint
 * carries through automatically.
 *
 * All glyphs share a 24×24 viewBox and roughly 20px silhouette so
 * they render at parity in the icon-plate.
 */

type GlyphProps = { className?: string; size?: number }

const strokeProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.35,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ─── Mission — compass arrow ─────────────────────────────
export function MissionGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...strokeProps} opacity="0.55" />
      <path d="M 12 3 v 2 M 12 19 v 2 M 3 12 h 2 M 19 12 h 2" {...strokeProps} opacity="0.4" />
      <path d="M 12 5 L 15 12 L 12 19 L 9 12 Z" fill="currentColor" opacity="0.35" />
      <path d="M 12 5 L 15 12 L 12 12 Z" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  )
}

// ─── Vision — horizon eye ───────────────────────────────
export function VisionGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 2.5 12 C 5 6 9 4 12 4 C 15 4 19 6 21.5 12 C 19 18 15 20 12 20 C 9 20 5 18 2.5 12 Z" {...strokeProps} opacity="0.7" />
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.28" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      <circle cx="13.1" cy="10.9" r="0.9" fill="rgba(250,245,238,0.85)" />
      <path d="M 4 12 h 1 M 19 12 h 1" {...strokeProps} opacity="0.4" />
    </svg>
  )
}

// ─── Accuracy — crosshair bullseye ──────────────────────
export function AccuracyGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" {...strokeProps} opacity="0.4" />
      <circle cx="12" cy="12" r="5.5" {...strokeProps} opacity="0.7" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <path d="M 12 1.5 v 3 M 12 19.5 v 3 M 1.5 12 h 3 M 19.5 12 h 3" {...strokeProps} opacity="0.55" />
    </svg>
  )
}

// ─── Integrity — handshake / seal ──────────────────────
export function IntegrityGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 3 8 L 8 5 L 12 7 L 16 5 L 21 8" {...strokeProps} />
      <path d="M 3 8 v 8 L 8 19 L 12 17 L 16 19 L 21 16 V 8" {...strokeProps} opacity="0.7" />
      <path d="M 8 5 v 14 M 16 5 v 14" {...strokeProps} opacity="0.35" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

// ─── Security — shield with tick ───────────────────────
export function SecurityGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 12 2.5 L 4 5.5 v 6.2 c 0 4.6 3.2 8.6 8 9.8 c 4.8 -1.2 8 -5.2 8 -9.8 V 5.5 L 12 2.5 z" {...strokeProps} opacity="0.75" />
      <path d="M 8 12 L 11 15 L 16 9.5" {...strokeProps} strokeWidth="1.6" />
      <circle cx="12" cy="9" r="0.9" fill="currentColor" opacity="0.6" />
    </svg>
  )
}

// ─── Collaboration — interlocked circles ───────────────
export function CollaborationGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="9" cy="12" r="6" {...strokeProps} opacity="0.85" />
      <circle cx="15" cy="12" r="6" {...strokeProps} opacity="0.85" />
      <path d="M 12 7.5 v 9" {...strokeProps} opacity="0.6" />
      <circle cx="9" cy="12" r="1.4" fill="currentColor" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" />
    </svg>
  )
}

// ─── Adaptability — flowing curve arrow ────────────────
export function AdaptabilityGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 3 17 C 6 17 6 7 10 7 C 14 7 14 17 18 17" {...strokeProps} strokeWidth="1.5" />
      <path d="M 15 14 L 18 17 L 15 20" {...strokeProps} strokeWidth="1.5" />
      <circle cx="3" cy="17" r="1.6" fill="currentColor" opacity="0.65" />
    </svg>
  )
}

// ─── Continuous Improvement — circular loop arrow ──────
export function ImprovementGlyph({ className, size = 20 }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M 20 12 A 8 8 0 1 1 12 4" {...strokeProps} strokeWidth="1.55" />
      <path d="M 12 4 L 12 8 M 12 4 L 16 4" {...strokeProps} strokeWidth="1.55" />
      <path d="M 4 12 A 8 8 0 0 0 12 20" {...strokeProps} strokeWidth="1.55" opacity="0.6" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}
