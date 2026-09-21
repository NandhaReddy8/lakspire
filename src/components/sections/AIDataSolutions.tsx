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

        {/* ── Row 1: illustration left · copy right ── */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <FadeIn>
            <ClayFrame variant="petal">
              <AICapabilityRadial />
            </ClayFrame>
          </FadeIn>

          <FadeIn delay={0.1}>
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
          </FadeIn>
        </div>

        {/* ── Row 2: full-width capability cards ── */}
        <StaggerGroup className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <StaggerItem key={cap.label}>
              <Link
                href="/ai-data-solutions"
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border p-5"
                style={{
                  borderColor: 'var(--border-glass)',
                  background: 'var(--card-surface)',
                  transition: 'transform 380ms cubic-bezier(0.16,1,0.3,1), box-shadow 380ms cubic-bezier(0.16,1,0.3,1)',
                  willChange: 'transform',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-6px)'
                  el.style.boxShadow = `0 20px 48px -12px ${cap.accent}40`
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = ''
                  el.style.boxShadow = ''
                }}
              >
                {/* 1 — Top accent sweep: scaleX 0→1 on hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  style={{ background: `linear-gradient(90deg, ${cap.accent}, ${cap.accent}30)` }}
                />

                {/* 2 — Left strip: brightens on hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: cap.accent }}
                />

                {/* 3 — Glow ring overlay: border tints + drop shadow visible on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 0 1px ${cap.accent}45` }}
                />

                {/* 4 — Warm bloom fills from top-left corner */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse 100% 85% at 0% 0%, ${cap.accent}22, transparent 60%)`,
                  }}
                />

                {/* Content — z-index above all decorations */}
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

                {/* Bottom: gradient rule + chevron slides in */}
                <div className="relative mt-auto flex items-center gap-2 pt-4">
                  <span
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(90deg, ${cap.accent}45, transparent)` }}
                  />
                  <span
                    className="translate-x-2 text-[11px] opacity-0 transition-all duration-250 group-hover:translate-x-0 group-hover:opacity-90"
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
    </section>
  )
}
