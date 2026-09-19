'use client'
import type { ComponentType, SVGProps } from 'react'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { SectionLabel } from '@/components/blocks/SectionLabel'

/**
 * AI Annotation & Training Datasets — the client's Section 1 in
 * CHANGES.pdf. Nine role/service pairs, each rendered as a card with
 * a custom line-glyph, a role title, and the key-service description.
 *
 * The card frame borrows the annotation cursor's bounding-box
 * language: corner brackets snap in on hover, the accent shifts from
 * gold → ember, and a MONO tag at the corner reads "R01" through
 * "R09" so the section feels like a data-labelling console.
 */

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// ─── Role glyphs ─────────────────────────────────────────────
// Each is 32×32, currentColor stroke, no fill unless noted.
function BoundingBoxGlyph(p: IconProps) {
  // Data Annotator — bounding box with corner brackets + label tick
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M6 6 h4 M22 6 h4 M6 26 h4 M22 26 h4 M6 6 v4 M26 6 v4 M6 22 v4 M26 22 v4" {...stroke} />
      <rect x="11" y="12" width="10" height="8" rx="1" {...stroke} opacity="0.55" />
      <path d="M11 12 l-2 -3 h6" {...stroke} opacity="0.7" />
      <circle cx="20" cy="16" r="1.4" fill="currentColor" opacity="0.7" />
    </svg>
  )
}

function TagGlyph(p: IconProps) {
  // Data Labelling Specialist — tag icon
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M4 14 L14 4 h11 v11 L15 25 z" {...stroke} />
      <circle cx="20" cy="10" r="1.6" fill="currentColor" />
      <path d="M18 20 l-3 -3 M20 18 l3 -3" {...stroke} opacity="0.6" />
    </svg>
  )
}

function DatasetSplitGlyph(p: IconProps) {
  // Dataset Curator — 70/20/10 stacked bars
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <rect x="4" y="9" width="14" height="4" rx="0.5" fill="currentColor" opacity="0.85" />
      <rect x="4" y="15" width="10" height="4" rx="0.5" fill="currentColor" opacity="0.6" />
      <rect x="4" y="21" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
      <path d="M22 8 v18" {...stroke} opacity="0.5" strokeDasharray="1.5 2.5" />
      <path d="M24 12 l2 -2 l2 2 M28 22 l-2 2 l-2 -2" {...stroke} opacity="0.7" />
    </svg>
  )
}

function BucketsGlyph(p: IconProps) {
  // Classification Analyst — three buckets receiving items
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M6 12 l-2 12 h8 l-2 -12 z" {...stroke} />
      <path d="M16 12 l-2 12 h8 l-2 -12 z" {...stroke} opacity="0.8" />
      <path d="M26 12 l-2 12 h8 l-2 -12 z" transform="translate(-2 0)" {...stroke} opacity="0.65" />
      <circle cx="7" cy="6" r="1.4" fill="currentColor" opacity="0.9" />
      <circle cx="16" cy="6" r="1.4" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="6" r="1.4" fill="currentColor" opacity="0.4" />
      <path d="M7 8 v3 M16 8 v3 M24 8 v3" {...stroke} strokeDasharray="1 1.5" opacity="0.5" />
    </svg>
  )
}

function GaugeGlyph(p: IconProps) {
  // Evaluation Analyst — scored gauge
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M5 22 A11 11 0 0 1 27 22" {...stroke} strokeWidth="1.6" />
      <path d="M5 22 A11 11 0 0 1 12 12" {...stroke} strokeWidth="1.6" opacity="0.9" stroke="currentColor" />
      <path d="M16 22 L22 12" {...stroke} strokeWidth="1.6" />
      <circle cx="16" cy="22" r="1.6" fill="currentColor" />
      <path d="M8 25 h16" {...stroke} opacity="0.4" />
    </svg>
  )
}

