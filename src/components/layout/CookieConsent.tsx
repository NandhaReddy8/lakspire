'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Cookie, Settings2, Check, X } from 'lucide-react'

/**
 * CookieConsent — quiet, persistent bottom-centre chip.
 *
 * By design it is NOT a full-screen modal or a heavy banner. It sits
 * as a small pill at the bottom-middle of the viewport until the user
 * chooses. A gear icon expands it into a compact preferences panel
 * (analytics + marketing toggles; strictly-necessary is always on).
 *
 * Persistence: preferences and the "handled" flag live in
 * localStorage under a single key so the chip stops appearing once
 * a choice has been made. It never blocks the page underneath.
 */

type Prefs = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

type Stored = {
  handled: boolean
  prefs: Prefs
}

const STORAGE_KEY = 'lakspire.cookie-consent'
const DEFAULT_PREFS: Prefs = { necessary: true, analytics: false, marketing: false }

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    return parsed
  } catch {
    return null
  }
}

function write(v: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false)
  const [handled, setHandled] = useState(true)
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)

  useEffect(() => {
    setMounted(true)
    const sync = () => {
      const stored = read()
      if (stored?.handled) {
        setHandled(true)
        setPrefs(stored.prefs)
      } else {
        setHandled(false)
      }
    }
    sync()
    // Same-tab: LeadBot fires this after its in-panel "Accept & send".
    window.addEventListener('lakspire:cookies-updated', sync)
    // Cross-tab: native storage events for the same key.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('lakspire:cookies-updated', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  if (!mounted || handled) return null

  const acceptAll = () => {
    const next: Prefs = { necessary: true, analytics: true, marketing: true }
    setPrefs(next)
    write({ handled: true, prefs: next })
    setHandled(true)
  }

  const rejectAll = () => {
    const next: Prefs = { necessary: true, analytics: false, marketing: false }
    setPrefs(next)
    write({ handled: true, prefs: next })
    setHandled(true)
  }

  const savePrefs = () => {
    write({ handled: true, prefs })
    setHandled(true)
  }

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="cookie-consent"
      data-open={open ? 'true' : 'false'}
    >
      {!open ? (
        <div className="cookie-chip">
          <span className="cookie-chip__icon" aria-hidden="true">
            <Cookie size={16} strokeWidth={1.6} />
          </span>
          <span className="cookie-chip__label">
            We use cookies to run the site and, with your consent, understand how it&apos;s used.
          </span>
          <button
            type="button"
            onClick={acceptAll}
            className="cookie-btn cookie-btn--primary"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="cookie-btn cookie-btn--ghost"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Cookie preferences"
            className="cookie-gear"
          >
            <Settings2 size={16} strokeWidth={1.6} />
          </button>
        </div>
      ) : (
        <div className="cookie-panel">
          <div className="cookie-panel__head">
            <div className="flex items-center gap-2">
              <Cookie size={16} strokeWidth={1.6} />
              <p className="cookie-panel__title">Cookie preferences</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close preferences"
              className="cookie-gear"
            >
              <X size={15} strokeWidth={1.6} />
            </button>
          </div>

          <p className="cookie-panel__intro">
            Strictly necessary cookies are always on. Toggle the rest to match your preference.
          </p>

          <ul className="cookie-list">
            <li className="cookie-row">
              <div>
                <p className="cookie-row__name">Strictly necessary</p>
                <p className="cookie-row__desc">
                  Required for the site to function. Cannot be disabled.
                </p>
              </div>
              <span className="cookie-toggle cookie-toggle--locked" aria-hidden="true">
                <Check size={12} strokeWidth={2.2} />
              </span>
            </li>
            <li className="cookie-row">
              <div>
                <p className="cookie-row__name">Analytics</p>
                <p className="cookie-row__desc">
                  Anonymous usage data — helps us understand how the site is used.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, analytics: e.target.checked }))
                  }
                  aria-label="Enable analytics cookies"
                />
                <span aria-hidden="true" className="cookie-toggle__track">
                  <span className="cookie-toggle__thumb" />
                </span>
              </label>
            </li>
            <li className="cookie-row">
              <div>
                <p className="cookie-row__name">Marketing</p>
                <p className="cookie-row__desc">
                  Used to measure campaign performance if we run one you clicked through.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) =>
                    setPrefs((p) => ({ ...p, marketing: e.target.checked }))
                  }
                  aria-label="Enable marketing cookies"
                />
                <span aria-hidden="true" className="cookie-toggle__track">
                  <span className="cookie-toggle__thumb" />
                </span>
              </label>
            </li>
          </ul>

          <div className="cookie-panel__actions">
            <Link href="/cookie-policy" className="cookie-link">
              Cookie policy
            </Link>
            <div className="flex items-center gap-2">
              <button type="button" onClick={rejectAll} className="cookie-btn cookie-btn--ghost">
                Reject all
              </button>
              <button type="button" onClick={savePrefs} className="cookie-btn cookie-btn--ghost">
                Save
              </button>
              <button type="button" onClick={acceptAll} className="cookie-btn cookie-btn--primary">
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
