'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useCallback } from 'react'
import { Linkedin, Instagram, Youtube, Twitter } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'

const footerLinks = {
  Services: [
    { label: 'All services', href: '/services' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Industries', href: '/industries' },
    { label: 'Security', href: '/security' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
}

/* Social links — placeholder hrefs until client provides the real URLs. */
const socials = [
  { label: 'LinkedIn',  href: '#',  Icon: Linkedin },
  { label: 'Instagram', href: '#',  Icon: Instagram },
  { label: 'YouTube',   href: '#',  Icon: Youtube },
  { label: 'X',         href: '#',  Icon: Twitter },
]

export function Footer() {
  const containerRef = useRef<HTMLElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || !glowRef.current) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glowRef.current.style.setProperty('--mouse-x', `${x}px`)
    glowRef.current.style.setProperty('--mouse-y', `${y}px`)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '1'
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }, [])

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="themed-footer relative overflow-hidden border-t border-white/[0.06]"
    >
      {/* Cursor-following glow — theme-aware via .footer-glow class */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="footer-glow pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: 0 }}
      />

      {/* Ambient top gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,107,53,0.4) 30%, rgba(233,196,106,0.3) 60%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-container container-pad py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              aria-label="Lakspire Home"
              className="group inline-flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <span className="lakspire-mark relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src="/lakspire-logo.jpg"
                  alt=""
                  aria-hidden="true"
                  width={160}
                  height={160}
                  className="lakspire-mark__img h-full w-full"
                />
              </span>
              <span className="lakspire-wordmark text-[20px] font-semibold tracking-[0.2em]">
                LAKSPIRE
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Turning Data Into Insight.
              <br />
              Powering Better Decisions.
            </p>
            <p className="mt-5 text-xs text-white/30">{siteConfig.email}</p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-white/35">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative text-sm text-white/45 transition-colors duration-200 hover:text-white/85"
                    >
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Lakspire. All rights reserved.
          </p>
          {/* Social — reference: micro1.ai footer. Icons only, tight
              rhythm, warm-hover to gold on dark, ember on light. */}
          <ul className="flex items-center gap-1.5">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-white/45 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] hover:text-[color:var(--color-gold,#E9C46A)]"
                >
                  <Icon size={15} strokeWidth={1.8} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Large watermark */}
      <div
        aria-hidden="true"
        className="overflow-hidden pb-2 pt-4 text-center select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 15vw, 12rem)',
          fontWeight: 700,
          letterSpacing: '-0.05em',
          color: 'var(--border-glass)',
          lineHeight: 1,
        }}
      >
        Lakspire
      </div>
    </footer>
  )
}
