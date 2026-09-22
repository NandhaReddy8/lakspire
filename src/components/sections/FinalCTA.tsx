'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { FinalCTAField } from '@/components/motion/FinalCTAField'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * FinalCTA
 * ────────
 * The closing call before the footer. Not a separate boxed animation —
 * the FinalCTAField weaves through the card behind the copy so the
 * animation IS part of the message. Adds a strong closing tagline
 * above the headline.
 */
export function FinalCTA() {
  const shouldReduce = useReducedMotion()
  const fadeUp = (delay: number) => ({
    initial: shouldReduce ? false : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="cta">
      <div className="mx-auto max-w-container container-pad">
        <div
          className="relative isolate overflow-hidden rounded-3xl border px-8 py-20 md:px-16 md:py-24"
          style={{
            borderColor: 'var(--border-glass)',
            background:
              'linear-gradient(150deg, rgba(255,107,53,0.10) 0%, rgba(233,196,106,0.05) 55%, rgba(20,16,13,0.4) 100%)',
            boxShadow:
              '0 30px 80px -30px rgba(255,107,53,0.35), inset 0 1px 0 0 var(--highlight-top)',
          }}
        >
          {/* Ambient warm bloom behind everything */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,107,53,0.14) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 10% 0%, rgba(244,162,97,0.10) 0%, transparent 60%)',
            }}
          />

          {/* Integrated animation — flowing paths + streaming packets +
              corner brackets that live UNDER the text, not beside it */}
          <FinalCTAField />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
            <motion.p
              {...fadeUp(0.02)}
              className="mb-4 text-[13px] font-bold uppercase"
              style={{
                letterSpacing: '0.16em',
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(90deg, #FFB86A, #FF6B35)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Get Started
            </motion.p>

            <motion.h2
              {...fadeUp(0.1)}
              className="mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 1.6rem + 2.5vw, 3.5rem)',
                fontWeight: 350,
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                color: 'var(--text-strong)',
              }}
            >
              <span className="text-gradient-primary">
                Let&apos;s turn your data <span className="editorial">into decisions</span>.
              </span>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>Tell us what you&apos;re building.</span>
            </motion.h2>

            <motion.p
              {...fadeUp(0.18)}
              className="mb-10 max-w-md text-[15px] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
            >
              No forms, no jargon — just a short conversation. We&apos;ll come back with a clear
              approach and a realistic path forward.
            </motion.p>

            <motion.div {...fadeUp(0.26)} className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-medium text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)',
                  boxShadow:
                    '0 0 0 1px rgba(255,107,53,0.35), 0 12px 32px -8px rgba(255,107,53,0.5)',
                }}
              >
                Start a Conversation
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.14] px-6 py-3 text-[14px] font-medium text-white/70 backdrop-blur-sm transition-all duration-200 hover:border-white/25 hover:text-white"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                View Services
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
