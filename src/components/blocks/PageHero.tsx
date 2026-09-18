'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { SectionLabel } from '@/components/blocks/SectionLabel'

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
}

/**
 * PageHero
 * ────────
 * Inner-page hero used across About/Services/Industries/AI/Security/
 * Contact. Smaller than the home hero — no big focal illustration —
 * but keeps the same warm ambient beam + ember typography grammar so
 * the whole site feels continuous.
 *
 * Enter on paint (initial → animate), not on scroll, so the copy
 * appears immediately when the visitor lands. `data-scroll-anchor`
 * for the ScrollJump indicator.
 */
export function PageHero({ eyebrow, title, subtitle, children }: PageHeroProps) {
  const shouldReduce = useReducedMotion()
  const ease = [0.16, 1, 0.3, 1] as const
  const fadeUp = (delay: number) => ({
    initial: shouldReduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section
      className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24"
      data-scroll-anchor="hero"
    >
      {/* Warm ambient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-gradient" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[420px] w-[820px] max-w-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.18) 0%, rgba(233,196,106,0.05) 40%, transparent 65%)',
          filter: 'blur(1px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-container container-pad">
        <div className="max-w-3xl">
          <motion.div {...fadeUp(0.05)}>
            <SectionLabel className="mb-5">{eyebrow}</SectionLabel>
          </motion.div>

          <motion.h1
            {...fadeUp(0.12)}
            className="mb-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 1.6rem + 2.8vw, 3.8rem)',
              fontWeight: 350,
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              color: 'var(--text-strong)',
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              {...fadeUp(0.2)}
              className="max-w-2xl text-[15.5px] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
            >
              {subtitle}
            </motion.p>
          )}

          {children && (
            <motion.div {...fadeUp(0.28)} className="mt-8">
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom scrim */}
      <div
        aria-hidden="true"
        className="themed-scrim-bottom pointer-events-none absolute bottom-0 left-0 right-0"
        style={{ height: '120px' }}
      />
    </section>
  )
}
