import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { ServicesPipelineScene } from '@/components/illustrations/ServicesPipelineScene'
import {
  DataServicesGlyph,
  AnalyticsGlyph,
  AIMLGlyph,
  BusinessSupportGlyph,
} from '@/components/icons/ServiceGlyphs'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { AiAnnotationRoles } from '@/components/sections/AiAnnotationRoles'

export const metadata = {
  title: 'Services — Lakspire',
  description:
    'Data services, analytics & reporting, AI & machine-learning data, and business support — the four groups that make up Lakspire\'s capability across the data lifecycle.',
}

// Broader capability groups shown beneath the AI Annotation section.
// Group numbering starts at 02 because the AI Annotation console is 01.
const groups = [
  {
    Glyph: DataServicesGlyph,
    slug: 'data-services',
    accent: '#FF6B35',
    label: 'Group 02',
    title: 'Data Services',
    lede: 'Everything that turns raw information into structured, reliable, useful data — before it reaches an analyst or a model.',
    items: [
      'Data collection',
      'Data entry',
      'Data processing',
      'Data cleansing',
      'Data conversion',
      'Data validation',
      'Data classification',
      'Data management',
    ],
  },
  {
    Glyph: AnalyticsGlyph,
    slug: 'analytics-reporting',
    accent: '#F4A261',
    label: 'Group 03',
    title: 'Analytics & Reporting',
    lede: 'Transform datasets into reports, insights and decisions — with the level of rigour the answer actually deserves.',
    items: [
      'Data analysis',
      'Business reporting',
      'Research support',
      'Information analysis',
      'Data visualisation',
      'Report preparation',
    ],
  },
  {
    Glyph: AIMLGlyph,
    slug: 'ai-ml-data',
    accent: '#FF8F5C',
    label: 'Group 04',
    title: 'AI & Machine Learning Data',
    lede: 'The training, evaluation and human-in-the-loop data that modern AI and ML systems depend on to be reliable. See the full catalogue in Section 01.',
    items: [
      'Data annotation',
      'Data labelling',
      'AI training data',
      'Data classification',
      'AI evaluation',
      'Human-in-the-loop review',
    ],
  },
  {
    Glyph: BusinessSupportGlyph,
    slug: 'business-support',
    accent: '#E9C46A',
    label: 'Group 05',
    title: 'Business Support',
    lede: 'The information-management and operational work that keeps a business running — done properly, so leaders can focus on decisions.',
    items: [
      'Information management',
      'Research',
      'Documentation',
      'Administrative data support',
      'Operational support',
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            <span className="text-gradient-primary">
              AI annotation, training datasets{' '}
              <span className="editorial">and the operations behind them.</span>
            </span>
          </>
        }
        subtitle="A nine-role annotation console for modern AI teams, plus the broader data operations — collection, cleansing, analytics, reporting — that keep your models honest. Structured scope. Human review where it matters."
      />

      {/* Pipeline visual — the story before the groups */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="pipeline">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <SectionLabel className="mb-4">The flow</SectionLabel>
                <h2
                  className="mb-5"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                    fontWeight: 350,
                    lineHeight: 1.12,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-strong)',
                  }}
                >
                  Raw records in. Structured, verified data out.
                </h2>
                <p
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                >
                  Every engagement runs through the same disciplined flow — processing, gears of
                  technology-enabled work, human review where it matters, then structured records
                  the client can actually use.
                </p>
              </div>
              <ClayFrame variant="wave">
                <ServicesPipelineScene />
              </ClayFrame>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 01 — AI Annotation & Training Datasets (client's PDF focus) */}
      <AiAnnotationRoles />

      {/* Broader capability groups */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="groups">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <div className="mb-16 max-w-3xl">
              <SectionLabel className="mb-4">02 — 05 · Broader capability</SectionLabel>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                  fontWeight: 350,
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-strong)',
                }}
              >
                Beyond annotation — the full data lifecycle.
              </h2>
              <p
                className="mt-4 text-[15.5px] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
              >
                Data services, analytics, ML enablement and business support — the surrounding work
                that turns annotation output into decisions and shipped products.
              </p>
            </div>
          </FadeIn>
          <div className="space-y-24 md:space-y-32">
            {groups.map((g, i) => {
              const flip = i % 2 === 1
              return (
                <div
                  key={g.slug}
                  id={g.slug}
                  className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-20"
                >
                  {/* Copy column — larger icon plate with hover animation.
                      The whole group row is the hover surface so users
                      just have to enter the group's space to trigger it. */}
                  <FadeIn className={`group/plate ${flip ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-5">
                      <span
                        className="group-plate inline-flex h-20 w-20 items-center justify-center rounded-2xl"
                        style={{
                          color: g.accent,
                          ['--plate-accent' as string]: g.accent,
                        }}
                      >
                        {/* Ambient concentric ring — pulses continuously */}
                        <span aria-hidden className="gp-ring" />
                        {/* Second ring — expands on hover */}
                        <span aria-hidden className="gp-ring gp-ring--hover" />
                        <span className="gp-glyph">
                          <g.Glyph size={44} />
                        </span>
                      </span>
                      <p
                        className="text-[12px] font-semibold uppercase"
                        style={{
                          letterSpacing: '0.16em',
                          fontFamily: 'var(--font-mono)',
                          color: g.accent,
                        }}
                      >
                        {g.label}
                      </p>
                    </div>
                    <h2
                      className="mb-5 mt-5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                        fontWeight: 350,
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em',
                        color: 'var(--text-strong)',
                      }}
                    >
                      {g.title}
                    </h2>
                    <p
                      className="text-[15.5px] leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: 'var(--text-muted)',
                        maxWidth: '32rem',
                      }}
                    >
                      {g.lede}
                    </p>
                  </FadeIn>

                  {/* List column — service pills. Hover animation is
                      driven by CSS custom properties on the group root
                      so transitions (opacity + transform + border)
                      fire together and reset together, avoiding the
                      "effect appears on hover-off" artefact caused by
                      opacity flashing while transform still eases. */}
                  <StaggerGroup
                    className={`grid grid-cols-1 gap-2.5 sm:grid-cols-2 ${flip ? 'lg:order-1' : ''}`}
                  >
                    {g.items.map((item) => (
                      <StaggerItem key={item}>
                        <div
                          className="service-pill group"
                          style={{
                            ['--pill-accent' as string]: g.accent,
                          }}
                        >
                          {/* Left accent bar — grows on hover */}
                          <span aria-hidden="true" className="pill-bar" />
                          {/* Ember sweep — inset gradient fades AND slides in on hover */}
                          <span aria-hidden="true" className="pill-sweep" />
                          {/* Dot — brightens + halos on hover (not inverted) */}
                          <span aria-hidden="true" className="pill-dot">
                            <span className="pill-dot-core" />
                            <span className="pill-dot-halo" />
                          </span>
                          <p
                            className="pill-label"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--text-strong)',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {item}
                          </p>
                          {/* Chevron cue — slides in on hover */}
                          <span aria-hidden="true" className="pill-chev">→</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Note + CTA */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="scope">
        <div className="mx-auto max-w-container container-pad">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <SectionLabel className="mb-4">Scope</SectionLabel>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 1.2rem + 1.6vw, 2.25rem)',
                  fontWeight: 350,
                  lineHeight: 1.14,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-strong)',
                }}
              >
                We only publish services we can genuinely deliver.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p
                className="mb-8 text-[15px] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
              >
                If your requirement sits at the edge of what&apos;s listed — or spans two groups —
                start a conversation. The team will tell you plainly whether we&apos;re a good fit
                and, if not, what a good fit would look like.
              </p>
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
                Discuss your project
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
