'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Send, MessageCircle, PhoneCall } from 'lucide-react'
import { LeadBotAvatar } from './LeadBotAvatar'

/**
 * LeadBot — a small robo-assistant that fades in from the bottom-right
 * after a short dwell so the visitor sees the site first. Four short
 * chip-heavy questions collect a qualified lead, then a confetti burst
 * and a thank-you. Cookie consent is gated at submit time (not at
 * appearance) so the FAB is never stuck behind an undecided chip.
 *
 * Persistence: localStorage. Dismissed → gone. Submitted → the FAB
 * stays pinned as a compact link to Contact Us.
 *
 * Static for now — logs the captured lead behind a clear TODO. Payload
 * shape is what we'll POST when the backend lands.
 */

const COOKIE_KEY = 'lakspire.cookie-consent'
const BOT_KEY = 'lakspire.lead-bot'
const DWELL_MS = 8_000  // let the visitor see the page first, then say hi
const TEASER_MS = 4_000 // teaser bubble shows N ms after avatar appears

type Step = 'name' | 'kind' | 'scale' | 'email' | 'done'

type Lead = {
  name: string
  kind: string
  scale: string
  email: string
  submittedAt: string
}

type Stored = { status: 'dismissed' | 'submitted'; at: string }

const DATA_KINDS = [
  { key: 'text', label: 'Text / LLM' },
  { key: 'image', label: 'Image' },
  { key: 'audio', label: 'Audio / Video' },
  { key: 'docs', label: 'Documents' },
  { key: 'code', label: 'Code' },
  { key: 'multi', label: 'Multimodal' },
]

const SCALES = [
  { key: 'explore', label: 'Just exploring' },
  { key: 's', label: '< 10k items' },
  { key: 'm', label: '10k – 100k' },
  { key: 'l', label: '100k – 1M' },
  { key: 'xl', label: '1M+' },
]

/** True only if the user has opted in to at least one non-strictly-necessary
 *  cookie category. Used as the gate for actually capturing form data. */
function readCookieAccepted(): boolean {
  try {
    const raw = localStorage.getItem(COOKIE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as {
      handled?: boolean
      prefs?: { analytics?: boolean; marketing?: boolean }
    }
    return !!(parsed?.handled && (parsed.prefs?.analytics || parsed.prefs?.marketing))
  } catch {
    return false
  }
}

/** Writes an "accept all" consent to the same key the cookie chip uses
 *  and fires a same-tab custom event so the chip re-reads and hides
 *  itself immediately (native `storage` events only fire cross-tab). */
function writeCookieAcceptAll() {
  try {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        handled: true,
        prefs: { necessary: true, analytics: true, marketing: true },
      }),
    )
    window.dispatchEvent(new CustomEvent('lakspire:cookies-updated'))
  } catch {
    /* ignore */
  }
}

function readBotStored(): Stored | null {
  try {
    const raw = localStorage.getItem(BOT_KEY)
    return raw ? (JSON.parse(raw) as Stored) : null
  } catch {
    return null
  }
}

