'use client'

import { useEffect, useRef } from 'react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { DataPipelineDiagram } from '@/components/illustrations/DataPipelineDiagram'
import { DataArchitectureDiagram } from '@/components/illustrations/DataArchitectureDiagram'
import { AnalyticsDashboardMockup } from '@/components/illustrations/AnalyticsDashboardMockup'
import { ModelPipelineDiagram } from '@/components/illustrations/ModelPipelineDiagram'
import { AnnotationMockup } from '@/components/illustrations/AnnotationMockup'
import { OperationsDashboardMockup } from '@/components/illustrations/OperationsDashboardMockup'
import { services } from '@/data/services'
import { ClayFrame } from '@/components/blocks/ClayFrame'

/* Each service gets a distinct clay silhouette so the story reads as
   a sequence of different shapes rather than a repeating rectangle. */
type ClayVariant = 'pebble' | 'petal' | 'wave' | 'drop'
const CLAY_VARIANTS: Record<string, ClayVariant> = {
  'data-processing': 'pebble',
  'data-management': 'wave',
  'data-analytics': 'petal',
  'ai-automation': 'drop',
  'data-annotation': 'pebble',
  'business-support': 'wave',
}

/**
 * WhatWeDoStory — pinned scrollytelling section.
 *
 * Performance: the scroll handler mutates DOM styles directly through
 * refs — no React re-render per frame. Section height is 70vh per
 * discipline (was 100vh) so the whole story reads faster without
 * losing the pinned effect.
 */

const illustrationMap: Record<string, React.ReactNode> = {
  'data-processing': <DataPipelineDiagram />,
  'data-management': <DataArchitectureDiagram />,
  'data-analytics': <AnalyticsDashboardMockup />,
  'ai-automation': <ModelPipelineDiagram />,
  'data-annotation': <AnnotationMockup />,
  'business-support': <OperationsDashboardMockup />,
}

const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v))

// Scroll length per discipline in viewport heights. Lower = shorter
// scroll to get through the story. 70vh feels snappier than the
// original 100vh without losing the pinned scrollytelling effect.
const SLICE_VH = 70

