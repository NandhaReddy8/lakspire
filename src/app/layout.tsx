import type { Metadata } from 'next'
import { outfit, instrumentSerif, jetbrainsMono } from '@/lib/fonts'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ScrollJump } from '@/components/layout/ScrollJump'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { CursorSpotlight } from '@/components/motion/CursorSpotlight'
import { TriangleCursor } from '@/components/motion/TriangleCursor'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { CookieConsent } from '@/components/layout/CookieConsent'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lakspire.com',
  ),
  title: 'Lakspire — Turning Data Into Insight',
  description:
    'Lakspire delivers data processing, data management, analytics and AI-enabled business solutions.',
  icons: {
    icon: [{ url: '/lakspire-logo.jpg', type: 'image/jpeg' }],
    shortcut: '/lakspire-logo.jpg',
    apple: '/lakspire-logo.jpg',
  },
  openGraph: {
    title: 'Lakspire — Turning Data Into Insight',
    description:
      'AI annotation & training datasets, analytics, and data operations — delivered with human review where it matters.',
    images: ['/lakspire-logo.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Pre-hydration theme sync — the site defaults to light. Only a
            user who has explicitly toggled to dark gets dark on next load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <CursorSpotlight />
        <TriangleCursor />
        <SmoothScroll>
          <ScrollReveal />
          <Navigation />
          <main>{children}</main>
          <ScrollJump />
          <Footer />
        </SmoothScroll>
        <CookieConsent />
      </body>
    </html>
  )
}
