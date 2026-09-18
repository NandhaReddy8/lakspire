import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  LandmarkIcon,
  Cpu,
  ShoppingBag,
  GraduationCap,
  Scale,
  Building2,
  AlertCircle,
} from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { IndustriesMotifScene } from '@/components/illustrations/IndustriesMotifScene'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

export const metadata = {
  title: 'Industries — Lakspire',
  description:
    'Data services for healthcare, financial services, technology, retail, education, professional services and the public sector — with genuine experience, no invented case studies.',
}

const industries = [
  {
    Icon: Heart,
    accent: '#FF6B35',
    title: 'Healthcare & Life Sciences',
    body: 'Data processing, research support, information management and analytics — with a careful eye on sensitivity and consent.',
  },
  {
    Icon: LandmarkIcon,
    accent: '#F4A261',
    title: 'Financial Services',
    body: 'Data validation, processing, classification and reporting — where accuracy under audit matters more than speed.',
  },
  {
    Icon: Cpu,
    accent: '#FF8F5C',
    title: 'Technology',
    body: 'AI training data, annotation, data processing and research support for teams shipping real ML products.',
  },
  {
    Icon: ShoppingBag,
    accent: '#E9C46A',
    title: 'Retail & E-commerce',
    body: 'Product data, cataloguing, classification and data-quality work that keeps merchandising and search honest.',
  },
  {
    Icon: GraduationCap,
    accent: '#FABD6C',
    title: 'Education',
    body: 'Research, data processing and information management for institutions and edtech providers.',
  },
  {
    Icon: Scale,
    accent: '#FF6B35',
    title: 'Professional Services',
    body: 'Research, reporting, document processing and business support — often confidential, always structured.',
  },
  {
    Icon: Building2,
    accent: '#F4A261',
    title: 'Public Sector',
    body: 'Data processing, information management and administrative support with the discipline that public work requires.',
  },
]

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={
          <>
            <span className="text-gradient-primary">
              Seven sectors. <span className="editorial">One approach.</span>
            </span>
          </>
        }
        subtitle="We adapt to the sector, not the other way around. Below is where our experience is genuine — and where we won't take on work simply because it sounds relevant."
      />

      {/* Sector motif carousel */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="carousel">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <ClayFrame variant="pebble">
                <IndustriesMotifScene />
              </ClayFrame>
              <div>
                <SectionLabel className="mb-4">Sector by sector</SectionLabel>
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
                  Same discipline. <span style={{ color: 'var(--text-muted)' }}>Different contexts.</span>
                </h2>
                <p
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                >
                  A medical dataset asks for one kind of care — a financial report for another,
                  an ML training set for another still. The engineering underneath is shared;
                  the sensitivity to context is what we tailor per sector.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Industries grid */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="grid">
        <div className="mx-auto max-w-container container-pad">
          <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind, i) => (
              <StaggerItem key={ind.title}>
                <div
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-colors ${
                    i === industries.length - 1 && industries.length % 3 === 1
                      ? 'lg:col-span-3'
                      : ''
                  }`}
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-1/3 transition-[width] duration-500 group-hover:w-1/2"
                    style={{
                      background: `linear-gradient(90deg, ${ind.accent}, ${ind.accent}00)`,
                    }}
                  />
                  <span
                    className="icon-plate mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      color: ind.accent,
                      ['--plate-accent' as string]: ind.accent,
                    }}
                  >
                    <ind.Icon size={18} strokeWidth={1.5} />
                  </span>
                  <p
                    className="mb-3 text-[15.5px] font-medium"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-strong)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {ind.title}
                  </p>
                  <p
                    className="text-[13.5px] leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                  >
                    {ind.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Honesty note */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="honesty">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <div
              className="flex flex-col items-start gap-4 rounded-2xl border p-6 md:flex-row md:items-center md:gap-6 md:p-8"
              style={{
                borderColor: 'var(--border-glass)',
                background: 'var(--card-surface)',
              }}
            >
              <span
                className="icon-plate inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  color: '#E9C46A',
                  ['--plate-accent' as string]: '#E9C46A',
                }}
              >
                <AlertCircle size={18} strokeWidth={1.5} />
              </span>
              <div>
                <p
                  className="mb-1.5 text-[15px] font-medium"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-strong)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  We only claim experience we can point to.
                </p>
                <p
                  className="text-[13.5px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                >
                  No fabricated case studies, no invented logos. If your industry isn&apos;t listed
                  and you think it should be, tell us the specifics — we&apos;ll be honest about
                  whether we can help.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="cta">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <div
              className="flex flex-col items-start justify-between gap-6 rounded-3xl border p-8 md:flex-row md:items-center md:p-12"
              style={{
                borderColor: 'var(--border-glass)',
                background:
                  'linear-gradient(150deg, rgba(255,107,53,0.10) 0%, rgba(233,196,106,0.05) 55%, rgba(20,16,13,0.4) 100%)',
              }}
            >
              <h3
                className="max-w-xl"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.4rem, 1.1rem + 1vw, 1.85rem)',
                  fontWeight: 400,
                  lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-strong)',
                }}
              >
                Working on data in one of these sectors?
              </h3>
              <Link
                href="/contact"
                className="group inline-flex shrink-0 items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-medium text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontFamily: 'var(--font-body)',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)',
                  boxShadow:
                    '0 0 0 1px rgba(255,107,53,0.35), 0 12px 32px -8px rgba(255,107,53,0.5)',
                }}
              >
                Start the conversation
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
