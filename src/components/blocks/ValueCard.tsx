'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface ValueCardProps {
  name: string
  body: string
  accent: string
  icon: ReactNode
}

/**
 * ValueCard
 * ─────────
 * A card style unique to the About page — visually distinct from the
 * pointer-tilt TiltCard used on Industries/Services and the FinalCTA
 * flowing arcs.
 *
 * Idle: a hairline accent line runs 30% along the top edge; a warm-
 * dark icon plate sits at top-left; body copy underneath.
 *
 * Hover: the accent line grows to 100% and brightens; an ember
 * gradient sweeps in from the left across the card as a background
 * reveal (screen-blend); the icon plate lifts slightly; the whole card
 * translates up 3px. Springs, not linear.
 */
export function ValueCard({ name, body, accent, icon }: ValueCardProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={false}
      whileHover={shouldReduce ? undefined : 'hover'}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6"
      style={{
        borderColor: 'var(--border-glass)',
        background: 'var(--card-surface)',
      }}
      variants={{
        hover: {
          y: -3,
          transition: { type: 'spring', stiffness: 260, damping: 20 },
        },
      }}
    >
      {/* Sweep — ember gradient reveals from the left on hover */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(105deg, ${accent}22 0%, ${accent}0d 40%, transparent 65%)`,
          transformOrigin: 'left',
          mixBlendMode: 'screen',
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        variants={{
          hover: {
            opacity: 1,
            scaleX: 1,
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      />

      {/* Top accent line — 30% by default, grows to 100% on hover */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${accent} 0%, ${accent} 55%, ${accent}80 85%, ${accent}00 100%)`,
          transformOrigin: 'left',
        }}
        initial={{ width: '30%' }}
        variants={{
          hover: {
            width: '100%',
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
          },
        }}
      />

      {/* Icon plate */}
      <motion.span
        className="icon-plate mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          color: accent,
          ['--plate-accent' as string]: accent,
        }}
        variants={{
          hover: {
            y: -2,
            boxShadow: `0 0 40px -6px ${accent}88, inset 0 1px 0 0 rgba(255,240,220,0.14)`,
            transition: { type: 'spring', stiffness: 260, damping: 22 },
          },
        }}
      >
        {icon}
      </motion.span>

      <p
        className="relative z-10 mb-2 text-[15px] font-medium"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-strong)',
          letterSpacing: '-0.01em',
        }}
      >
        {name}
      </p>
      <p
        className="relative z-10 text-[13.5px] leading-relaxed"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
      >
        {body}
      </p>

      {/* Corner index tag */}
      <motion.span
        aria-hidden="true"
        className="absolute right-4 top-4 text-[10px]"
        style={{
          fontFamily: 'var(--font-mono)',
          color: accent,
          letterSpacing: '0.16em',
        }}
        initial={{ opacity: 0.35 }}
        variants={{ hover: { opacity: 0.95, transition: { duration: 0.3 } } }}
      >
        ·
      </motion.span>
    </motion.div>
  )
}
