import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { WorkflowBackground } from '@/components/motion/WorkflowBackground'
import { AICapabilityRadial } from '@/components/illustrations/AICapabilityRadial'
import { ClayFrame } from '@/components/blocks/ClayFrame'

const capabilities = [
  { label: 'LLM Fine-tuning Data', desc: 'High-quality instruction-tuning and preference datasets' },
  { label: 'Model Evaluation', desc: 'Expert-graded evaluation sets and benchmark construction' },
  { label: 'RAG Pipeline Support', desc: 'Structured retrieval corpora and knowledge base curation' },
  { label: 'Agent Workflow Data', desc: 'Tool-use traces, trajectory grading and RL environments' },
  { label: 'Multimodal Datasets', desc: 'Image, audio, video and document annotation at scale' },
  { label: 'Data Curation', desc: 'Deduplication, filtering and quality scoring pipelines' },
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
            <p className="mb-8 text-[15px] leading-relaxed text-white/45" style={{ fontFamily: 'var(--font-body)' }}>
              The quality of your AI is a direct function of the quality of your data. We specialise in building the datasets that frontier AI teams rely on — from initial scoping to production-scale delivery.
            </p>

            {/* Animated radial capability diagram wrapped in the
                ClayFrame — an organic goofy-smooth blob silhouette
                instead of a rectangular box, so the animation feels
                sculpted into the layout rather than walled off. Keeps
                a warm-dark viewport in both themes so ember/gold
                accents retain their contrast. */}
            <ClayFrame className="mt-8" variant="petal">
              <AICapabilityRadial />
            </ClayFrame>
          </FadeIn>

          {/* Right: capability list */}
          <StaggerGroup className="space-y-2 lg:self-center">
            {capabilities.map((cap) => (
              <StaggerItem key={cap.label}>
                <div className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/[0.1] hover:bg-white/[0.035]">
                  <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35] opacity-70" />
                  <div>
                    <p className="text-[13.5px] font-medium text-white/75" style={{ fontFamily: 'var(--font-display)' }}>{cap.label}</p>
                    <p className="text-[12px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>{cap.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