function HandCheckGlyph(p: IconProps) {
  // HITL Reviewer — human hand + check
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <circle cx="11" cy="9" r="3" {...stroke} />
      <path d="M5 25 c0 -4 2.6 -7 6 -7 c3.4 0 6 3 6 7" {...stroke} />
      <circle cx="23" cy="18" r="6" {...stroke} opacity="0.75" />
      <path d="M20.5 18 L22.5 20 L26 16.5" {...stroke} strokeWidth="1.6" />
    </svg>
  )
}

function FunnelGlyph(p: IconProps) {
  // Data Collection Associate — funnel gathering multi-modal data
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M4 4 h24 l-9 12 v10 l-6 -3 v-7 z" {...stroke} />
      <circle cx="9" cy="8" r="0.9" fill="currentColor" opacity="0.9" />
      <circle cx="14" cy="8" r="0.9" fill="currentColor" opacity="0.65" />
      <circle cx="19" cy="8" r="0.9" fill="currentColor" opacity="0.9" />
      <circle cx="24" cy="8" r="0.9" fill="currentColor" opacity="0.5" />
      <path d="M17 22 h4" {...stroke} opacity="0.7" />
    </svg>
  )
}

function FilterGlyph(p: IconProps) {
  // Processing & Cleansing — filter with sparkle
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M4 8 h20 l-6 8 v8 l-8 -2 v-6 z" {...stroke} />
      <path d="M25 6 l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 z" fill="currentColor" opacity="0.85" />
      <path d="M11 20 l3 -1" {...stroke} opacity="0.65" />
    </svg>
  )
}

