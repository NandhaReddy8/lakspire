import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { AboutTeamScene } from '@/components/illustrations/AboutTeamScene'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'About — Lakspire',
  description:
    'Lakspire is a data and technology services company helping organisations manage, process and make better use of information — through structured data services, analytics and human-in-the-loop AI workflows.',
}

const values = [
  { name: 'Accuracy', body: 'Reliable, structured, quality-controlled data — every deliverable.' },
  { name: 'Integrity', body: 'What we claim, we can prove. What we can\'t, we don\'t claim.' },
  { name: 'Security', body: 'Client information is handled with appropriate confidentiality practices.' },
  { name: 'Collaboration', body: 'We work as an extension of your team, not a black-box vendor.' },
  { name: 'Adaptability', body: 'Workflows shaped to your requirements — not forced into ours.' },
  { name: 'Continuous Improvement', body: 'Feedback and outcomes feed back into the next engagement.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Lakspire"
        title={
          <>
            <span className="text-gradient-primary">
              Data, technology and <span className="editorial">human expertise</span>
            </span>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>—brought together with intent.</span>
          </>
        }
        subtitle="Lakspire is a data and technology services company focused on helping organisations manage, process and make better use of information across the data lifecycle."
      />

      {/* Narrative */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="story">
        <div className="mx-auto max-w-container container-pad">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeIn>
              <SectionLabel className="mb-4">Our story</SectionLabel>
              <h2
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                  fontWeight: 350,
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  color: 'var(--text-strong)',
                }}
              >
                Built around what the data lifecycle actually needs.
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div
                className="space-y-5 text-[15px] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
              >
                <p>
                  Our work spans the data lifecycle — from collection and processing to cleansing,
                  classification, validation, management, reporting and analysis. We also support AI
                  and machine-learning workflows through data annotation, labelling, preparation and
                  human-in-the-loop quality processes.
                </p>
                <p>
                  Our approach starts with understanding what the client actually needs to achieve.
                  From there we design a practical workflow, maintain quality throughout delivery,
                  and provide outputs in the format and structure required to be useful.
                </p>
                <p>
                  We combine structured data services, analytics, technology-enabled workflows and
                  human expertise — neither pure automation nor pure manual work handles real data
                  well on its own.
                </p>
              </div>
              <ClayFrame className="mt-10" variant="petal">
                <AboutTeamScene />
              </ClayFrame>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="mission">
        <div className="mx-auto max-w-container container-pad">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {[
              {
                label: 'Mission',
                title: 'Help organisations make better use of their data.',
                body: 'By combining reliable data services, technology and human expertise — matched to the outcome the client actually needs.',
                accent: '#FF6B35',
              },
              {
                label: 'Vision',
                title:
                  'A trusted global partner for data, analytics and AI-enabled business solutions.',
                body: 'Working with organisations across markets and industries, delivering work that stands up to scrutiny.',
                accent: '#E9C46A',
              },
            ].map((card, i) => (
              <FadeIn key={card.label} delay={i * 0.1}>
                <div
                  className="relative flex h-full flex-col rounded-2xl border p-8 md:p-10"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                    boxShadow: `0 22px 60px -22px ${card.accent}44, inset 0 1px 0 0 var(--highlight-top)`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-1/3"
                    style={{
                      background: `linear-gradient(90deg, ${card.accent}, ${card.accent}00)`,
                    }}
                  />
                  <p
                    className="mb-4 text-[11px] font-semibold uppercase"
                    style={{
                      letterSpacing: '0.16em',
                      fontFamily: 'var(--font-body)',
                      color: card.accent,
                    }}
                  >
                    {card.label}
                  </p>
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.4rem, 1.1rem + 1vw, 1.85rem)',
                      fontWeight: 400,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-strong)',
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-[14.5px] leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                  >
                    {card.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="values">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <SectionLabel className="mb-4">Values</SectionLabel>
            <h2
              className="mb-12 max-w-3xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                fontWeight: 350,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'var(--text-strong)',
              }}
            >
              Six things that show up in every engagement.
            </h2>
          </FadeIn>
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <StaggerItem key={v.name}>
                <div
                  className="flex h-full items-start gap-3 rounded-xl border p-5 transition-colors"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                  }}
                >
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: i % 2 === 0 ? '#FF6B35' : '#E9C46A', opacity: 0.75 }}
                  />
                  <div>
                    <p
                      className="mb-1 text-[14px] font-medium"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--text-strong)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {v.name}
                    </p>
                    <p
                      className="text-[13px] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                    >
                      {v.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
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
                Have a data challenge you&apos;d like a second opinion on?
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
