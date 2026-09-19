import Link from 'next/link'
import {
  ArrowRight,
  Layers,
  Tags,
  Cpu,
  Users,
  Database,
  FileSearch,
} from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { AICapabilityRadial } from '@/components/illustrations/AICapabilityRadial'

export const metadata = {
  title: 'AI & Data Solutions — Lakspire',
  description:
    'Structured, validated and human-reviewed data services for modern AI and machine-learning workflows — annotation, classification, human-in-the-loop, training data and intelligent document processing.',
}

// Capability copy from a data-annotation partner's angle. Every card
// names a concrete labelling deliverable rather than an abstract "AI
// capability" — the honest framing for a company whose core service
// is data annotation.
const capabilities = [
  {
    Icon: Layers,
    accent: '#FF6B35',
    title: 'Data Annotation',
    body: 'Structured labelling across text, image, audio and video — bounding boxes, segmentation, transcription, entity and intent tags — delivered with clear guidelines and calibrated reviewers.',
  },
  {
    Icon: Tags,
    accent: '#F4A261',
    title: 'Data Classification',
    body: 'Multi-label taxonomy application at scale — intent, topic, sentiment, entity — with disciplined guideline enforcement so every sample lands in the right bucket.',
  },
  {
    Icon: Cpu,
    accent: '#FF8F5C',
    title: 'Assisted Labelling Pipelines',
    body: 'Model-assisted pre-labels reviewed by humans, tuned pipeline by pipeline — throughput without giving up the accuracy that matters at review time.',
  },
  {
    Icon: Users,
    accent: '#E9C46A',
    title: 'Human-in-the-Loop Review',
    body: 'Reviewers correcting live model predictions in the loop — the safety net that turns a promising model into a production-ready one, and produces correction sets for retraining.',
  },
  {
    Icon: Database,
    accent: '#FABD6C',
    title: 'Training & Evaluation Datasets',
    body: 'Assembled, versioned training splits, evaluation gold sets and preference-labelled datasets — prepared for real ML pipelines with provenance you can audit.',
  },
  {
    Icon: FileSearch,
    accent: '#FF6B35',
    title: 'Document Annotation',
    body: 'Field, clause and entity annotation on documents — invoices, forms, contracts, records — where accuracy under variation is the only useful measure.',
  },
]

export default function AIPage() {
  return (
    <>
      <PageHero
        eyebrow="AI & Data Solutions"
        title={
          <>
            <span className="text-gradient-primary">
              Better models start <span className="editorial">with better labels</span>.
            </span>
          </>
        }
        subtitle="Every AI or ML system is only as reliable as the labelled data behind it. Lakspire is a data-annotation partner — structured labelling, human-in-the-loop review and versioned training sets, built for real models in real deployments."
      >
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-200 active:scale-[0.98]"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)',
            boxShadow:
              '0 0 0 1px rgba(255,107,53,0.3), 0 10px 30px -6px rgba(255,107,53,0.4)',
          }}
        >
          Explore AI solutions
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </PageHero>

      {/* Radial illustration + narrative */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="capabilities">
        <div className="mx-auto max-w-container container-pad">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <FadeIn>
              <SectionLabel className="mb-4">Where we help</SectionLabel>
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
                Six annotation capabilities that meet real ML teams where they are.
              </h2>
              <p
                className="text-[15px] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
              >
                Everything below is annotation work Lakspire genuinely delivers — from
                prototype-grade labelling to production-scale evaluation gold sets. Structured
                guidelines, calibrated reviewers and quality controls, engagement after engagement.
              </p>

              <ClayFrame className="mt-10" variant="petal">
                <AICapabilityRadial />
              </ClayFrame>
            </FadeIn>

            <StaggerGroup className="space-y-3">
              {capabilities.map((c) => (
                <StaggerItem key={c.title}>
                  <Link
                    href="/contact"
                    className="link-card link-card--icon"
                    style={{ ['--card-accent' as string]: c.accent }}
                  >
                    <span aria-hidden="true" className="lc-bar" />
                    <span aria-hidden="true" className="lc-sweep" />
                    <span
                      className="lc-plate icon-plate mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-lg"
                      style={{
                        color: c.accent,
                        ['--plate-accent' as string]: c.accent,
                      }}
                    >
                      <c.Icon size={18} strokeWidth={1.5} />
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
                        {c.title}
                      </p>
                      <p
                        className="text-[13.5px] leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                      >
                        {c.body}
                      </p>
                    </div>
                    <span aria-hidden="true" className="lc-chev">→</span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
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
                Have annotation, evaluation or document-labelling work in flight?
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
                Talk to us
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
