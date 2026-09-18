'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'

/**
 * WhyLakspire — horizontal auto-rotating card carousel.
 *
 * Cards flow right → left continuously. The center card is fully in focus
 * (sharp, full-scale, opaque). Immediate neighbours sit behind, blurred,
 * scaled down and dimmed — visible only as background context. Wraps
 * around infinitely so after the last card, the first follows again but
 * always as a blur behind whichever card is now central.
 *
 * Hover pauses rotation. Click a background card to jump to it.
 */

interface Reason {
  title: string
  description: string
  eyebrow: string
  Icon: React.ComponentType<{ className?: string }>
  accent: string
}

/* ────────── Custom, quiet SVG glyphs — replace the generic lucide set ────────── */

const iconClass = 'h-6 w-6'

function TargetGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" opacity="0.35" />
      <circle cx="12" cy="12" r="5.5" opacity="0.65" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" opacity="0.55" />
    </svg>
  )
}

function ScaleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M3 20h18" opacity="0.35" />
      <rect x="4.5" y="14" width="3" height="6" rx="0.5" opacity="0.55" />
      <rect x="10.5" y="9" width="3" height="11" rx="0.5" opacity="0.8" />
      <rect x="16.5" y="4" width="3" height="16" rx="0.5" fill="currentColor" stroke="none" opacity="0.9" />
      <path d="M4 5l6 4 4-3 6 -3" opacity="0.55" />
    </svg>
  )
}

function CpuBrainGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" opacity="0.6" />
      <rect x="9" y="9" width="6" height="6" rx="0.8" fill="currentColor" stroke="none" opacity="0.85" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M4.5 6.5l1.5 1.5M18 18l1.5 1.5M4.5 17.5L6 16M18 6l1.5-1.5" opacity="0.45" />
    </svg>
  )
}

function ShieldLockGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 4 5.5v6.2c0 4.6 3.2 8.6 8 9.8 4.8-1.2 8-5.2 8-9.8V5.5l-8-3z" opacity="0.7" />
      <rect x="9" y="11" width="6" height="5" rx="0.8" fill="currentColor" stroke="none" opacity="0.9" />
      <path d="M10 11V9.5a2 2 0 1 1 4 0V11" opacity="0.7" />
    </svg>
  )
}

function LayersGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M12 3 3 8l9 5 9-5-9-5z" fill="currentColor" stroke="none" opacity="0.9" />
      <path d="M3 12l9 5 9-5" opacity="0.55" />
      <path d="M3 16l9 5 9-5" opacity="0.3" />
    </svg>
  )
}

function GlobeNetGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" opacity="0.55" />
      <ellipse cx="12" cy="12" rx="4" ry="9" opacity="0.5" />
      <path d="M3 12h18" opacity="0.5" />
      <circle cx="6" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="17" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const reasons: Reason[] = [
  {
    eyebrow: '01',
    title: 'Accuracy First',
    description:
      'Multi-layer QA processes, validation checks and expert review ensure data you can trust — every time.',
    Icon: TargetGlyph,
    accent: '#E9C46A',
  },
  {
    eyebrow: '02',
    title: 'Built to Scale',
    description:
      'From thousands to billions of records, our infrastructure grows with your data requirements.',
    Icon: ScaleGlyph,
    accent: '#FF6B35',
  },
  {
    eyebrow: '03',
    title: 'Technology + Expertise',
    description:
      'Proprietary tooling combined with domain experts. Neither alone is enough — we provide both.',
    Icon: CpuBrainGlyph,
    accent: '#F4A261',
  },
  {
    eyebrow: '04',
    title: 'Security & Confidentiality',
    description:
      'Enterprise-grade data security, NDAs, isolated environments and strict access controls as standard.',
    Icon: ShieldLockGlyph,
    accent: '#FF6B35',
  },
  {
    eyebrow: '05',
    title: 'Flexible Delivery',
    description:
      'Managed service, embedded team, or hybrid model — structured to fit your operations, not ours.',
    Icon: LayersGlyph,
    accent: '#E9C46A',
  },
  {
    eyebrow: '06',
    title: 'International Reach',
    description:
      'Multilingual capability and global delivery expertise for organisations operating across borders.',
    Icon: GlobeNetGlyph,
    accent: '#F4A261',
  },
]

const ROTATE_MS = 3800
const N = reasons.length

/** Signed shortest distance from `i` to `current`, wrapping around N. */
function wrapDelta(i: number, current: number, n: number) {
  let d = i - current
  if (d > n / 2) d -= n
  if (d < -n / 2) d += n
  return d
}