function DocCheckGlyph(p: IconProps) {
  // Data Validation Analyst — document with check
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden {...p}>
      <path d="M8 4 h12 l6 6 v18 h-18 z" {...stroke} />
      <path d="M20 4 v6 h6" {...stroke} opacity="0.7" />
      <path d="M11 16 h10 M11 20 h10 M11 24 h6" {...stroke} opacity="0.5" strokeWidth="1.2" />
      <circle cx="22" cy="22" r="4" fill="currentColor" opacity="0.9" />
      <path d="M20 22 L21.5 23.5 L24 21" stroke="rgba(20,15,11,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

type Role = {
  id: string
  Icon: ComponentType<IconProps>
  role: string
  service: string
  detail: string
}

const roles: Role[] = [
  {
    id: 'R01',
    Icon: BoundingBoxGlyph,
    role: 'Data Annotator',
    service: 'Data annotation',
    detail: 'Precise bounding boxes, transcripts, timestamps and tags across text, image, audio and video — the raw material AI models learn from.',
  },
  {
    id: 'R02',
    Icon: TagGlyph,
    role: 'Data Labelling Specialist',
    service: 'Schema-driven tagging',
    detail: 'Applies your labelling schema consistently at scale, so every sample carries the exact tags your model was designed to consume.',
  },
  {
    id: 'R03',
    Icon: DatasetSplitGlyph,
    role: 'Dataset Curator',
    service: 'AI training data curation',
    detail: 'Selects, balances and splits datasets — train / validation / test — with an eye on coverage, edge cases and class distribution.',
  },
  {
    id: 'R04',
    Icon: BucketsGlyph,
    role: 'AI/ML Data Classification Analyst',
    service: 'Intent · sentiment · entity · topic',
    detail: 'Multi-label classification with disciplined guideline enforcement, so downstream models train on categories that actually mean something.',
  },
  {
    id: 'R05',
    Icon: GaugeGlyph,
    role: 'AI Evaluation Analyst',
    service: 'Model output scoring',
    detail: 'Compares model predictions against annotated gold sets — precision, recall, agreement — and flags the regressions that ship-blockers care about.',
  },
  {
    id: 'R06',
    Icon: HandCheckGlyph,
    role: 'HITL Reviewer',
    service: 'Human-in-the-loop review',
    detail: 'Corrects and approves live model predictions in the loop — the safety net that turns a promising model into a production-ready one.',
  },
  {
    id: 'R07',
    Icon: FunnelGlyph,
    role: 'AI Data Collection Associate',
    service: 'Raw data sourcing',
    detail: 'Gathers text, images, audio and video from the sources you specify, with consent, provenance and coverage tracked end to end.',
  },
  {
    id: 'R08',
    Icon: FilterGlyph,
    role: 'Data Processing & Cleansing Associate',
    service: 'Pre- and post-labelling QA',
    detail: 'Deduplicates, redacts, normalises and quality-checks samples before and after labelling — no dirty data reaches your model.',
  },
  {
    id: 'R09',
    Icon: DocCheckGlyph,
    role: 'AI Data Validation Analyst',
    service: 'Guideline compliance',
    detail: 'Independent second pass on annotation quality: guideline adherence, inter-annotator agreement, and the sample-level defects that ruin metrics.',
  },
]

export function AiAnnotationRoles() {
  return (
    <section
      id="ai-annotation"
      className="py-section border-t border-white/[0.05]"
      data-scroll-anchor="ai-annotation"
    >
      <div className="mx-auto max-w-container container-pad">
        <FadeIn>
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div>
              <SectionLabel className="mb-4">01 · AI Annotation & Training Datasets</SectionLabel>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.9rem, 1.4rem + 2.2vw, 3rem)',
                  fontWeight: 350,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-strong)',
                }}
              >
                Nine roles.{' '}
                <span className="editorial" style={{ color: 'var(--color-gold, #E9C46A)' }}>
                  One annotation console
                </span>{' '}
                behind every dataset we ship.
              </h2>
            </div>
            <p
              className="max-w-md text-[15.5px] leading-relaxed lg:text-right lg:ml-auto"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
            >
              From raw collection to human-in-the-loop review, this is the specialised bench that
              stands behind every training set, evaluation gold set and production correction loop
              we deliver.
            </p>
          </div>
        </FadeIn>

        {/* Role grid — 3 columns on lg, 2 on sm, 1 on mobile */}
        <StaggerGroup
          staggerDelay={0.06}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3"
        >
          {roles.map(({ id, Icon, role, service, detail }, i) => {
            // Alternate accent between gold and ember so the grid
            // reads as a rhythm, not a repeat.
            const gold = i % 2 === 0
            const accent = gold ? '#E9C46A' : '#FF8F5C'
            const accentSoft = gold ? 'rgba(233,196,106,0.14)' : 'rgba(255,143,92,0.14)'
            return (
              <StaggerItem key={id}>
                <article
                  className="role-card group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                    ['--role-accent' as string]: accent,
                    ['--role-accent-soft' as string]: accentSoft,
                  }}
                >
                  {/* Corner brackets — annotation-tool marker */}
                  <span aria-hidden className="role-bracket role-bracket--tl" />
                  <span aria-hidden className="role-bracket role-bracket--tr" />
                  <span aria-hidden className="role-bracket role-bracket--bl" />
                  <span aria-hidden className="role-bracket role-bracket--br" />

                  {/* Hover glow */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(240px circle at 30% 0%, ${accentSoft}, transparent 60%)`,
                    }}
                  />

                  <header className="relative flex items-start justify-between">
                    <span
                      className="icon-plate inline-flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        color: accent,
                        ['--plate-accent' as string]: accent,
                      }}
                    >
                      <Icon />
                    </span>
                    <span
                      className="text-[10px] font-medium uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.16em',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {id}
                    </span>
                  </header>

                  <h3
                    className="relative mt-5 text-[17px]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      color: 'var(--text-strong)',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.25,
                    }}
                  >
                    {role}
                  </h3>

                  <p
                    className="relative mt-1 text-[12.5px] font-medium uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                      color: accent,
                    }}
                  >
                    {service}
                  </p>

                  <p
                    className="relative mt-4 text-[14.5px] leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-body)',
                    }}
                  >
                    {detail}
                  </p>

                  {/* Baseline accent bar animates in on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: accent }}
                  />
                </article>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>
    </section>
  )
}
