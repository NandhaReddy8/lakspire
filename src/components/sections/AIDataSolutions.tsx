import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { WorkflowBackground } from '@/components/motion/WorkflowBackground'
import { AICapabilityRadial } from '@/components/illustrations/AICapabilityRadial'
import { ClayFrame } from '@/components/blocks/ClayFrame'

const capabilities = [
  { label: 'LLM Fine-tuning Data', desc: 'High-quality instruction-tuning and preference datasets', accent: '#FF6B35' },
  { label: 'Model Evaluation',     desc: 'Expert-graded evaluation sets and benchmark construction',   accent: '#F4A261' },
  { label: 'RAG Pipeline Support', desc: 'Structured retrieval corpora and knowledge base curation',   accent: '#FF8F5C' },
  { label: 'Agent Workflow Data',  desc: 'Tool-use traces, trajectory grading and RL environments',    accent: '#E9C46A' },
  { label: 'Multimodal Datasets',  desc: 'Image, audio, video and document annotation at scale',       accent: '#FABD6C' },
  { label: 'Data Curation',        desc: 'Deduplication, filtering and quality scoring pipelines',     accent: '#FF6B35' },
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
            <p className="mb-6 text-[15px] leading-relaxed text-white/45" style={{ fontFamily: 'var(--font-body)' }}>
              The quality of your AI is a direct function of the quality of your data. We specialise in building the datasets that frontier AI teams rely on — from initial scoping to production-scale delivery.
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

          {/* Right: capability list — each entry links to the AI page */}
          <StaggerGroup className="space-y-2 lg:self-center">
            {capabilities.map((cap) => (
              <StaggerItem key={cap.label}>
                <Link
                  href="/ai-data-solutions"
                  className="link-card"
                  style={{ ['--card-accent' as string]: cap.accent }}
                >
                  <span aria-hidden="true" className="lc-bar" />
                  <span aria-hidden="true" className="lc-sweep" />
                  <p
                    className="text-[13.5px] font-medium text-white/80"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {cap.label}
                  </p>
                  <p
                    className="text-[12px] text-white/40"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {cap.desc}
                  </p>
                  <span aria-hidden="true" className="lc-chev">→</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
