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
// Each is 32×32, currentColor stroke, no fill unless noted. Glyphs
// are split into two groups (.glyph-a / .glyph-b) so the split-and-
// reunite hover animation can push them apart and back together.
function BoundingBoxGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <path d="M6 6 h4 M22 6 h4 M6 26 h4 M22 26 h4 M6 6 v4 M26 6 v4 M6 22 v4 M26 22 v4" {...stroke} />
      </g>
      <g className="glyph-b">
        <rect x="11" y="12" width="10" height="8" rx="1" {...stroke} opacity="0.7" />
        <path d="M11 12 l-2 -3 h6" {...stroke} opacity="0.75" />
        <circle cx="20" cy="16" r="1.4" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  )
}

function TagGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <path d="M4 14 L14 4 h11 v11 L15 25 z" {...stroke} />
        <circle cx="20" cy="10" r="1.6" fill="currentColor" />
      </g>
      <g className="glyph-b">
        <path d="M18 20 l-3 -3 M20 18 l3 -3" {...stroke} opacity="0.75" />
      </g>
    </svg>
  )
}

function DatasetSplitGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <rect x="4" y="9" width="14" height="4" rx="0.5" fill="currentColor" opacity="0.9" />
        <rect x="4" y="15" width="10" height="4" rx="0.5" fill="currentColor" opacity="0.65" />
        <rect x="4" y="21" width="6" height="4" rx="0.5" fill="currentColor" opacity="0.42" />
      </g>
      <g className="glyph-b">
        <path d="M22 8 v18" {...stroke} opacity="0.55" strokeDasharray="1.5 2.5" />
        <path d="M24 12 l2 -2 l2 2 M28 22 l-2 2 l-2 -2" {...stroke} opacity="0.8" />
      </g>
    </svg>
  )
}

function BucketsGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <path d="M6 12 l-2 12 h8 l-2 -12 z" {...stroke} />
        <path d="M16 12 l-2 12 h8 l-2 -12 z" {...stroke} opacity="0.85" />
        <path d="M26 12 l-2 12 h8 l-2 -12 z" transform="translate(-2 0)" {...stroke} opacity="0.7" />
      </g>
      <g className="glyph-b">
        <circle cx="7" cy="6" r="1.4" fill="currentColor" opacity="0.9" />
        <circle cx="16" cy="6" r="1.4" fill="currentColor" opacity="0.7" />
        <circle cx="24" cy="6" r="1.4" fill="currentColor" opacity="0.5" />
        <path d="M7 8 v3 M16 8 v3 M24 8 v3" {...stroke} strokeDasharray="1 1.5" opacity="0.55" />
      </g>
    </svg>
  )
}

function GaugeGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <path d="M5 22 A11 11 0 0 1 27 22" {...stroke} strokeWidth="1.6" />
        <path d="M5 22 A11 11 0 0 1 12 12" {...stroke} strokeWidth="1.6" opacity="0.9" />
        <path d="M8 25 h16" {...stroke} opacity="0.45" />
      </g>
      <g className="glyph-b">
        <path d="M16 22 L22 12" {...stroke} strokeWidth="1.6" />
        <circle cx="16" cy="22" r="1.6" fill="currentColor" />
      </g>
    </svg>
  )
}

function HandCheckGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <circle cx="11" cy="9" r="3" {...stroke} />
        <path d="M5 25 c0 -4 2.6 -7 6 -7 c3.4 0 6 3 6 7" {...stroke} />
      </g>
      <g className="glyph-b">
        <circle cx="23" cy="18" r="6" {...stroke} opacity="0.8" />
        <path d="M20.5 18 L22.5 20 L26 16.5" {...stroke} strokeWidth="1.6" />
      </g>
    </svg>
  )
}

function FunnelGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <circle cx="9" cy="8" r="0.9" fill="currentColor" opacity="0.9" />
        <circle cx="14" cy="8" r="0.9" fill="currentColor" opacity="0.7" />
        <circle cx="19" cy="8" r="0.9" fill="currentColor" opacity="0.9" />
        <circle cx="24" cy="8" r="0.9" fill="currentColor" opacity="0.55" />
      </g>
      <g className="glyph-b">
        <path d="M4 4 h24 l-9 12 v10 l-6 -3 v-7 z" {...stroke} />
        <path d="M17 22 h4" {...stroke} opacity="0.75" />
      </g>
    </svg>
  )
}

function FilterGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <path d="M4 8 h20 l-6 8 v8 l-8 -2 v-6 z" {...stroke} />
        <path d="M11 20 l3 -1" {...stroke} opacity="0.7" />
      </g>
      <g className="glyph-b">
        <path d="M25 6 l1 -3 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 z" fill="currentColor" opacity="0.9" />
      </g>
    </svg>
  )
}

function DocCheckGlyph(p: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden {...p}>
      <g className="glyph-a">
        <path d="M8 4 h12 l6 6 v18 h-18 z" {...stroke} />
        <path d="M20 4 v6 h6" {...stroke} opacity="0.75" />
        <path d="M11 16 h10 M11 20 h10 M11 24 h6" {...stroke} opacity="0.55" strokeWidth="1.2" />
      </g>
      <g className="glyph-b">
        <circle cx="22" cy="22" r="4" fill="currentColor" opacity="0.95" />
        <path d="M20 22 L21.5 23.5 L24 21" stroke="rgba(20,15,11,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

type Role = {
  id: string
  Icon: ComponentType<IconProps>
  service: string
  detail: string
}

// Copy focus: the headings ARE the service and read as data-annotation
// deliverables — the previous "role" title has been retired. Each detail
// paragraph is framed as work Lakspire delivers as an annotation partner,
// not a generic AI shop.
const roles: Role[] = [
  {
    id: 'R01',
    Icon: BoundingBoxGlyph,
    service: 'Data annotation',
    detail: 'Precise bounding boxes, polygons, transcripts, timestamps and tags across text, image, audio and video — the labelled raw material every AI model actually learns from.',
  },
  {
    id: 'R02',
    Icon: TagGlyph,
    service: 'Schema-driven labelling',
    detail: 'We apply your labelling schema consistently at scale, so every sample carries the exact tags your model was designed to consume — even as edge cases pile up.',
  },
  {
    id: 'R03',
    Icon: DatasetSplitGlyph,
    service: 'Training-set curation',
    detail: 'Selecting, balancing and splitting annotated data — train / validation / test — with an eye on coverage, edge cases and class distribution across the dataset.',
  },
  {
    id: 'R04',
    Icon: BucketsGlyph,
    service: 'Data classification',
    detail: 'Intent, sentiment, entity and topic labelling with disciplined guideline enforcement, so downstream models train on categories that actually mean something.',
  },
  {
    id: 'R05',
    Icon: GaugeGlyph,
    service: 'Annotation quality scoring',
    detail: 'Comparing model predictions against annotated gold sets — precision, recall, inter-annotator agreement — and flagging the regressions ship-blockers care about.',
  },
  {
    id: 'R06',
    Icon: HandCheckGlyph,
    service: 'Human-in-the-loop review',
    detail: 'Human reviewers correcting and approving live model predictions in the loop — the safety net that turns a promising model into a production-ready one.',
  },
  {
    id: 'R07',
    Icon: FunnelGlyph,
    service: 'Raw data collection',
    detail: 'Gathering text, images, audio and video from the sources you specify — with consent, provenance and coverage tracked end to end before a single label is applied.',
  },
  {
    id: 'R08',
    Icon: FilterGlyph,
    service: 'Pre- & post-labelling QA',
    detail: 'Deduplication, redaction, normalisation and quality checks either side of labelling — so no dirty data reaches your annotators, and no bad labels reach your model.',
  },
  {
    id: 'R09',
    Icon: DocCheckGlyph,
    service: 'Annotation validation',
    detail: 'An independent second pass on annotation quality: guideline adherence, agreement scoring, and the sample-level defects that quietly ruin evaluation metrics.',
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
          {roles.map(({ id, Icon, service, detail }, i) => {
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
                      className="role-icon icon-plate inline-flex h-14 w-14 items-center justify-center rounded-xl"
                      style={{
                        color: accent,
                        ['--plate-accent' as string]: accent,
                      }}
                    >
                      <Icon className="role-icon__svg" />
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

                  {/* Service heading — now the primary title of the card,
                      carried in the ember/gold accent so the grid reads
                      as a catalogue of annotation services (no more role
                      titles). */}
                  <h3
                    className="relative mt-6 text-[17px] font-semibold uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      letterSpacing: '0.08em',
                      color: accent,
                      lineHeight: 1.25,
                    }}
                  >
                    {service}
                  </h3>

                  <p
                    className="relative mt-3 text-[14.5px] leading-relaxed"
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
