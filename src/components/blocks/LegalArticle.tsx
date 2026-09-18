import { ReactNode } from 'react'
import { FadeIn } from '@/components/motion/FadeIn'

export interface LegalSection {
  heading: string
  body: ReactNode
}

interface LegalArticleProps {
  effectiveDate: string
  intro: ReactNode
  sections: LegalSection[]
  footer?: ReactNode
}

/**
 * LegalArticle
 * ────────────
 * Long-form legal-page body: TOC on the left, numbered sections on the
 * right. Structured, quiet, easy to read on both themes. Copy is expected
 * to be short-paragraph plain prose; no marketing headers, no hero
 * illustration. Intended for Privacy Policy, Terms & Conditions and
 * similar pages.
 */
export function LegalArticle({ effectiveDate, intro, sections, footer }: LegalArticleProps) {
  return (
    <section className="py-section border-t border-white/[0.05]" data-scroll-anchor="body">
      <div className="mx-auto max-w-container container-pad">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-16">
          {/* TOC */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p
              className="mb-2 text-[11px] font-semibold uppercase"
              style={{
                letterSpacing: '0.14em',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-faint)',
              }}
            >
              Effective
            </p>
            <p
              className="mb-8 text-[14px]"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-strong)',
                letterSpacing: '-0.01em',
              }}
            >
              {effectiveDate}
            </p>
            <p
              className="mb-4 text-[11px] font-semibold uppercase"
              style={{
                letterSpacing: '0.14em',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-faint)',
              }}
            >
              Contents
            </p>
            <ol className="space-y-2.5">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a
                    href={`#section-${i + 1}`}
                    className="group flex items-baseline gap-3 text-[13px] transition-colors hover:text-[#FF8F5C]"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
                  >
                    <span
                      className="text-[11px]"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}
                    >
                      0{i + 1}
                    </span>
                    <span className="leading-snug">{s.heading}</span>
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          {/* Body */}
          <div>
            <FadeIn>
              <div
                className="mb-14 text-[15.5px] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
              >
                {intro}
              </div>
            </FadeIn>

            <div className="space-y-14">
              {sections.map((s, i) => (
                <FadeIn key={s.heading} delay={i * 0.03}>
                  <article id={`section-${i + 1}`} className="scroll-mt-28">
                    <p
                      className="mb-3 text-[11px] font-semibold uppercase"
                      style={{
                        letterSpacing: '0.14em',
                        fontFamily: 'var(--font-mono)',
                        color: '#F4A261',
                      }}
                    >
                      Section 0{i + 1}
                    </p>
                    <h2
                      className="mb-5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.35rem, 1.1rem + 0.9vw, 1.7rem)',
                        fontWeight: 400,
                        lineHeight: 1.18,
                        letterSpacing: '-0.02em',
                        color: 'var(--text-strong)',
                      }}
                    >
                      {s.heading}
                    </h2>
                    <div
                      className="space-y-4 text-[15px] leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)' }}
                    >
                      {s.body}
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>

            {footer && (
              <FadeIn delay={0.05}>
                <div
                  className="mt-14 rounded-2xl border p-6"
                  style={{
                    borderColor: 'var(--border-glass)',
                    background: 'var(--card-surface)',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {footer}
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
