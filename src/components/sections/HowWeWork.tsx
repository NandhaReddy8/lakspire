import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { WorkflowBackground } from '@/components/motion/WorkflowBackground'

const steps = [
  { num: '01', title: 'Understand', desc: 'We start with your data challenge — scope, sources, quality targets and business outcome.' },
  { num: '02', title: 'Plan', desc: 'A tailored delivery plan covering methodology, tooling, team structure and timeline.' },
  { num: '03', title: 'Process', desc: 'Execution against agreed specifications, with transparent progress reporting.' },
  { num: '04', title: 'Quality Control', desc: 'Multi-stage QA across automated checks and expert human review.' },
  { num: '05', title: 'Deliver', desc: 'Structured output in your required format, integrated to your systems.' },
  { num: '06', title: 'Improve', desc: 'Continuous feedback loop to refine quality, reduce cost and increase speed over time.' },
]

export function HowWeWork() {
  return (
    <section className="relative py-section" data-reveal data-scroll-anchor="how-we-work">
      <WorkflowBackground />
      <div className="relative mx-auto max-w-container container-pad">
        <FadeIn>
          <SectionLabel className="mb-4">How We Work</SectionLabel>
          <h2
            className="max-w-xl text-white/90"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 1.5rem + 2.5vw, 3.25rem)',
              fontWeight: 350,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            A process built for
            <span className="text-white/40"> precision.</span>
          </h2>
        </FadeIn>

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => (
            <StaggerItem key={step.num}>
              <div className="relative pl-6">
                {/* Vertical accent line */}
                <div
                  className="absolute left-0 top-1 h-full w-px"
                  style={{ background: 'linear-gradient(to bottom, rgba(255,107,53,0.4) 0%, transparent 100%)' }}
                />
                <p
                  className="mb-2 text-[11px] font-semibold text-[#FF6B35]/60"
                  style={{ letterSpacing: '0.08em', fontFamily: 'var(--font-body)' }}
                >
                  {step.num}
                </p>
                <h3
                  className="mb-2 text-[15px] font-semibold text-white/80"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
                >
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
                  {step.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
