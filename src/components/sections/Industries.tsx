import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

const industries = [
  { name: 'Healthcare & Life Sciences', desc: 'De-identified clinical text, medical imaging, trial-record annotation', accent: '#FF6B35' },
  { name: 'Financial Services',          desc: 'Transaction tagging, KYC document labelling, risk-signal annotation', accent: '#F4A261' },
  { name: 'Technology',                  desc: 'LLM training data, prompt evaluation, telemetry labelling',            accent: '#FF8F5C' },
  { name: 'Retail & E-commerce',         desc: 'Product-catalogue tagging, review sentiment, image classification',    accent: '#E9C46A' },
  { name: 'Education',                   desc: 'Content classification, assessment tagging, learning-signal review',   accent: '#FABD6C' },
  { name: 'Professional Services',       desc: 'Contract & clause annotation, redaction, knowledge tagging',           accent: '#FF6B35' },
  { name: 'Public Sector',               desc: 'Record classification, form extraction, citizen-data annotation',      accent: '#F4A261' },
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
              className="text-[15px] leading-relaxed text-white/50"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Annotation is never generic. Each sector has its own vocabulary, sensitivity and
              accuracy bar — and that&apos;s what we tune to, sector by sector.
            </p>
            <Link
              href="/industries"
              className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#FF6B35] transition-colors hover:text-[#FF8F5C]"
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
                    className="text-[14px] font-medium text-white/85"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {industry.name}
                  </p>
                  <p
                    className="text-[13px] text-white/45"
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
