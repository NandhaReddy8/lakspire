import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

const industries = [
  { name: 'Healthcare & Life Sciences', desc: 'Clinical data, medical records, trial datasets' },
  { name: 'Financial Services', desc: 'Transactions, compliance, risk data processing' },
  { name: 'Technology', desc: 'Product analytics, telemetry, AI training data' },
  { name: 'Retail & E-commerce', desc: 'Catalogue data, customer behaviour, inventory' },
  { name: 'Education', desc: 'Learning content, assessment data, LMS analytics' },
  { name: 'Professional Services', desc: 'Document processing, knowledge management' },
  { name: 'Public Sector', desc: 'Government data, citizen services, public records' },
]

export function Industries() {
  return (
    <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="industries">
      <div className="mx-auto max-w-container container-pad">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <FadeIn className="lg:col-span-2">
            <SectionLabel className="mb-4">Industries</SectionLabel>
            <h2
              className="mb-4 text-white/90"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 1.4rem + 1.8vw, 2.5rem)',
                fontWeight: 350,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
              }}
            >
              Expertise across
              every sector.
            </h2>
            <p className="text-[14px] leading-relaxed text-white/40" style={{ fontFamily: 'var(--font-body)' }}>
              We understand that data challenges vary by industry. Our teams bring domain knowledge alongside data expertise.
            </p>
          </FadeIn>

          <StaggerGroup className="lg:col-span-3 space-y-1.5">
            {industries.map((industry) => (
              <StaggerItem key={industry.name}>
                <div className="flex items-center justify-between rounded-lg border border-white/[0.06] px-4 py-3 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.02]">
                  <div>
                    <p className="text-[13.5px] font-medium text-white/75" style={{ fontFamily: 'var(--font-display)' }}>{industry.name}</p>
                    <p className="text-[11.5px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>{industry.desc}</p>
                  </div>
                  <span className="text-[12px] text-white/20">→</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
