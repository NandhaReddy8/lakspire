import Link from 'next/link'
import { PageHero } from '@/components/blocks/PageHero'
import { LegalArticle, LegalSection } from '@/components/blocks/LegalArticle'
import { siteConfig } from '@/data/siteConfig'

export const metadata = {
  title: 'Cookie Policy — Lakspire',
  description:
    'What cookies and browser storage Lakspire.com uses, why, and how you can change your preferences at any time.',
}

const sections: LegalSection[] = [
  {
    heading: 'What cookies are',
    body: (
      <>
        <p>
          Cookies are small pieces of data a website stores in your browser. Similar mechanisms —
          local storage and session storage — behave the same way from a privacy standpoint. In
          this policy we use &quot;cookies&quot; to refer to all of these.
        </p>
      </>
    ),
  },
  {
    heading: 'Categories we use',
    body: (
      <>
        <p>Lakspire.com groups cookies into three simple categories:</p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong>Strictly necessary.</strong> Required for the site to function — remembering
            your consent choice, your theme (light/dark) preference and short-lived form state.
            Always on; cannot be turned off.
          </li>
          <li>
            <strong>Analytics.</strong> If enabled, helps us understand which pages are useful and
            where visitors drop off. Anonymous, aggregated. Off by default.
          </li>
          <li>
            <strong>Marketing.</strong> If enabled, allows us to measure the effectiveness of any
            campaigns we run that link to this site. Off by default.
          </li>
        </ul>
      </>
    ),
  },
  {
    heading: 'What we currently store',
    body: (
      <>
        <p>
          This static website today stores only strictly-necessary preferences in your browser&apos;s
          local storage:
        </p>
        <ul className="list-disc space-y-1.5 pl-6">
          <li>Your theme choice (light or dark).</li>
          <li>Your cookie preferences, so we don&apos;t re-prompt on every visit.</li>
        </ul>
        <p>
          No advertising cookies, tracking pixels or cross-site identifiers are set today. If that
          changes, we will update this policy before adding them and — where required — re-prompt
          for consent.
        </p>
      </>
    ),
  },
  {
    heading: 'Changing your preferences',
    body: (
      <>
        <p>
          Open the cookie chip at the bottom of any page and choose <em>Preferences</em> to toggle
          analytics or marketing on or off. Your choice is remembered for future visits until you
          clear your browser storage.
        </p>
        <p>
          Most browsers also let you block or delete cookies at any time — check your browser&apos;s
          help documentation for how.
        </p>
      </>
    ),
  },
  {
    heading: 'Third parties',
    body: (
      <>
        <p>
          Lakspire.com does not currently load third-party analytics, advertising or
          social-tracking scripts. Fonts are served under first-party arrangements.
        </p>
      </>
    ),
  },
  {
    heading: 'Changes to this policy',
    body: (
      <>
        <p>
          This policy will be updated whenever we add or remove a category of cookies. The
          effective date above always reflects the most recent revision.
        </p>
      </>
    ),
  },
]

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Cookie Policy"
        title={
          <>
            <span className="text-gradient-primary">
              Cookies, in plain <span className="editorial">English</span>.
            </span>
          </>
        }
        subtitle="Only what we actually store, why we store it, and how to change your mind at any time."
      />
      <LegalArticle
        effectiveDate="18 September 2026"
        intro={
          <p>
            This policy describes the cookies and browser storage Lakspire.com uses today. It is
            intentionally short: we don&apos;t use much, and we don&apos;t plan to unless there&apos;s
            a clear reason.
          </p>
        }
        sections={sections}
        footer={
          <>
            <p className="text-[14px] leading-relaxed">
              Questions? Write to{' '}
              <a
                href={`mailto:${siteConfig.email}`}
                className="underline underline-offset-2 hover:text-[#FF8F5C]"
              >
                {siteConfig.email}
              </a>{' '}
              — or read the full{' '}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-2 hover:text-[#FF8F5C]"
              >
                privacy policy
              </Link>
              .
            </p>
          </>
        }
      />
    </>
  )
}
