import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

const industries = [
  { name: 'Healthcare & Life Sciences', desc: 'Clinical data, medical records, trial datasets', accent: '#FF6B35' },
  { name: 'Financial Services',          desc: 'Transactions, compliance, risk data processing', accent: '#F4A261' },
  { name: 'Technology',                  desc: 'Product analytics, telemetry, AI training data',   accent: '#FF8F5C' },
  { name: 'Retail & E-commerce',         desc: 'Catalogue data, customer behaviour, inventory',    accent: '#E9C46A' },
  { name: 'Education',                   desc: 'Learning content, assessment data, LMS analytics', accent: '#FABD6C' },
  { name: 'Professional Services',       desc: 'Document processing, knowledge management',        accent: '#FF6B35' },
  { name: 'Public Sector',               desc: 'Government data, citizen services, public records', accent: '#F4A261' },
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
            <p
              className="text-[14px] leading-relaxed text-white/40"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              We understand that data challenges vary by industry. Our teams bring domain knowledge
              alongside data expertise.
            </p>
            <Link
              href="/industries"
              className="group mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#F4A261] transition-colors hover:text-[#FFB07A]"
            >
              See all sectors
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </FadeIn>

          <StaggerGroup className="lg:col-span-3 space-y-2">
            {industries.map((industry) => (
              <StaggerItem key={industry.name}>
                <Link
                  href="/industries"
                  className="link-card"
                  style={{ ['--card-accent' as string]: industry.accent }}
                >
                  <span aria-hidden="true" className="lc-bar" />
                  <span aria-hidden="true" className="lc-sweep" />
                  <p
                    className="text-[13.5px] font-medium text-white/80"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {industry.name}
                  </p>
                  <p
                    className="text-[12px] text-white/40"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {industry.desc}
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
