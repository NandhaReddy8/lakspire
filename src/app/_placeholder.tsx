import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p
        className="mb-4 text-[11px] font-semibold uppercase text-[#F4A261]"
        style={{ letterSpacing: '0.12em', fontFamily: 'var(--font-body)' }}
      >
        Coming Soon
      </p>
      <h1
        className="mb-4 text-white/80"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)',
          fontWeight: 350,
          letterSpacing: '-0.03em',
        }}
      >
        {title}
      </h1>
      <p className="mb-8 text-[14px] text-white/35" style={{ fontFamily: 'var(--font-body)' }}>
        This page is being built. Check back soon.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[13px] text-white/45 transition-colors hover:text-white/80"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <ArrowLeft size={13} />
        Back to home
      </Link>
    </div>
  )
}
