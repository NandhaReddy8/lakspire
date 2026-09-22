'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { HeroAnnotationField } from '@/components/motion/HeroAnnotationField'
import { HeroWorkspaceScene } from '@/components/motion/HeroWorkspaceScene'

/**
 * HeroSection
 * ────────────
 * Two-column composition. Left column: copy. Right column: a live
 * annotation workspace (HeroWorkspaceScene) that shows a neural
 * processing pipeline being annotated in real time — bounding boxes
 * cycling with labels, progress ring ticking, metrics streaming, all
 * cursor-interactive. The workspace has NO card container — soft
 * radial fades blend it into the hero atmosphere.
 *
 * Behind everything: the ambient HeroAnnotationField (sparse dots +
 * scan lines + halo + reticle) so the whole hero feels alive.
 *
 * Motion is inline initial → animate — CTAs land on paint, not on scroll.
 */

const ease = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const shouldReduce = useReducedMotion()

  const fadeUp = (delay: number) => ({
    initial: shouldReduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  })

  return (
    <section
      className="relative isolate overflow-hidden pt-24 lg:min-h-[92svh]"
      data-scroll-anchor="hero"
    >
      {/* Warm ambient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hero-gradient" />

      {/* Top center accent beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[500px] w-[900px] max-w-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.22) 0%, rgba(233,196,106,0.06) 40%, transparent 65%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Ambient annotation field — sparse dots + scan lines + halo */}
      <HeroAnnotationField />

      <div className="relative z-10 mx-auto max-w-container container-pad">
        <div className="grid grid-cols-1 items-start gap-10 py-10 lg:min-h-[calc(92svh-6rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.34fr)] lg:items-center lg:gap-10">
          {/* Left: copy.
              Vertical rhythm tightened (mb-5→4, mb-6→4, mb-8→6, mt-10→7)
              and subtitle widened (max-w-lg → max-w-xl) so the whole
              stack — title, description, both CTAs and the three stat
              tiles — always lands inside the initial viewport instead
              of being pushed below the fold on shorter screens. */}
          <div className="flex flex-col">
            <motion.p
              {...fadeUp(0.05)}
              className="hero-eyebrow mb-4 text-[14.5px] font-extrabold uppercase"
              style={{
                letterSpacing: '0.16em',
                fontFamily: 'var(--font-body)',
              }}
            >
              B2B Data & Technology Services
            </motion.p>

            <motion.h1
              {...fadeUp(0.12)}
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 1.6rem + 2.6vw, 3.8rem)',
                fontWeight: 350,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              <span className="text-gradient-primary">
                Turning Data Into <span className="editorial">Insight</span>.
              </span>{' '}
              <span style={{ color: 'var(--text-muted)' }}>Powering Better Decisions.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mb-6 max-w-xl text-[15px] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
            >
              Lakspire delivers data processing, management, analytics and AI-enabled solutions that
              help organisations transform complex information into reliable, actionable insights.
            </motion.p>

            <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)',
                  boxShadow:
                    '0 0 0 1px rgba(255,107,53,0.3), 0 10px 30px -6px rgba(255,107,53,0.4)',
                }}
              >
                Explore Our Services
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/[0.12] px-5 py-2.5 text-[14px] font-medium text-white/65 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:text-white/85"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Talk to Us
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.36)} className="mt-7 flex flex-wrap items-center gap-5">
              {[
                { value: '99.2%', label: 'Accuracy Rate' },
                { value: '2.4M+', label: 'Records Daily' },
                { value: '50+', label: 'Global Clients' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-5">
                  <div>
                    <p
                      className="themed-stat-gradient text-[18px] font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-[11px] text-white/32"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                  {i < 2 && <div className="h-3 w-px bg-white/[0.06]" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: live workspace scene — unframed, blends into
              atmosphere. This is the hero's product-in-action visual.
              Bleeds RIGHTWARD only, past the container-pad and into the
              viewport margin, so the rectangle fills the empty space
              to the right without stealing width from the copy on the
              left. */}
          <motion.div
            {...fadeUp(0.18)}
            className="relative w-full lg:mr-[-11vw] xl:mr-[-17vw] 2xl:mr-[-22vw]"
          >
            <HeroWorkspaceScene />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient edge */}
      <div
        aria-hidden="true"
        className="themed-scrim-bottom absolute bottom-0 left-0 right-0"
        style={{ height: '180px' }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(233,196,106,0.3) 20%, rgba(255,107,53,0.45) 50%, rgba(244,162,97,0.3) 80%, transparent 100%)',
        }}
      />
    </section>
  )
}
