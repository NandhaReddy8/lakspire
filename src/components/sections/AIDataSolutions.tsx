import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { WorkflowBackground } from '@/components/motion/WorkflowBackground'
import { AICapabilityRadial } from '@/components/illustrations/AICapabilityRadial'
import { ClayFrame } from '@/components/blocks/ClayFrame'

const capabilities = [
  { label: 'LLM Fine-tuning Labels',  desc: 'Instruction-tuning and preference-labelled datasets',      accent: '#FF6B35' },
  { label: 'Evaluation Gold Sets',    desc: 'Expert-graded evaluation sets and benchmark annotations',  accent: '#F4A261' },
  { label: 'RAG Corpus Labelling',    desc: 'Structured retrieval corpora and knowledge-base tagging',  accent: '#FF8F5C' },
  { label: 'Agent Trajectory Data',   desc: 'Tool-use traces, trajectory grading and RL-ready labels',  accent: '#E9C46A' },
  { label: 'Multimodal Annotation',   desc: 'Image, audio, video and document labelling at scale',      accent: '#FABD6C' },
  { label: 'Pre-labelling Curation',  desc: 'Deduplication, redaction and sample-quality scoring',      accent: '#FF6B35' },
]

export function AIDataSolutions() {
  return (
    <section className="relative py-section border-t border-white/[0.05]" data-reveal data-scroll-anchor="ai-data">
      <WorkflowBackground />
      <div className="relative mx-auto max-w-container container-pad">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          {/* Left */}
          <FadeIn>
            <SectionLabel className="mb-4">AI & Data Solutions</SectionLabel>
            <h2
              className="mb-5 text-white/90"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 1.4rem + 2vw, 2.75rem)',
                fontWeight: 350,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
              }}
            >
              Building Better AI
              <br />
              With Better Data.
            </h2>
            <p className="mb-6 text-[15px] leading-relaxed text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
              The quality of your AI is a direct function of the quality of your labels. Lakspire is a data-annotation partner — we build and maintain the labelled datasets frontier AI teams actually rely on, from initial scoping to production-scale delivery.
            </p>
            <Link
              href="/ai-data-solutions"
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#FF8F5C] transition-colors hover:text-[#FFB07A]"
            >
              Explore AI solutions
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <ClayFrame className="mt-10" variant="petal">
              <AICapabilityRadial />
            </ClayFrame>
          </FadeIn>

          {/* Right: capability cards — 2-column grid.
              Visually distinct from Industries link-rows: these sit inside
              individual bordered cards. Same font scale as Industries for
              consistency across the two home-page sections. */}
          <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:self-center">
            {capabilities.map((cap) => (
              <StaggerItem key={cap.label}>
                <Link
                  href="/ai-data-solutions"
                  className="ai-cap-card group relative flex h-full flex-col overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                    ['--cap-accent' as string]: cap.accent,
                  }}
                >
                  {/* Accent left strip */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-all duration-500"
                    style={{ background: cap.accent, opacity: 0.7 }}
                  />

                  {/* Radial bloom on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse 90% 90% at 0% 0%, ${cap.accent}1A, transparent 65%)`,
                    }}
                  />

                  <p
                    className="relative text-[14px] font-medium leading-snug"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-strong)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {cap.label}
                  </p>
                  <p
                    className="relative mt-2 text-[13px] leading-relaxed"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {cap.desc}
                  </p>

                  {/* Bottom divider + chevron — chevron appears on hover */}
                  <div className="relative mt-auto flex items-center gap-2 pt-4">
                    <span
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(90deg, ${cap.accent}50, transparent)`,
                      }}
                    />
                    <span
                      className="text-[11px] opacity-0 transition-all duration-200 group-hover:opacity-100"
                      style={{ color: cap.accent }}
                    >
                      →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
