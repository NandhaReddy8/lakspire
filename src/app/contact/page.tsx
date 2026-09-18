import { Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { PageHero } from '@/components/blocks/PageHero'
import { ContactForm } from '@/components/forms/ContactForm'
import { ClayFrame } from '@/components/blocks/ClayFrame'
import { ContactCallScene } from '@/components/illustrations/ContactCallScene'
import { FadeIn } from '@/components/motion/FadeIn'
import { siteConfig } from '@/data/siteConfig'

export const metadata = {
  title: 'Contact — Lakspire',
  description:
    'Tell us about your project, dataset or business requirement. A member of the Lakspire team will reply within one working day.',
}

const promises = [
  {
    Icon: MessageCircle,
    title: 'A real reply, not a form letter',
    body: 'Someone on the team reads every enquiry and writes back with a considered next step.',
  },
  {
    Icon: Mail,
    title: 'One working day',
    body: "You'll hear from us within 24 hours (Mon–Fri). Complex enquiries get a full response within two days.",
  },
  {
    Icon: ShieldCheck,
    title: 'Confidential by default',
    body: 'What you share stays with the small team assessing your requirement. NDAs are welcome.',
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            <span className="text-gradient-primary">
              Let&apos;s turn your data <span className="editorial">into decisions</span>.
            </span>
            <br />
            <span style={{ color: 'var(--text-muted)' }}>Tell us what you&apos;re working on.</span>
          </>
        }
        subtitle="Whether it's a dataset that needs structure, a model that needs training data, or an operational workflow that needs sharper information — write a few lines and the team will get back to you."
      />

      <section
        className="relative py-section border-t border-white/[0.05]"
        data-scroll-anchor="form"
      >
        <div className="mx-auto max-w-container container-pad">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
            {/* Left: promises + contact info */}
            <div>
              <FadeIn>
                <p
                  className="mb-4 text-[11px] font-semibold uppercase"
                  style={{
                    letterSpacing: '0.14em',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-muted)',
                  }}
                >
                  What to expect
                </p>
                <ul className="space-y-6">
                  {promises.map((p) => (
                    <li key={p.title} className="flex items-start gap-4">
                      <span
                        className="icon-plate mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          color: '#FF8F5C',
                          ['--plate-accent' as string]: '#FF6B35',
                        }}
                      >
                        <p.Icon size={17} strokeWidth={1.5} />
                      </span>
                      <div>
                        <p
                          className="mb-1 text-[14.5px] font-medium"
                          style={{
                            fontFamily: 'var(--font-display)',
                            color: 'var(--text-strong)',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {p.title}
                        </p>
                        <p
                          className="text-[13.5px] leading-relaxed"
                          style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                        >
                          {p.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.15}>
                <ClayFrame className="mt-10" variant="drop">
                  <ContactCallScene />
                </ClayFrame>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div
                  className="mt-8 rounded-2xl border p-6"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                  }}
                >
                  <p
                    className="mb-2 text-[11px] font-semibold uppercase"
                    style={{
                      letterSpacing: '0.14em',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-faint)',
                    }}
                  >
                    Prefer a direct line?
                  </p>
                  <p
                    className="text-[15px]"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-strong)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="transition-colors hover:text-[#FF8F5C]"
                    >
                      {siteConfig.email}
                    </a>
                  </p>
                  <p
                    className="mt-1 text-[13px]"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                  >
                    Confidential enquiries go directly to the team.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Right: the form */}
            <FadeIn delay={0.1}>
              <div
                className="rounded-3xl border p-7 md:p-10"
                style={{
                  borderColor: 'var(--border-glass)',
                  background:
                    'linear-gradient(160deg, rgba(28, 23, 19, 0.55) 0%, rgba(20, 16, 13, 0.35) 100%)',
                  boxShadow:
                    '0 22px 60px -18px rgba(255,107,53,0.35), inset 0 1px 0 0 var(--highlight-top)',
                }}
              >
                <ContactForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
