import Link from 'next/link'
import { PageHero } from '@/components/blocks/PageHero'
import { LegalArticle, LegalSection } from '@/components/blocks/LegalArticle'
import { siteConfig } from '@/data/siteConfig'

export const metadata = {
  title: 'Privacy Policy — Lakspire',
  description:
    'How Lakspire handles personal information collected through this website — including contact-form enquiries, browser storage and third-party services.',
}

const sections: LegalSection[] = [
  {
    heading: 'Scope of this policy',
    body: (
      <>
        <p>
          This policy covers personal information Lakspire collects through this website only —
          principally through the contact form, direct email links, and browser storage used to
          remember your theme preference.
        </p>
        <p>
          Personal information Lakspire receives through separate client engagements is governed by
          the confidentiality and data-handling terms of the applicable contract, not this website
          policy.
        </p>
      </>
    ),
  },
  {
    heading: 'What information we collect',
    body: (
      <>
        <p>Through the contact form, you may voluntarily provide:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Your name and company</li>
          <li>Your business email and country</li>
          <li>An optional phone number</li>
          <li>The service you&apos;re enquiring about and a project description</li>
          <li>An optional expected timeline and file attachment</li>
        </ul>
        <p>
          The website stores a single browser preference (light or dark theme) in your
          browser&apos;s local storage. No advertising cookies, tracking pixels or cross-site
          identifiers are set by this website.
        </p>
      </>
    ),
  },
  {
    heading: 'How your enquiry is handled',
    body: (
      <>
        <p>
          The contact form on this static website does not currently send your enquiry to a server.
          The information you enter is held only in your browser&apos;s memory while you complete
          the form and is discarded when you close the page.
        </p>
        <p>
          If you use the direct email link ({' '}
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline underline-offset-2 hover:text-[#FF8F5C]"
          >
            {siteConfig.email}
          </a>{' '}
          ), your message is delivered by your own email client and received by the Lakspire team
          under standard email confidentiality practices.
        </p>
        <p>
          When the contact form is later connected to a server, this policy will be updated to
          describe how enquiry data is transmitted, stored, retained and deleted.
        </p>
      </>
    ),
  },
  {
    heading: 'How we use information',
    body: (
      <>
        <p>Any personal information you voluntarily share is used only to:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Understand and respond to your enquiry</li>
          <li>Provide requested information about our services</li>
          <li>Follow up on active engagement discussions</li>
        </ul>
        <p>
          We do not sell, rent or trade personal information collected through this website. We do
          not use it for marketing lists, targeted advertising or profiling.
        </p>
      </>
    ),
  },
  {
    heading: 'Retention and deletion',
    body: (
      <>
        <p>
          Enquiries delivered by direct email are retained by the Lakspire team for as long as
          reasonably necessary to respond and follow up. If a working relationship does not develop,
          the enquiry is deleted in the normal course of housekeeping.
        </p>
        <p>
          You can request deletion of any enquiry you&apos;ve sent us by writing to{' '}
          <a
            href={`mailto:${siteConfig.email}`}
            className="underline underline-offset-2 hover:text-[#FF8F5C]"
          >
            {siteConfig.email}
          </a>{' '}
          and we will remove it from active handling.
        </p>
      </>
    ),
  },
  {
    heading: 'Third parties',
    body: (
      <>
        <p>
          This website is a static site. It does not currently load third-party analytics,
          advertising, or social-tracking scripts. Fonts are self-hosted or served under first-party
          arrangements.
        </p>
        <p>
          If third-party services are added in future (for example, an analytics platform), this
          policy will be updated first, and — where required — appropriate consent controls will be
          added to the website.
        </p>
      </>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <>
        <p>
          Depending on your jurisdiction, you may have rights to access, correct, delete or object
          to the processing of personal information about you. To exercise any such right regarding
          information you&apos;ve shared through this website, contact{' '}
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
    heading: 'Changes to this policy',
    body: (
      <>
        <p>
          This policy will be updated as the website evolves — particularly if the contact form is
          wired to a backend, if analytics or third-party services are added, or if Lakspire&apos;s
          operations expand into jurisdictions with additional data-protection obligations. The
          effective date above will always reflect the most recent revision.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title={
          <>
            <span className="text-gradient-primary">
              How we handle <span className="editorial">what you share</span>.
            </span>
          </>
        }
        subtitle="Plain language, no dark patterns. This policy covers personal information collected through this website — updated as the site grows."
      />
      <LegalArticle
        effectiveDate="18 September 2026"
        intro={
          <p>
            Lakspire respects the privacy of anyone who visits this website. This policy explains
            what personal information we may collect through the site, how we use it, and the
            choices available to you. If you have questions about anything here, get in touch —
            we&apos;re happy to explain.
          </p>
        }
        sections={sections}
        footer={
          <>
            <p className="text-[14px] leading-relaxed">
              Questions about this policy? Write to{' '}
              <a
                href={`mailto:${siteConfig.email}`}
                className="underline underline-offset-2 hover:text-[#FF8F5C]"
              >
                {siteConfig.email}
              </a>{' '}
              — or start a{' '}
              <Link
                href="/contact"
                className="underline underline-offset-2 hover:text-[#FF8F5C]"
              >
                confidential enquiry
              </Link>
              .
            </p>
          </>
        }
      />
    </>
  )
}