function writeBotStored(v: Stored) {
  try {
    localStorage.setItem(BOT_KEY, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Tab-title notification helpers ───────────────────────────
// Alternates the browser tab title between the original and a
// prompt so the visitor notices the bot even if they've switched
// tabs. Cleanly restores on stop.
let titleInterval: number | undefined
let originalTitle = ''

function startTitleNudge() {
  if (typeof document === 'undefined') return
  if (titleInterval) return
  originalTitle = document.title
  let flip = false
  titleInterval = window.setInterval(() => {
    flip = !flip
    document.title = flip ? '💬  New message · Lakspire' : originalTitle
  }, 1600)
}

function stopTitleNudge() {
  if (typeof document === 'undefined') return
  if (titleInterval) {
    window.clearInterval(titleInterval)
    titleInterval = undefined
  }
  if (originalTitle) document.title = originalTitle
}

export function LeadBot() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [kind, setKind] = useState('')
  const [scale, setScale] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [needsConsent, setNeedsConsent] = useState(false)
  const dwellTimerRef = useRef<number | null>(null)
  const teaserTimerRef = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Suppress on /contact — they've already found the form. Checked at
  // render time only; NOT a hook dependency, otherwise the pathname
  // hydration flip would cancel the dwell timer before it fires.
  const suppress = pathname?.startsWith('/contact') ?? false
  const submitted = readBotStored()?.status === 'submitted'

  useEffect(() => {
    // Mount-only. Suppress is checked at render time, so path changes
    // never cancel the timers here.
    const stored = readBotStored()
    if (stored?.status === 'dismissed') return
    if (stored?.status === 'submitted') {
      setVisible(true)
      setStep('done')
      return
    }

    // Bot appears after a short dwell regardless of cookie state.
    // The cookie-consent gate runs at submit time instead, so the FAB
    // itself is never blocked by an undecided cookie chip.
    dwellTimerRef.current = window.setTimeout(() => {
      setVisible(true)
      teaserTimerRef.current = window.setTimeout(() => setTeaser(true), TEASER_MS)
      startTitleNudge()
    }, DWELL_MS)

    return () => {
      if (dwellTimerRef.current) window.clearTimeout(dwellTimerRef.current)
      if (teaserTimerRef.current) window.clearTimeout(teaserTimerRef.current)
      stopTitleNudge()
    }
  }, [])

  // Autofocus the text input when the panel opens or the step changes to
  // a text-entry step.
  useEffect(() => {
    if (!open) return
    if (step === 'name' || step === 'email') {
      const id = window.setTimeout(() => inputRef.current?.focus(), 220)
      return () => window.clearTimeout(id)
    }
  }, [open, step])

  if (suppress) return null

  // Full dismiss: only reachable from the teaser tooltip's own X.
  // Removes the bot for this browser.
  const dismiss = () => {
    writeBotStored({ status: 'dismissed', at: new Date().toISOString() })
    setOpen(false)
    setVisible(false)
    setTeaser(false)
    stopTitleNudge()
  }

  // Panel close: never removes the FAB. It just collapses the chat so
  // the user can reopen it any time (and, post-submit, still get to
  // Contact Us).
  const closePanel = () => {
    setOpen(false)
    setTeaser(false)
    stopTitleNudge()
  }

  const openPanel = () => {
    setOpen(true)
    setTeaser(false)
    stopTitleNudge()
  }

  const submitStep = () => {
    setError(null)
    if (step === 'name') {
      if (name.trim().length < 2) return setError('A first name is enough.')
      setStep('kind')
    } else if (step === 'kind') {
      if (!kind) return setError('Pick one to move on.')
      setStep('scale')
    } else if (step === 'scale') {
      if (!scale) return setError('Pick one to move on.')
      setStep('email')
    } else if (step === 'email') {
      if (!EMAIL_RE.test(email)) return setError('That email doesn’t look right.')
      // Cookie consent gate — cannot capture personal data unless the
      // visitor has affirmatively accepted cookies. Show a mini consent
      // prompt in-panel and short-circuit until they confirm.
      if (!readCookieAccepted()) {
        setNeedsConsent(true)
        return
      }
      finish()
    }
  }

  const acceptConsentAndSubmit = () => {
    writeCookieAcceptAll()
    setNeedsConsent(false)
    finish()
  }

  const finish = () => {
    const lead: Lead = {
      name: name.trim(),
      kind,
      scale,
      email: email.trim(),
      submittedAt: new Date().toISOString(),
    }
    // TODO: replace with POST /api/leads once backend is in place.
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.info('[lead-bot] captured lead (static mode):', lead)
    }
    writeBotStored({ status: 'submitted', at: lead.submittedAt })
    setJustSubmitted(true)
    setStep('done')
  }

  if (!visible) return null

  return (
    <div className="lead-bot" aria-live="polite" data-submitted={submitted ? 'true' : 'false'}>
      {/* Floating avatar bubble — always visible once the bot appears.
          Two size variants: larger + attention-seeking pre-submit,
          smaller + calm post-submit (already captured, just a shortcut
          to Contact Us). */}
      {!open && (
        <>
          {teaser && !submitted && (
            <div className="lead-bot__teaser" role="status">
              <span>Got 30 seconds? Quick chat about your data →</span>
              <button
                type="button"
                onClick={dismiss}
                className="lead-bot__teaser-x"
                aria-label="Dismiss chat prompt"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {submitted ? (
            // Post-submit: small CTA that jumps straight to Contact Us
            // for a real conversation with the team.
            <Link
              href="/contact"
              className="lead-bot__fab lead-bot__fab--small"
              aria-label="Talk to the Lakspire team"
              onClick={stopTitleNudge /* clear any lingering title flash */}
            >
              <LeadBotAvatar mood="celebrate" />
              <span className="lead-bot__fab-badge lead-bot__fab-badge--soft" aria-hidden="true">
                <PhoneCall size={10} strokeWidth={2.4} />
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={openPanel}
              className="lead-bot__fab lead-bot__fab--large"
              aria-label="Chat with the Lakspire assistant"
            >
              <LeadBotAvatar mood="wave" />
              <span className="lead-bot__fab-badge" aria-hidden="true">
                <MessageCircle size={12} strokeWidth={2.4} />
              </span>
              <span className="lead-bot__fab-pulse" aria-hidden="true" />
            </button>
          )}
        </>
      )}

      {open && (
        <div
          className="lead-bot__panel"
          role="dialog"
          aria-label="Lakspire assistant"
          onKeyDown={(e) => {
            // After a chip is clicked, the focused chip button would
            // otherwise re-fire on Enter. Catch Enter at the panel
            // level and forward it to Continue/Submit — but only when
            // we're on a chip step (name/email inputs already handle
            // their own Enter key).
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              (step === 'kind' || step === 'scale')
            ) {
              e.preventDefault()
              submitStep()
            }
          }}
        >
          <header className="lead-bot__head">
            <div className="lead-bot__head-avatar">
              <LeadBotAvatar mood={step === 'done' ? 'celebrate' : 'talk'} />
            </div>
            <div className="lead-bot__head-meta">
              <p className="lead-bot__head-name">Lakspire assistant</p>
              <p className="lead-bot__head-sub">
                {step === 'done' ? 'All set — thank you.' : 'Four quick questions.'}
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="lead-bot__close"
              aria-label="Close assistant"
            >
              <X size={16} />
            </button>
          </header>

          <div className="lead-bot__body">
            {needsConsent ? (
              <ConsentView
                onAccept={acceptConsentAndSubmit}
                onDecline={() => setNeedsConsent(false)}
              />
            ) : step === 'done' ? (
              <DoneView name={name} showConfetti={justSubmitted} onClose={closePanel} />
            ) : (
              <QuestionView
                step={step}
                name={name}
                kind={kind}
                scale={scale}
                email={email}
                error={error}
                inputRef={inputRef}
                onNameChange={setName}
                onKindPick={(k) => {
                  setKind(k)
                  setError(null)
                }}
                onScalePick={(s) => {
                  setScale(s)
                  setError(null)
                }}
                onEmailChange={setEmail}
                onSubmit={submitStep}
              />
            )}
          </div>

          {step !== 'done' && !needsConsent && (
            <footer className="lead-bot__foot">
              <ProgressDots step={step} />
              <button
                type="button"
                onClick={submitStep}
                className="lead-bot__send"
                aria-label="Continue"
              >
                {step === 'email' ? 'Submit' : 'Continue'}
                <Send size={13} strokeWidth={2} />
              </button>
            </footer>
          )}
        </div>
      )}
    </div>
  )
}

function ProgressDots({ step }: { step: Step }) {
  const order: Step[] = ['name', 'kind', 'scale', 'email']
  const idx = order.indexOf(step)
  return (
    <div className="lead-bot__progress" aria-hidden="true">
      {order.map((s, i) => (
        <span
          key={s}
          className="lead-bot__progress-dot"
          data-state={i < idx ? 'done' : i === idx ? 'active' : 'pending'}
        />
      ))}
    </div>
  )
}

type QVProps = {
  step: Exclude<Step, 'done'>
  name: string
  kind: string
  scale: string
  email: string
  error: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  onNameChange: (v: string) => void
  onKindPick: (v: string) => void
  onScalePick: (v: string) => void
  onEmailChange: (v: string) => void
  onSubmit: () => void
}

function QuestionView({
  step, name, kind, scale, email, error, inputRef,
  onNameChange, onKindPick, onScalePick, onEmailChange, onSubmit,
}: QVProps) {
  const prompt = useMemo(() => {
    if (step === 'name') return 'Hi! I’m Lex. What should I call you?'
    if (step === 'kind') return `Nice to meet you, ${name.split(' ')[0]}. What kind of data are you working with?`
    if (step === 'scale') return 'Roughly what volume are we talking about?'
    return 'Last one — where can our team reach you?'
  }, [step, name])

  return (
    <>
      <p className="lead-bot__msg" key={step}>{prompt}</p>

      {step === 'name' && (
        <input
          ref={inputRef}
          type="text"
          className="lead-bot__input"
          placeholder="Your first name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          autoComplete="given-name"
          maxLength={40}
        />
      )}

      {step === 'kind' && (
        <div className="lead-bot__chips">
          {DATA_KINDS.map((k) => (
            <button
              key={k.key}
              type="button"
              className="lead-bot__chip"
              data-selected={kind === k.key}
              onClick={(e) => {
                onKindPick(k.key)
                // Move focus off the chip so a subsequent Enter goes
                // to the panel-level handler (Continue), not this
                // button (which would just re-select the same option).
                e.currentTarget.blur()
              }}
            >
              {k.label}
            </button>
          ))}
        </div>
      )}

      {step === 'scale' && (
        <div className="lead-bot__chips">
          {SCALES.map((s) => (
            <button
              key={s.key}
              type="button"
              className="lead-bot__chip"
              data-selected={scale === s.key}
              onClick={(e) => {
                onScalePick(s.key)
                e.currentTarget.blur()
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {step === 'email' && (
        <input
          ref={inputRef}
          type="email"
          className="lead-bot__input"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          autoComplete="email"
          inputMode="email"
        />
      )}

      {error && <p className="lead-bot__error" role="alert">{error}</p>}
    </>
  )
}

function ConsentView({
  onAccept,
  onDecline,
}: {
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div className="lead-bot__consent">
      <p className="lead-bot__msg">
        One small thing — before we save your details, please let us set cookies so we can hold onto your info and follow up properly.
      </p>
      <p className="lead-bot__done-sub">
        You can change this any time from the cookie chip at the bottom of the page.
      </p>
      <div className="lead-bot__done-actions">
        <button
          type="button"
          onClick={onAccept}
          className="lead-bot__cta"
        >
          Accept &amp; send
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="lead-bot__cta lead-bot__cta--ghost"
        >
          Not now
        </button>
      </div>
    </div>
  )
}

function DoneView({
  name,
  showConfetti,
  onClose,
}: {
  name: string
  showConfetti: boolean
  onClose: () => void
}) {
  const first = name.split(' ')[0] || 'there'
  return (
    <div className="lead-bot__done">
      {showConfetti && <Confetti />}
      <p className="lead-bot__msg lead-bot__msg--done">
        {first === 'there' ? 'Thanks! ' : `Thanks, ${first}! `}
        Our team will reach out shortly.
      </p>
      <p className="lead-bot__done-sub">
        Want to discuss it sooner? Book a quick call — happy to answer
        anything about scope, workflow, or security before we get started.
      </p>
      <div className="lead-bot__done-actions">
        <Link
          href="/contact"
          onClick={onClose}
          className="lead-bot__cta"
        >
          <PhoneCall size={13} strokeWidth={2} />
          Book a quick call
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="lead-bot__cta lead-bot__cta--ghost"
        >
          Keep exploring
        </button>
      </div>
    </div>
  )
}

/**
 * Confetti — deterministic-but-varied particle burst. Uses 28 spans
 * with per-particle CSS custom properties (angle, distance, spin,
 * delay) so the animation stays fully off the JS thread.
 */
function Confetti() {
  const particles = useMemo(() => {
    const colors = ['#FF6B35', '#FF8F5C', '#F4A261', '#E9C46A', '#FABD6C', '#FFE1B0']
    return Array.from({ length: 28 }, (_, i) => {
      const angle = -90 + (Math.random() - 0.5) * 160 // upward cone
      const dist = 80 + Math.random() * 120
      const dx = Math.cos((angle * Math.PI) / 180) * dist
      const dy = Math.sin((angle * Math.PI) / 180) * dist
      const spin = (Math.random() * 720 - 360).toFixed(0)
      const delay = (Math.random() * 120).toFixed(0)
      const size = (4 + Math.random() * 4).toFixed(1)
      const color = colors[i % colors.length]
      const shape = i % 3 // 0: rect, 1: circle, 2: bar
      return { i, dx, dy, spin, delay, size, color, shape }
    })
  }, [])
  return (
    <div className="lead-bot__confetti" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.i}
          className="lead-bot__particle"
          data-shape={p.shape}
          style={{
            ['--dx' as string]: `${p.dx.toFixed(1)}px`,
            ['--dy' as string]: `${p.dy.toFixed(1)}px`,
            ['--spin' as string]: `${p.spin}deg`,
            ['--delay' as string]: `${p.delay}ms`,
            ['--size' as string]: `${p.size}px`,
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}
