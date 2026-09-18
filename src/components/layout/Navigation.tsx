'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { navItems } from '@/data/navigation'
import { cn } from '@/lib/utils'

type Theme = 'dark' | 'light'

/**
 * Navigation — three separate floating pills.
 *
 *   ┌──────────┐        ┌──────────────────┐        ┌────────────────┐
 *   │  Logo    │        │  Nav · Nav · Nav │        │  ☀  Talk to Us  │
 *   └──────────┘        └──────────────────┘        └────────────────┘
 *
 * Each pill is its own glass surface; the gap between them is the page
 * background showing through. Theme toggle lives inside the right pill.
 *
 * The pill visuals switch on the `data-theme` attribute on <html> — that
 * attribute is written by the pre-hydration script in layout.tsx to avoid
 * flash, and mutated by the toggle below.
 */

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'light' ? 'light' : 'dark'
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(readInitialTheme())
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const applyTheme = (next: Theme) => {
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      /* ignore */
    }
    setTheme(next)
  }

  const toggleTheme = () => applyTheme(theme === 'dark' ? 'light' : 'dark')

  const isLight = theme === 'light'

  const pillClass = cn(
    'relative flex items-center whitespace-nowrap rounded-full transition-all duration-500 nav-pill',
    scrolled ? 'nav-pill-scrolled' : ''
  )

  return (
    <>
      {/* Floating header — three pills spaced across the top */}
      <header
        className={cn(
          'fixed left-0 right-0 z-50 flex items-center justify-between px-3 transition-all duration-500 sm:px-5 lg:px-6',
          scrolled ? 'top-3' : 'top-4'
        )}
        style={{ willChange: 'transform' }}
      >
        {/* ───── Left pill — Logo ───── */}
        <div className={cn(pillClass, 'py-1 pl-1 pr-3')}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, var(--highlight-top) 50%, transparent 100%)',
            }}
          />
          <Link
            href="/"
            aria-label="Lakspire Home"
            className="group flex items-center gap-2 rounded-full py-1.5 pl-2 pr-1 transition-colors"
          >
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#F4A261" />
                </linearGradient>
              </defs>
              <rect width="28" height="28" rx="8" fill="url(#logo-grad)" fillOpacity="0.18" />
              <rect
                x="1"
                y="1"
                width="26"
                height="26"
                rx="7"
                stroke="url(#logo-grad)"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
              <path
                d="M8 20V8l10 6-10 6z"
                fill="none"
                stroke="#FABD6C"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="14" r="1.5" fill="#E9C46A" />
            </svg>
            <span
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-[14px] font-semibold tracking-tight nav-text-strong"
            >
              Lakspire
            </span>
          </Link>
        </div>

        {/* ───── Center pill — Nav links ───── */}
        <div className={cn(pillClass, 'hidden py-1 px-1 lg:flex')}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, var(--highlight-top) 50%, transparent 100%)',
            }}
          />
          <nav
            className="flex items-center gap-0.5 px-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ───── Right pill — Theme toggle + CTA ───── */}
        <div className={cn(pillClass, 'py-1 pl-1 pr-1 gap-1')}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 top-0 h-px rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, var(--highlight-top) 50%, transparent 100%)',
            }}
          />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
            className="nav-icon-btn hidden h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 lg:flex"
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="group relative hidden overflow-hidden rounded-full px-4 py-1.5 text-[13px] font-medium text-white shadow-[0_2px_10px_rgba(255,107,53,0.35),inset_0_1px_0_0_rgba(255,240,220,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(255,107,53,0.5),inset_0_1px_0_0_rgba(255,240,220,0.35)] lg:block"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)' }}
          >
            <span className="relative z-10">Contact Us</span>
          </Link>

          {/* Mobile toggle (visible on small screens; sits in right pill) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-icon-btn flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col backdrop-blur-xl transition-all duration-300 lg:hidden',
          'mobile-overlay',
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="flex h-20 items-center justify-between container-pad">
          <Link
            href="/"
            style={{ fontFamily: 'var(--font-display)' }}
            className="text-[15px] font-semibold tracking-tight nav-text-strong"
            onClick={() => setMobileOpen(false)}
          >
            Lakspire
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
              className="nav-icon-btn flex h-10 w-10 items-center justify-center rounded-full"
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="nav-icon-btn flex h-10 w-10 items-center justify-center rounded-full"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-5 pt-6" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="nav-link rounded-lg px-4 py-3 text-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 border-t pt-6" style={{ borderColor: 'var(--border-glass)' }}>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block rounded-full px-4 py-3 text-center text-white font-medium"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)' }}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
