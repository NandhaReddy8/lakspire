/**
 * SecurityGlyphs
 * ──────────────
 * Hand-drawn SVG icons for the eight security & data-protection
 * practices on the Security page. Style matches IndustryGlyphs /
 * ValueGlyphs: 32×32 viewBox, currentColor strokes + accent fills,
 * shaped to feel deliberate (not stock).
 */

type GlyphProps = { className?: string; size?: number }

const s = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ─── Data confidentiality — sealed envelope with wax mark ─────────
export function ConfidentialityGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <rect x="4" y="9" width="24" height="17" rx="2" {...s} />
      <path d="M4 11 L16 20 L28 11" {...s} opacity="0.65" />
      <circle cx="16" cy="16" r="3.6" fill="currentColor" opacity="0.9" />
      <path d="M14.2 16 L15.6 17.4 L18 15" stroke="rgba(20,15,11,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// ─── Role-based access — three access tiers around a key ─────────
export function AccessGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11" {...s} opacity="0.35" strokeDasharray="2 3" />
      <circle cx="16" cy="16" r="6.5" {...s} opacity="0.55" />
      <circle cx="16" cy="16" r="2.4" fill="currentColor" />
      <circle cx="6"  cy="8"  r="1.6" fill="currentColor" opacity="0.75" />
      <circle cx="26" cy="10" r="1.6" fill="currentColor" opacity="0.55" />
      <circle cx="9"  cy="26" r="1.6" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

// ─── Secure transfer — locked link between two nodes ─────────
export function TransferGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="6"  cy="16" r="3" {...s} />
      <circle cx="26" cy="16" r="3" {...s} />
      <path d="M9 16 h14" {...s} opacity="0.65" strokeDasharray="2 2.5" />
      <rect x="13" y="12" width="6" height="8" rx="1.4" fill="currentColor" opacity="0.9" />
      <path d="M14.5 12 v-1.5 a1.5 1.5 0 0 1 3 0 V12" {...s} opacity="0.55" />
      <circle cx="16" cy="16.5" r="0.9" fill="rgba(20,15,11,0.9)" />
    </svg>
  )
}

// ─── Data handling procedures — labelled dossier ─────────
export function HandlingGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <path d="M8 5 h13 l4 4 v18 h-17 z" {...s} />
      <path d="M21 5 v4 h4" {...s} opacity="0.6" />
      <path d="M11 14 h10 M11 18 h10 M11 22 h6" {...s} opacity="0.55" strokeWidth="1.2" />
      <rect x="6" y="10" width="4" height="2" rx="0.4" fill="currentColor" opacity="0.85" />
      <rect x="6" y="16" width="4" height="2" rx="0.4" fill="currentColor" opacity="0.65" />
    </svg>
  )
}

// ─── QA & review — layered checkmark stack ─────────
export function ReviewGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <rect x="4" y="10" width="16" height="4" rx="0.6" fill="currentColor" opacity="0.35" />
      <rect x="4" y="16" width="16" height="4" rx="0.6" fill="currentColor" opacity="0.6" />
      <rect x="4" y="22" width="16" height="4" rx="0.6" fill="currentColor" opacity="0.85" />
      <circle cx="25" cy="12" r="4" fill="currentColor" opacity="0.35" />
      <circle cx="25" cy="18" r="4" fill="currentColor" opacity="0.65" />
      <circle cx="25" cy="24" r="4" fill="currentColor" opacity="0.95" />
      <path d="M23 24 l1.4 1.4 L27 22.6" stroke="rgba(20,15,11,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

// ─── Retention & deletion — hourglass fading ─────────
export function RetentionGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <path d="M8 4 h16 M8 28 h16" {...s} strokeWidth="1.6" />
      <path d="M9 4 c0 6 6 10 6 12 c0 2 -6 6 -6 12 h14 c0 -6 -6 -10 -6 -12 c0 -2 6 -6 6 -12 z" {...s} />
      <path d="M10.5 6 h11 l-5.5 8 z" fill="currentColor" opacity="0.85" />
      <path d="M14 24 h4" {...s} strokeWidth="1.6" opacity="0.6" />
      <circle cx="16" cy="20" r="0.9" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

// ─── Applicable data protection — jurisdictional pillar ─────────
export function ProtectionGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <path d="M4 10 L16 4 L28 10" {...s} strokeWidth="1.6" />
      <path d="M4 10 h24" {...s} strokeWidth="1.6" />
      <path d="M4 26 h24" {...s} strokeWidth="1.6" />
      <path d="M8 12 v13 M14 12 v13 M18 12 v13 M24 12 v13" {...s} opacity="0.75" />
      <circle cx="16" cy="10" r="1.4" fill="currentColor" />
    </svg>
  )
}

// ─── Client confidentiality — signed pact ─────────
export function PactGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <rect x="4" y="7" width="24" height="18" rx="2" {...s} />
      <path d="M8 12 h8 M8 16 h6" {...s} opacity="0.55" strokeWidth="1.2" />
      <path d="M18 22 c1 -3 2.4 -4.6 4 -4.6 c1.6 0 3 1.6 4 4.6" {...s} strokeWidth="1.6" />
      <circle cx="22" cy="15" r="2.4" fill="currentColor" opacity="0.9" />
    </svg>
  )
}

// ─── Compliance honesty (used in "what we don't claim") ─────────
export function TransparencyGlyph({ className, size = 26 }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11" {...s} />
      <path d="M16 10 v8" {...s} strokeWidth="1.8" />
      <circle cx="16" cy="22" r="1.2" fill="currentColor" />
      <path d="M6 6 l4 4 M22 6 l4 4" {...s} opacity="0.55" />
    </svg>
  )
}
