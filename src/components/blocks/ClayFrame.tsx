'use client'

import { CSSProperties, ReactNode } from 'react'

/**
 * ClayFrame
 * ─────────
 * Content sits in a normal rounded rectangle (no weird clipping of the
 * illustration inside). Behind it, TWO distinct organic blob plates
 * peek out at rotated angles — those blobs are the image-#6 reference
 * (multiple soft shapes stacked around a bigger visual). All three
 * plates carry heavy ember box-shadow that bleeds out in every
 * direction without being clipped.
 *
 * Variants pick different blob silhouettes / rotations so each section
 * feels distinct — but the FRONT is always a clean rounded rectangle
 * so the illustration inside never gets cut off.
 */

type Variant = 'pebble' | 'wave' | 'petal' | 'drop'

interface ClayFrameProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  variant?: Variant
}

// Two back-blob configs per variant: [radius, rotation-deg, inset, x-offset, y-offset]
const VARIANTS: Record<
  Variant,
  {
    backA: { radius: string; rotate: number; inset: number; dx: number; dy: number }
    backB: { radius: string; rotate: number; inset: number; dx: number; dy: number }
  }
> = {
  pebble: {
    backA: { radius: '62% 38% 55% 45% / 45% 60% 40% 55%', rotate: 8, inset: -22, dx: -14, dy: -18 },
    backB: { radius: '40% 60% 45% 55% / 55% 45% 60% 40%', rotate: -6, inset: -18, dx: 16, dy: 20 },
  },
  wave: {
    backA: { radius: '70% 30% 55% 45% / 50% 30% 70% 50%', rotate: -6, inset: -24, dx: -16, dy: -14 },
    backB: { radius: '35% 65% 50% 50% / 55% 65% 35% 45%', rotate: 5, inset: -18, dx: 18, dy: 18 },
  },
  petal: {
    backA: { radius: '70% 30% 70% 30% / 30% 70% 30% 70%', rotate: 10, inset: -24, dx: -18, dy: -20 },
    backB: { radius: '30% 70% 30% 70% / 70% 30% 70% 30%', rotate: -8, inset: -20, dx: 20, dy: 18 },
  },
  drop: {
    backA: { radius: '45% 55% 65% 35% / 60% 40% 55% 45%', rotate: -10, inset: -24, dx: -20, dy: 8 },
    backB: { radius: '55% 45% 35% 65% / 40% 60% 45% 55%', rotate: 8, inset: -20, dx: 18, dy: -18 },
  },
}

export function ClayFrame({
  children,
  className = '',
  style,
  variant = 'pebble',
}: ClayFrameProps) {
  const { backA, backB } = VARIANTS[variant]

  return (
    <div
      className={`clay-frame ${className}`}
      style={{
        position: 'relative',
        isolation: 'isolate',
        ...style,
      }}
    >
      {/* Ambient warm bloom — sits BEHIND the plates so it doesn't
          wash out the animation inside. Softer intensity keeps the
          content the star; the ember is delivered mostly through the
          per-plate box-shadows. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: -46,
          zIndex: -1,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,107,53,0.22) 0%, rgba(244,162,97,0.08) 40%, transparent 72%)',
          filter: 'blur(22px)',
          pointerEvents: 'none',
        }}
      />

      {/* Back blob A — peeks out from top-left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: backA.inset,
          transform: `translate(${backA.dx}px, ${backA.dy}px) rotate(${backA.rotate}deg)`,
          borderRadius: backA.radius,
          background: 'linear-gradient(155deg, #22160F 0%, #14100B 100%)',
          boxShadow:
            '0 30px 60px -18px rgba(255, 107, 53, 0.50), 0 68px 120px -34px rgba(255, 143, 92, 0.35)',
          opacity: 0.9,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Back blob B — peeks out from bottom-right, different silhouette */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: backB.inset,
          transform: `translate(${backB.dx}px, ${backB.dy}px) rotate(${backB.rotate}deg)`,
          borderRadius: backB.radius,
          background: 'linear-gradient(160deg, #2A1D14 0%, #1B1310 100%)',
          boxShadow:
            '0 26px 54px -16px rgba(244, 162, 97, 0.44), 0 56px 110px -28px rgba(255, 143, 92, 0.30)',
          opacity: 0.94,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Front card — normal rounded rectangle. Content is NEVER clipped
          by a weird blob edge; the illustration renders comfortably
          inside a regular rectangle. .illust-frame keeps the SVG
          neutral-color shim working in light mode. */}
      <div
        className="illust-frame"
        style={{
          position: 'relative',
          zIndex: 2,
          borderRadius: 24,
          background: 'linear-gradient(160deg, #1A130E 0%, #241811 100%)',
          border: '1px solid rgba(255, 143, 92, 0.28)',
          padding: 'clamp(20px, 2.4vw, 32px)',
          boxShadow:
            '0 30px 56px -14px rgba(255, 107, 53, 0.60), 0 58px 118px -30px rgba(255, 143, 92, 0.42), inset 0 1px 0 0 rgba(255, 240, 220, 0.12)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
