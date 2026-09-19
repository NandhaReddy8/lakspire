import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { TiltCard } from '@/components/blocks/TiltCard'
import { IndustriesMotifScene } from '@/components/illustrations/IndustriesMotifScene'
import {
  HealthcareGlyph,
  FinanceGlyph,
  TechnologyGlyph,
  RetailGlyph,
  EducationGlyph,
  ProfessionalGlyph,
  PublicSectorGlyph,
} from '@/components/icons/IndustryGlyphs'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

export const metadata = {
  title: 'Industries — Lakspire',
  description:
    'Data services for healthcare, financial services, technology, retail, education, professional services and the public sector — with genuine experience, no invented case studies.',
}

// Sector copy from an annotation partner's angle — every entry names
// the labelling work Lakspire actually delivers in that sector.
const industries = [
  {
    Glyph: HealthcareGlyph,
    accent: '#FF6B35',
    title: 'Healthcare & Life Sciences',
    body: 'De-identified clinical-text annotation, medical-imaging labelling and trial-record classification — with the sensitivity handling clinical data demands.',
  },
  {
    Glyph: FinanceGlyph,
    accent: '#F4A261',
    title: 'Financial Services',
    body: 'Transaction tagging, KYC document labelling and risk-signal annotation — where every label has to hold up under audit, not just under a demo.',
  },
  {
    Glyph: TechnologyGlyph,
    accent: '#FF8F5C',
    title: 'Technology',
    body: 'LLM training data, prompt/response evaluation, preference labelling and telemetry annotation for teams shipping real ML into production.',
  },
  {
    Glyph: RetailGlyph,
    accent: '#E9C46A',
    title: 'Retail & E-commerce',
    body: 'Product-catalogue attribute tagging, review-sentiment labelling and image classification that keeps merchandising, search and recommendation honest.',
  },
  {
    Glyph: EducationGlyph,
    accent: '#FABD6C',
    title: 'Education',
    body: 'Content classification, assessment-item tagging and learning-signal review for institutions, publishers and edtech ML teams.',
  },
  {
    Glyph: ProfessionalGlyph,
    accent: '#FF6B35',
    title: 'Professional Services',
    body: 'Contract & clause annotation, document redaction and knowledge-base tagging — confidential work, structured properly.',
  },
  {
    Glyph: PublicSectorGlyph,
    accent: '#F4A261',
    title: 'Public Sector',
    body: 'Record classification, form-field extraction and citizen-data annotation with the discipline that public work demands.',
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
        subtitle="Annotation is never sector-neutral. Below is where our labelling experience is genuine — the vocabularies, sensitivities and accuracy bars we've actually delivered against."
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
                  A clinical transcript needs one kind of care — a financial contract another, a
                  product-catalogue image another still. The annotation console underneath is
                  shared; the guidelines, taxonomies and review bar are tuned per sector.
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
                <TiltCard
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 ${
                    i === industries.length - 1 && industries.length % 3 === 1
                      ? 'lg:col-span-3'
                      : ''
                  }`}
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                    boxShadow: `0 18px 46px -22px ${ind.accent}55, inset 0 1px 0 0 var(--highlight-top)`,
                  }}
                  maxTilt={5}
                  lift={5}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-1/3 transition-[width] duration-500 group-hover:w-1/2"
                    style={{
                      background: `linear-gradient(90deg, ${ind.accent}, ${ind.accent}00)`,
                    }}
                  />
                  <span
                    className="industry-icon icon-plate relative z-10 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                    style={{
                      color: ind.accent,
                      ['--plate-accent' as string]: ind.accent,
                      transform: 'translateZ(20px)',
                    }}
                  >
                    <span aria-hidden className="industry-icon__ring" />
                    <ind.Glyph size={34} />
                  </span>
                  <p
                    className="relative z-10 mb-3 text-[15.5px] font-medium"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-strong)',
                      letterSpacing: '-0.01em',
                      transform: 'translateZ(14px)',
                    }}
                  >
                    {ind.title}
                  </p>
                  <p
                    className="relative z-10 text-[13.5px] leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                  >
                    {ind.body}
                  </p>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerGroup>
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
