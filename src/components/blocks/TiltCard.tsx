'use client'

import { CSSProperties, ReactNode, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Peak rotation in degrees at the card corners. Default 6 — subtle. */
  maxTilt?: number
  /** How high the card lifts on hover in px. Default 6. */
  lift?: number
}

/**
 * TiltCard
 * ────────
 * Pointer-tracked 3D tilt wrapper for cards. As the cursor moves across
 * the card, it tilts subtly on X/Y based on cursor position (spring-
 * eased), lifts a few pixels on hover, and a warm ember gloss follows
 * the pointer as a highlight overlay. Falls back to a static wrapper
 * under prefers-reduced-motion.
 *
 * Content inside sits on a preserve-3d transform, so shadows and
 * borders on the child cards stay visually anchored to the tilted card.
 */
export function TiltCard({
  children,
  className = '',
  style,
  maxTilt = 6,
  lift = 6,
}: TiltCardProps) {
  const shouldReduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Normalised cursor position within the card (-0.5 to 0.5)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 260, damping: 22, mass: 0.6 }
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig)
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig)
  const translateY = useSpring(0, springConfig)

  // Track the highlight position as raw CSS percentages
  const highlightX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig)
  const highlightY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onEnter = () => {
    if (shouldReduce) return
    translateY.set(-lift)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
    translateY.set(0)
  }

  if (shouldReduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 1100,
        rotateX,
        rotateY,
        y: translateY,
        willChange: 'transform',
        ...style,
      }}
    >
      {/* Ember gloss that follows the pointer — sits above the card
          content, mix-blend so it lifts existing colour rather than
          washing it out. Aria-hidden. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          background: useTransform(
            [highlightX, highlightY],
            ([hx, hy]) =>
              `radial-gradient(220px circle at ${hx}% ${hy}%, rgba(255,143,92,0.22), rgba(244,162,97,0.08) 40%, transparent 60%)`,
          ),
          mixBlendMode: 'screen',
          transform: 'translateZ(1px)',
        }}
      />
      {children}
    </motion.div>
  )
}