export function WhyLakspire() {
  const [current, setCurrent] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % N)
    }
    const t = window.setInterval(tick, ROTATE_MS)
    return () => window.clearInterval(t)
  }, [])

  return (
    <section className="relative overflow-hidden py-section border-t border-white/[0.05]" data-scroll-anchor="why-lakspire">
      <div className="mx-auto max-w-container container-pad">
        <FadeIn>
          <SectionLabel className="mb-4">Why Lakspire</SectionLabel>
          <h2
            className="max-w-2xl text-white/90"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3.25rem)',
              fontWeight: 350,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Precision at every layer.
            <br />
            <span className="text-white/40">Reliability you can build on.</span>
          </h2>
        </FadeIn>

        {/* Stage */}
        <div
          className="relative mx-auto mt-16 h-[440px] w-full max-w-6xl lg:h-[480px]"
          onMouseEnter={() => {
            pausedRef.current = true
          }}
          onMouseLeave={() => {
            pausedRef.current = false
          }}
        >
          {/* Ambient warm glow behind the focused card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,107,53,0.14) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Prev / Next controls — theme-aware ember buttons.
              Hidden on mobile (they'd overlay the card copy); mobile
              users get inline prev/next chevrons rendered beside the
              progress dots row below. */}
          <button
            type="button"
            onClick={() => setCurrent((c) => (c - 1 + N) % N)}
            aria-label="Previous principle"
            className="carousel-nav absolute left-2 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full sm:left-4 sm:flex md:left-6"
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % N)}
            aria-label="Next principle"
            className="carousel-nav absolute right-2 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full sm:right-4 sm:flex md:right-6"
          >
            <ChevronRight size={20} strokeWidth={1.75} />
          </button>

          {reasons.map((r, i) => {
            const d = wrapDelta(i, current, N)
            const abs = Math.abs(d)

            // Horizontal offset — 360px stride between neighbours
            const x = d * 360

            // Depth-based transforms — center is front, neighbours behind
            const scale = abs === 0 ? 1 : abs === 1 ? 0.86 : 0.72
            const blur = abs === 0 ? 0 : abs === 1 ? 6 : 14
            const opacity =
              abs === 0 ? 1 : abs === 1 ? 0.45 : abs === 2 ? 0.18 : 0
            const z = 20 - abs

            const isFocus = abs === 0

            return (
              <button
                key={r.title}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Show ${r.title}`}
                tabIndex={isFocus ? 0 : -1}
                className="group absolute left-1/2 top-1/2 block text-left"
                style={{
                  width: '360px',
                  height: '380px',
                  transform: `translate3d(calc(-50% + ${x}px), -50%, 0) scale(${scale})`,
                  filter: blur > 0 ? `blur(${blur}px)` : 'none',
                  opacity,
                  zIndex: z,
                  transition:
                    'transform 900ms cubic-bezier(0.22, 1, 0.36, 1), filter 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                  willChange: 'transform, filter, opacity',
                  pointerEvents: abs <= 2 ? 'auto' : 'none',
                  cursor: isFocus ? 'default' : 'pointer',
                }}
              >
                <div
                  className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border p-8 backdrop-blur-md ${
                    isFocus ? 'themed-card-gradient' : ''
                  }`}
                  style={{
                    borderColor: isFocus
                      ? 'var(--border-glass-strong)'
                      : 'var(--border-glass)',
                    background: isFocus ? undefined : 'var(--card-surface)',
                    boxShadow: isFocus
                      ? `0 30px 80px -30px ${r.accent}55, inset 0 1px 0 0 var(--highlight-top)`
                      : 'none',
                  }}
                >
                  {/* Corner accent line — sharp editorial detail. Solid
                      ember with a deep-ember tail (no fade to transparent,
                      which reads as white on cream). */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px"
                    style={{
                      width: isFocus ? '100%' : '32%',
                      background: `linear-gradient(90deg, ${r.accent} 0%, ${r.accent} 55%, ${r.accent}80 85%, ${r.accent}00 100%)`,
                      transition: 'width 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  />

                  {/* Eyebrow — mono index */}
                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className="text-[11px] font-medium uppercase tracking-[0.22em]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {r.eyebrow} / 0{N}
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-faint)',
                      }}
                    >
                      Principle
                    </span>
                  </div>

                  {/* Icon plate — warm-dark backing in both themes so
                      the ember glyph pops with contrast (matches the
                      illust-frame philosophy). */}
                  <div
                    className="icon-plate mb-8 flex h-14 w-14 items-center justify-center rounded-xl"
                    style={{
                      color: r.accent,
                      boxShadow: isFocus
                        ? `0 0 40px -8px ${r.accent}60, inset 0 1px 0 0 rgba(255,240,220,0.10)`
                        : 'inset 0 1px 0 0 rgba(255,240,220,0.06)',
                      // Custom prop consumed by .icon-plate for the border tint
                      ['--plate-accent' as string]: r.accent,
                    }}
                  >
                    <r.Icon className={iconClass} />
                  </div>

                  {/* Title */}
                  <h3
                    className="mb-4 text-white/95"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.35rem, 1.1rem + 0.8vw, 1.75rem)',
                      fontWeight: 400,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                    }}
                  >
                    {r.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[14px] leading-relaxed text-white/55"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {r.description}
                  </p>

                  {/* Bottom footer strip */}
                  <div className="mt-auto flex items-center gap-3 pt-6">
                    <span
                      className="block h-[1px] flex-1"
                      style={{
                        background:
                          'linear-gradient(90deg, var(--border-glass-strong), transparent)',
                      }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-[0.2em]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: `${r.accent}`,
                        opacity: isFocus ? 0.9 : 0.5,
                      }}
                    >
                      Lakspire
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress row — prev chevron, dots, next chevron. On mobile
            the chevrons appear inline so they don't overlay the cards.
            On sm+ the chevrons stay hidden here (rendered above beside
            the stage) and only the dots show. */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setCurrent((c) => (c - 1 + N) % N)}
            aria-label="Previous principle"
            className="carousel-nav flex h-9 w-9 items-center justify-center rounded-full sm:hidden"
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
          </button>

          <div className="flex items-center justify-center gap-2">
            {reasons.map((r, i) => (
              <button
                key={r.title}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Jump to ${r.title}`}
                className="group flex h-4 items-center justify-center"
              >
                <span
                  className="block h-[2px] transition-all duration-500"
                  style={{
                    width: i === current ? '28px' : '10px',
                    background:
                      i === current
                        ? 'linear-gradient(90deg, #FF6B35, #F4A261)'
                        : 'var(--border-glass-strong)',
                  }}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrent((c) => (c + 1) % N)}
            aria-label="Next principle"
            className="carousel-nav flex h-9 w-9 items-center justify-center rounded-full sm:hidden"
          >
            <ChevronRight size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  )
}
