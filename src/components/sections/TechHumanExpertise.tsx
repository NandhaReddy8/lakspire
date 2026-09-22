import { FadeIn } from '@/components/motion/FadeIn'
import { SectionLabel } from '@/components/blocks/SectionLabel'

const stats = [
  { value: '99.2%', label: 'Average accuracy across all annotation projects' },
  { value: '< 24h', label: 'Typical turnaround for standard processing tasks' },
  { value: '50+', label: 'Enterprise clients across 12 countries' },
  { value: '2.4M+', label: 'Records processed daily at peak capacity' },
]

export function TechHumanExpertise() {
  return (
    <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="tech-human">
      <div className="mx-auto max-w-container container-pad">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <FadeIn>
            <SectionLabel className="mb-4">Technology + Human Expertise</SectionLabel>
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
              Neither alone
              <br />
              <span className="text-white/40">is sufficient.</span>
            </h2>
            <p className="text-[15.5px] leading-relaxed text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
              Automation handles volume. Expert humans handle judgement. The Lakspire model combines proprietary processing technology with specialist teams — so you benefit from scale without sacrificing quality.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Proprietary QA tooling built for data operations',
                'Specialist domain experts across 20+ verticals',
                'Automated validation with human exception review',
                'Continuous model improvement through feedback loops',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#E9C46A] opacity-70" />
                  <p className="text-[14.5px] text-white/60" style={{ fontFamily: 'var(--font-body)' }}>{point}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
                >
                  <p
                    className="mb-1.5 text-[2rem] font-[300] text-white/85"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1 }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[13px] leading-snug text-white/50" style={{ fontFamily: 'var(--font-body)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
