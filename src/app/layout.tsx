import type { Metadata } from 'next'
import { outfit, instrumentSerif, jetbrainsMono } from '@/lib/fonts'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ScrollJump } from '@/components/layout/ScrollJump'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { CursorSpotlight } from '@/components/motion/CursorSpotlight'
import { AnnotationCursor } from '@/components/motion/AnnotationCursor'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lakspire — Turning Data Into Insight',
  description:
    'Lakspire delivers data processing, data management, analytics and AI-enabled business solutions.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Pre-hydration theme sync — reads persisted theme before paint
            to prevent flash of dark theme when user has selected light. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <CursorSpotlight />
        <AnnotationCursor />
        <SmoothScroll>
          <ScrollReveal />
          <Navigation />
          <main>{children}</main>
          <ScrollJump />
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
