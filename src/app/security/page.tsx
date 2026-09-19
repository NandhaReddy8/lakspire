import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { SectionLabel } from '@/components/blocks/SectionLabel'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { SecurityShieldScene } from '@/components/illustrations/SecurityShieldScene'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import {
  ConfidentialityGlyph,
  AccessGlyph,
  TransferGlyph,
  HandlingGlyph,
  ReviewGlyph,
  RetentionGlyph,
  ProtectionGlyph,
  PactGlyph,
} from '@/components/icons/SecurityGlyphs'

export const metadata = {
  title: 'Security & Data Protection — Lakspire',
  description:
    'How Lakspire approaches data confidentiality, access controls, secure transfer, quality assurance, retention and client confidentiality — matched to actual technical controls, not marketing claims.',
}

const practices = [
  {
    Glyph: ConfidentialityGlyph,
    accent: '#FF6B35',
    title: 'Data confidentiality',
    body: 'Client information is treated as confidential by default. NDAs are welcomed, expected and honoured.',
  },
  {
    Glyph: AccessGlyph,
    accent: '#F4A261',
    title: 'Role-based access controls',
    body: 'Access to client datasets is restricted to the team assigned to the engagement, on a need-to-know basis.',
  },
  {
    Glyph: TransferGlyph,
    accent: '#FF8F5C',
    title: 'Secure data transfer',
    body: 'Data is transferred over encrypted channels using client-approved mechanisms. No unencrypted transit.',
  },
  {
    Glyph: HandlingGlyph,
    accent: '#E9C46A',
    title: 'Data handling procedures',
    body: 'Documented processes for how data is stored, accessed, processed and reviewed during an engagement.',
  },
  {
    Glyph: ReviewGlyph,
    accent: '#FABD6C',
    title: 'Quality assurance & review',
    body: 'Layered quality checks — including human review where accuracy or context matters — before delivery.',
  },
  {
    Glyph: RetentionGlyph,
    accent: '#FF6B35',
    title: 'Retention & deletion',
    body: 'Data is retained only as long as the engagement requires, then securely deleted per the agreed schedule.',
  },
  {
    Glyph: ProtectionGlyph,
    accent: '#F4A261',
    title: 'Applicable data protection',
    body: 'We aim to align with the data-protection requirements relevant to your jurisdiction and use case.',
  },
  {
    Glyph: PactGlyph,
    accent: '#FF8F5C',
    title: 'Client confidentiality',
    body: 'What we work on, and for whom, stays private unless the client agrees to have it referenced publicly.',
  },
]

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Security & Data Protection"
        title={
          <>
            <span className="text-gradient-primary">
              Responsible data handling <span className="editorial">is central to trust</span>.
            </span>
          </>
        }
        subtitle="Our processes are designed around appropriate confidentiality, access control, secure transfer, quality assurance and data-handling practices — matched to what our controls actually deliver."
      />

      {/* Shield illustration + intro */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="shield">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <ClayFrame variant="drop">
                <SecurityShieldScene />
              </ClayFrame>
              <div>
                <SectionLabel className="mb-4">Always on</SectionLabel>
                <h2
                  className="mb-5"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                    fontWeight: 350,
                    lineHeight: 1.12,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-strong)',
                  }}
                >
                  Encryption at rest and in transit — every engagement.
                </h2>
                <p
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                >
                  We take confidentiality as a starting position, not an add-on. What&apos;s below
                  is what we do consistently — nothing certified we don&apos;t hold, nothing claimed
                  we can&apos;t evidence.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Practices grid — same hover language as the services + AI
          Data Solutions cards. Each card carries a P01-P08 mono chip
          echoing the R01-R09 role-card treatment. */}
      <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="practices">
        <div className="mx-auto max-w-container container-pad">
          <FadeIn>
            <SectionLabel className="mb-4">How we handle client data</SectionLabel>
            <h2
              className="mb-4 max-w-3xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 1.35rem + 1.8vw, 2.5rem)',
                fontWeight: 350,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                color: 'var(--text-strong)',
              }}
            >
              Eight practices that shape every engagement.
            </h2>
            <p
              className="mb-12 max-w-2xl text-[15px] leading-relaxed"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
            >
              Confidentiality, access, transit and quality are engineering choices — not
              marketing lines. Below is what every engagement actually does.
            </p>
          </FadeIn>
          <StaggerGroup
            staggerDelay={0.06}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5"
          >
            {practices.map((p, i) => {
              const id = `P${String(i + 1).padStart(2, '0')}`
              return (
                <StaggerItem key={p.title}>
                  <article
                    className="practice-card link-card link-card--icon"
                    style={{ ['--card-accent' as string]: p.accent }}
                  >
                    <span aria-hidden="true" className="lc-bar" />
                    <span aria-hidden="true" className="lc-sweep" />
                    <span
                      className="lc-plate icon-plate inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        color: p.accent,
                        ['--plate-accent' as string]: p.accent,
                      }}
                    >
                      <p.Glyph size={26} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <p
                          className="text-[15.5px] font-medium"
                          style={{
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text-strong)',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.25,
                          }}
                        >
                          {p.title}
                        </p>
                        <span
                          className="shrink-0 text-[10px] font-medium uppercase"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.16em',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {id}
                        </span>
                      </div>
                      <p
                        className="text-[13.5px] leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
                      >
                        {p.body}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              )
            })}
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
                Have specific security or compliance requirements?
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
                Tell us what you need
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
