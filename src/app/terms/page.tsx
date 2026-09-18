import Link from 'next/link'
import { PageHero } from '@/components/blocks/PageHero'
import { LegalArticle, LegalSection } from '@/components/blocks/LegalArticle'
import { siteConfig } from '@/data/siteConfig'

export const metadata = {
  title: 'Terms & Conditions — Lakspire',
  description:
    'The terms that govern use of the Lakspire website. Client engagements are governed by separate contracts, not these website terms.',
}

const sections: LegalSection[] = [
  {
    heading: 'These terms',
    body: (
      <>
        <p>
          By using this website you agree to these terms. If you do not agree, please do not use
          the site. Client engagements with Lakspire are governed by separate contracts and
          statements of work, not by these website terms.
        </p>
      </>
    ),
  },
  {
    heading: 'Information on this site',
    body: (
      <>
        <p>
          The content on this website is provided for general information about Lakspire and our
          services. We aim to keep it accurate and current, but the site may occasionally contain
          typographical, factual or availability errors, and content can change without notice.
        </p>
        <p>
          Nothing on this website constitutes a binding offer of services, a specific contractual
          commitment, or professional advice. Anything that reads like a specific claim about
          performance, industry experience or capability should be treated as descriptive; the
          formal scope of any engagement is set out in a separate contract.
        </p>
      </>
    ),
  },
  {
    heading: 'Acceptable use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Use the website in a way that could damage, disable or impair it</li>
          <li>Attempt unauthorised access to any part of the site or its underlying systems</li>
          <li>
            Use automated tools to scrape, harvest or extract information beyond ordinary browsing
          </li>
          <li>Submit content through the contact form that is unlawful, harmful or infringing</li>
          <li>Submit content that impersonates another person or organisation</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Contact form and enquiries',
    body: (
      <>
        <p>
          The contact form is offered as a convenience for prospective clients. You are responsible
          for the accuracy and legality of information you submit. Do not submit confidential
          third-party information or personal data of others without appropriate authority.
        </p>
        <p>
          At present the form is client-side only — details you enter are held in your browser
          during the session and are not transmitted to a server automatically. For confidential
          matters, email us directly at{' '}
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline underline-offset-2 hover:text-[#FF8F5C]"
          >
            {siteConfig.email}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    heading: 'Intellectual property',
    body: (
      <>
        <p>
          The Lakspire name, logo, page copy, illustrations and site design are the intellectual
          property of Lakspire (or licensed for its use). You may view, save and print pages for
          personal or internal business reference. Any other use — including reproduction,
          redistribution, or use of the Lakspire name or branding — requires our prior written
          consent.
        </p>
      </>
    ),
  },
  {
    heading: 'External links',
    body: (
      <>
        <p>
          Where this website links to third-party sites, those sites are outside our control. We
          are not responsible for their content, availability, or practices, and inclusion of a
          link is not an endorsement.
        </p>
      </>
    ),
  },
  {
    heading: 'Disclaimers and limitation of liability',
    body: (
      <>
        <p>
          This website is provided &quot;as is.&quot; To the maximum extent permitted by applicable
          law, Lakspire disclaims all express and implied warranties in relation to the website,
          including warranties of accuracy, fitness for a particular purpose and non-infringement.
        </p>
        <p>
          To the maximum extent permitted by applicable law, Lakspire is not liable for any
          indirect, incidental, special or consequential loss or damage arising out of use of, or
          inability to use, this website.
        </p>
        <p>
          Nothing in these terms limits or excludes liability that cannot lawfully be limited or
          excluded — including, where applicable, liability for death or personal injury caused by
          negligence, or for fraud.
        </p>
      </>
    ),
  },
  {
    heading: 'Governing law',
    body: (
      <>
        <p>
          These terms are governed by the laws of the jurisdiction in which Lakspire is established.
          If a dispute arises out of or in connection with your use of the site, the courts of that
          jurisdiction have exclusive authority — subject to any mandatory consumer-protection
          rights you may have where you reside.
        </p>
      </>
    ),
  },
  {
    heading: 'Changes to these terms',
    body: (
      <>
        <p>
          We may update these terms from time to time — most likely when the site&apos;s
          functionality changes (for example, when the contact form is wired to a backend, or when
          new interactive features are added). The effective date above will reflect the most
          recent revision. Continued use of the site after an update constitutes acceptance of the
          revised terms.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms & Conditions"
        title={
          <>
            <span className="text-gradient-primary">
              The rules of the road <span className="editorial">for this website</span>.
            </span>
          </>
        }
        subtitle="Website use only — client work is governed by the separate contract in place for each engagement."
      />
      <LegalArticle
        effectiveDate="18 September 2026"
        intro={
          <p>
            These terms apply to your use of the Lakspire website. They are intentionally short and
            plain-spoken. If anything below isn&apos;t clear, tell us — we&apos;d rather explain
            than hide behind legal boilerplate.
          </p>
        }
        sections={sections}
        footer={
          <p className="text-[14px] leading-relaxed">
            Questions about these terms? Write to{' '}
            <a
              href={`mailto:${siteConfig.email}`}
              className="underline underline-offset-2 hover:text-[#FF8F5C]"
            >
              {siteConfig.email}
            </a>{' '}
            — or start an{' '}
            <Link
              href="/contact"
              className="underline underline-offset-2 hover:text-[#FF8F5C]"
            >
              enquiry
            </Link>
            .
          </p>
        }
      />
    </>
  )
}