export function WhatWeDoStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const copyRefs = useRef<(HTMLDivElement | null)[]>([])
  const illustRefs = useRef<(HTMLDivElement | null)[]>([])
  const railFillRefs = useRef<(HTMLDivElement | null)[]>([])
  const railTipRefs = useRef<(HTMLDivElement | null)[]>([])

  const N = services.length

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let raf = 0
    let lastActive = -1

    const compute = () => {
      const rect = container.getBoundingClientRect()
      const vh = window.innerHeight
      const total = container.offsetHeight - vh
      if (total <= 0) return

      const progress = clamp(-rect.top / total)
      const p = progress * N
      const activeIndex = Math.min(N - 1, Math.max(0, Math.floor(p)))

      for (let i = 0; i < N; i++) {
        const card = cardRefs.current[i]
        const copy = copyRefs.current[i]
        const illust = illustRefs.current[i]
        const railFill = railFillRefs.current[i]
        const railTip = railTipRefs.current[i]
        if (!card) continue

        const isCurrent = i === activeIndex
        const isLast = i === N - 1
        const flip = i >= 3
        const localP = p - i

        // Outer wrapper visibility swap (sharp, no CSS transition)
        if (isCurrent !== (i === lastActive)) {
          card.style.opacity = isCurrent ? '1' : '0'
          card.style.pointerEvents = isCurrent ? 'auto' : 'none'
          card.setAttribute('aria-hidden', isCurrent ? 'false' : 'true')
        }

        // Copy motion — continuous within slice for the current card
        if (copy) {
          if (isCurrent) {
            let copyOpacity = 1
            let copyTy = 0
            if (!isLast) {
              if (localP >= 0.55)
                copyOpacity = clamp((1 - localP) / 0.45)
              copyTy = -localP * 64
            }
            copy.style.opacity = String(copyOpacity)
            copy.style.transform = `translate3d(0,${copyTy}px,0)`
          }
        }

        // Illustration entrance transform — only mutate when the
        // current-card flag actually changes (CSS transition handles
        // the animation, no need to touch it every frame).
        if (illust && isCurrent !== (i === lastActive)) {
          illust.style.transform = isCurrent
            ? 'translate3d(0,0,0) scale(1)'
            : `translate3d(${flip ? '-' : ''}14px,8px,0) scale(0.98)`
        }

        // Rail fill height + tip position — only for the current card
        if (railFill && railTip && isCurrent) {
          const fill = isLast ? 1 : clamp(localP)
          const pct = `${fill * 100}%`
          railFill.style.height = pct
          railTip.style.top = pct
        }
      }

      lastActive = activeIndex
    }

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(compute)
    }
    // Initial paint — force the "changed" branch to run for every card
    lastActive = -1
    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', compute)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [N])

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${N * SLICE_VH}vh` }}
      data-scroll-anchor="what-we-do"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* pt-24 reserves the "navbar zone" so the heading never appears
            to sit under the floating nav pills when the section pins. */}
        <div className="mx-auto flex h-full max-w-container flex-col justify-center container-pad pt-24 pb-8">
          {/* Persistent section header */}
          <div className="mb-8 max-w-3xl lg:mb-10">
            <SectionLabel className="mb-4">What We Do</SectionLabel>
            <h2
              className="text-white/90"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.75rem)',
                fontWeight: 350,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Six disciplines.{' '}
              <span className="text-white/40">One integrated approach.</span>
            </h2>
          </div>

          {/* Card stack */}
          <div className="relative min-h-[360px] flex-1 lg:min-h-[440px]">
            {services.map((service, i) => {
              const flip = i >= 3
              const initiallyActive = i === 0
              return (
                <div
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className="absolute inset-0"
                  aria-hidden={!initiallyActive}
                  style={{
                    opacity: initiallyActive ? 1 : 0,
                    pointerEvents: initiallyActive ? 'auto' : 'none',
                  }}
                >
                  <div className="grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Text column */}
                    <div
                      className={`relative ${
                        flip ? 'lg:order-2 lg:pr-8' : 'lg:order-1 lg:pl-8'
                      }`}
                    >
                      {/* Vertical progress rail */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute"
                        style={{
                          top: '0.25rem',
                          bottom: '0.25rem',
                          width: '2px',
                          left: flip ? 'auto' : 0,
                          right: flip ? 0 : 'auto',
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{ background: 'var(--rail-track)' }}
                        />
                        <div
                          ref={(el) => {
                            railFillRefs.current[i] = el
                          }}
                          className="absolute left-0 right-0 top-0"
                          style={{
                            height: '0%',
                            background:
                              'linear-gradient(180deg, rgba(255,107,53,0.35) 0%, #FF6B35 60%, #FABD6C 100%)',
                          }}
                        />
                        <div
                          ref={(el) => {
                            railTipRefs.current[i] = el
                          }}
                          className="themed-rail-tip absolute left-1/2"
                          style={{
                            top: '0%',
                            width: '10px',
                            height: '2px',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      </div>

                      {/* Copy — mutated directly on scroll via ref */}
                      <div
                        ref={(el) => {
                          copyRefs.current[i] = el
                        }}
                        style={{
                          opacity: 1,
                          transform: 'translate3d(0,0,0)',
                          willChange: 'opacity, transform',
                        }}
                      >
                        <p
                          className="mb-3 inline-block text-[11px] font-medium uppercase tracking-[0.14em]"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            background:
                              'linear-gradient(90deg, #FF6B35, #F4A261)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          0{i + 1} / 0{services.length} — Discipline
                        </p>
                        <h3
                          className="mb-4 text-white/95"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize:
                              'clamp(1.5rem, 1.15rem + 1.5vw, 2.25rem)',
                            fontWeight: 400,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                          }}
                        >
                          {service.title}
                        </h3>
                        <p
                          className="max-w-lg text-[15px] leading-relaxed text-white/55"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Illustration column */}
                    <div
                      ref={(el) => {
                        illustRefs.current[i] = el
                      }}
                      className={flip ? 'lg:order-1' : 'lg:order-2'}
                      style={{
                        transform: initiallyActive
                          ? 'translate3d(0,0,0) scale(1)'
                          : `translate3d(${flip ? '-' : ''}14px,8px,0) scale(0.98)`,
                        transition:
                          'transform 560ms cubic-bezier(0.16, 1, 0.3, 1)',
                        willChange: 'transform',
                      }}
                    >
                      <div className="relative mx-auto w-full max-w-md">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -inset-8 -z-10"
                          style={{
                            background: flip
                              ? 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(255,107,53,0.14) 0%, transparent 65%)'
                              : 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(244,162,97,0.12) 0%, transparent 65%)',
                            filter: 'blur(10px)',
                          }}
                        />
                        <ClayFrame variant={CLAY_VARIANTS[service.id] ?? 'pebble'}>
                          {illustrationMap[service.id]}
                        </ClayFrame>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
