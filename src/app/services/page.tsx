import Link from 'next/link'
import { ArrowRight, Database, LineChart, BrainCog, Briefcase } from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { ServicesPipelineScene } from '@/components/illustrations/ServicesPipelineScene'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

export const metadata = {
  title: 'Services — Lakspire',
  description:
    'Data services, analytics & reporting, AI & machine-learning data, and business support — the four groups that make up Lakspire\'s capability across the data lifecycle.',
}

const groups = [
  {
    Icon: Database,
    slug: 'data-services',
    accent: '#FF6B35',
    label: 'Group 01',
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
    Icon: LineChart,
    slug: 'analytics-reporting',
    accent: '#F4A261',
    label: 'Group 02',
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
    Icon: BrainCog,
    slug: 'ai-ml-data',
    accent: '#FF8F5C',
    label: 'Group 03',
    title: 'AI & Machine Learning Data',
    lede: 'The training, evaluation and human-in-the-loop data that modern AI and ML systems depend on to be reliable.',
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
    Icon: Briefcase,
    slug: 'business-support',
    accent: '#E9C46A',
    label: 'Group 04',
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
              Four capability groups. <span className="editorial">One data partner.</span>
            </span>
          </>
        }
        subtitle="From collection to reporting, and everything the modern AI stack needs in between. Structured services with clear scope, run by people who care whether the output is actually correct."
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

      {/* Groups */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="groups">
        <div className="mx-auto max-w-container container-pad">
          <div className="space-y-24 md:space-y-32">
            {groups.map((g, i) => {
              const flip = i % 2 === 1
              return (
                <div
                  key={g.slug}
                  id={g.slug}
                  className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-20"
                >
                  {/* Copy column */}
                  <FadeIn className={flip ? 'lg:order-2' : ''}>
                    <div className="flex items-center gap-3">
                      <span
                        className="icon-plate inline-flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{
                          color: g.accent,
                          ['--plate-accent' as string]: g.accent,
                        }}
                      >
                        <g.Icon size={19} strokeWidth={1.5} />
                      </span>
                      <p
                        className="text-[11px] font-semibold uppercase"
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

                  {/* List column */}
                  <StaggerGroup
                    className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${flip ? 'lg:order-1' : ''}`}
                  >
                    {g.items.map((item) => (
                      <StaggerItem key={item}>
                        <div
                          className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
                          style={{
                            borderColor: 'var(--border-glass)',
                            background: 'var(--card-surface)',
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: g.accent, opacity: 0.7 }}
                          />
                          <p
                            className="text-[13.5px]"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--text-strong)',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {item}
                          </p>
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
