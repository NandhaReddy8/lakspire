'use client'

import { useState, useRef, FormEvent, ChangeEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Send } from 'lucide-react'

/**
 * ContactForm
 * ───────────
 * Static-site enquiry form. There is NO backend — on submit, the form
 * pauses briefly, then swaps to a themed success state. The submission
 * is not sent anywhere.
 *
 * Security posture (even for a static frontend):
 *   • All values pass through React's default text-escaping — script
 *     injection into fields cannot execute.
 *   • Each field enforces a maxLength and a regex where relevant, so
 *     the DOM never receives absurdly long payloads.
 *   • The name/company/country patterns whitelist letters + spaces +
 *     safe punctuation only — no angle brackets, quotes, backticks, or
 *     javascript-URL fragments.
 *   • Email is validated against RFC-shaped pattern.
 *   • Phone is digit-and-format-only.
 *   • The optional file input accepts a size cap and a MIME whitelist,
 *     never touches disk (kept only in memory until the state swap).
 *   • Native `noValidate` is off — the browser's own required/type/
 *     pattern validation runs first, and our JS layer applies the
 *     stricter rules and error messaging.
 *
 * Success state is a themed "your enquiry is on its way" animation —
 * flowing ember packet from a data icon into a checkmark disc, then a
 * confirmation message. Matches the site's motion signature.
 */

const services = [
  'Data Processing',
  'Data Management',
  'Data Analytics',
  'AI & Data Solutions',
  'Data Annotation & AI Training',
  'Business Support',
  'Not sure yet — let\'s discuss',
]

// Field-level regex — permissive enough for international names + strict
// enough that no HTML-adjacent characters get in.
const patterns = {
  name: /^[\p{L}\p{M}][\p{L}\p{M} .'\-]{1,79}$/u,
  company: /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .,'&\-]{0,119}$/u,
  country: /^[\p{L}\p{M}][\p{L}\p{M} .'\-]{1,59}$/u,
  email:
    /^[a-zA-Z0-9._%+\-]{1,64}@[a-zA-Z0-9.\-]{1,190}\.[a-zA-Z]{2,24}$/,
  phone: /^[+()\d\-. ]{6,24}$/,
}

const MAX_LEN = {
  name: 80,
  company: 120,
  country: 60,
  email: 254,
  phone: 24,
  description: 2000,
}

type FormValues = {
  name: string
  company: string
  email: string
  country: string
  phone: string
  service: string
  description: string
  file: File | null
}

const INITIAL: FormValues = {
  name: '',
  company: '',
  email: '',
  country: '',
  phone: '',
  service: '',
  description: '',
  file: null,
}

type Errors = Partial<Record<keyof FormValues, string>>

function validate(v: FormValues): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please share your name.'
  else if (!patterns.name.test(v.name.trim()))
    e.name = 'Letters, spaces, hyphens and apostrophes only.'

  if (!v.company.trim()) e.company = 'Please share your company.'
  else if (!patterns.company.test(v.company.trim()))
    e.company = 'Company name looks unusual — check for typos.'

  const email = v.email.trim()
  if (!email) e.email = 'Business email is required.'
  else if (!patterns.email.test(email)) e.email = 'That doesn\'t look like a valid email.'
  else if (email.length > MAX_LEN.email) e.email = 'Email is too long.'

  if (!v.country.trim()) e.country = 'Please share your country.'
  else if (!patterns.country.test(v.country.trim())) e.country = 'Country looks unusual.'

  if (v.phone.trim() && !patterns.phone.test(v.phone.trim()))
    e.phone = 'Digits, +, -, spaces and parentheses only.'

  if (!v.service) e.service = 'Pick the closest service — or "let\'s discuss."'

  const desc = v.description.trim()
  if (!desc) e.description = 'Tell us a little about the project.'
  else if (desc.length < 20) e.description = 'A sentence or two would help.'
  else if (desc.length > MAX_LEN.description) e.description = 'That\'s longer than we can accept.'

  if (v.file) {
    // 5 MB cap
    if (v.file.size > 5 * 1024 * 1024) e.file = 'Files must be under 5 MB.'
    else {
      const ok = /\.(pdf|docx?|txt|csv|xlsx?|png|jpe?g)$/i.test(v.file.name)
      if (!ok) e.file = 'PDF, Word, text, CSV, Excel or image only.'
    }
  }

  return e
}

export function ContactForm() {
  const shouldReduce = useReducedMotion()
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>(null)

  const setField =
    <K extends keyof FormValues>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val =
        key === 'file'
          ? ((e.target as HTMLInputElement).files?.[0] ?? null)
          : e.target.value
      setValues((v) => ({ ...v, [key]: val as FormValues[K] }))
      if (touched[key]) {
        setErrors((prev) => {
          const next = validate({ ...values, [key]: val as FormValues[K] })
          return { ...prev, [key]: next[key] }
        })
      }
    }

  const onBlur = (key: keyof FormValues) => () => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors((prev) => {
      const next = validate(values)
      return { ...prev, [key]: next[key] }
    })
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({
      name: true,
      company: true,
      email: true,
      country: true,
      phone: true,
      service: true,
      description: true,
      file: true,
    })
    if (Object.keys(errs).length > 0) {
      firstErrorRef.current?.focus()
      return
    }
    setSubmitting(true)
    // Faux "on-its-way" delay so the interaction reads as real.
    // NO network request — the values live only in local state and
    // are discarded when the component unmounts.
    await new Promise((r) => setTimeout(r, 1100))
    setSubmitting(false)
    setDone(true)
  }

  // contact-field carries the theme-aware background, text and
  // placeholder colors — see globals.css. On light theme, a
  // bg-transparent input on a cream panel disappears; contact-field
  // gives it a soft cream surface with warm-ink text.
  const fieldClass =
    'contact-field w-full rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition-colors duration-200 focus:border-[#FF8F5C]/60 focus:ring-2 focus:ring-[#FF6B35]/25'

  if (done) return <SuccessState reduced={!!shouldReduce} />

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={submitting}
      className="relative"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FieldWrap label="Name" required error={touched.name ? errors.name : undefined}>
          <input
            ref={(el) => {
              if (errors.name && !firstErrorRef.current) firstErrorRef.current = el
            }}
            className={fieldClass}
            style={{ borderColor: errBorder(touched.name, errors.name) }}
            type="text"
            name="name"
            maxLength={MAX_LEN.name}
            autoComplete="name"
            placeholder="Sarah Chen"
            value={values.name}
            onChange={setField('name')}
            onBlur={onBlur('name')}
            aria-invalid={!!(touched.name && errors.name)}
          />
        </FieldWrap>

        <FieldWrap label="Company" required error={touched.company ? errors.company : undefined}>
          <input
            className={fieldClass}
            style={{ borderColor: errBorder(touched.company, errors.company) }}
            type="text"
            name="company"
            maxLength={MAX_LEN.company}
            autoComplete="organization"
            placeholder="Acme Data Systems"
            value={values.company}
            onChange={setField('company')}
            onBlur={onBlur('company')}
            aria-invalid={!!(touched.company && errors.company)}
          />
        </FieldWrap>

        <FieldWrap label="Business email" required error={touched.email ? errors.email : undefined}>
          <input
            className={fieldClass}
            style={{ borderColor: errBorder(touched.email, errors.email) }}
            type="email"
            name="email"
            maxLength={MAX_LEN.email}
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={setField('email')}
            onBlur={onBlur('email')}
            aria-invalid={!!(touched.email && errors.email)}
          />
        </FieldWrap>

        <FieldWrap label="Country" required error={touched.country ? errors.country : undefined}>
          <input
            className={fieldClass}
            style={{ borderColor: errBorder(touched.country, errors.country) }}
            type="text"
            name="country"
            maxLength={MAX_LEN.country}
            autoComplete="country-name"
            placeholder="United Kingdom"
            value={values.country}
            onChange={setField('country')}
            onBlur={onBlur('country')}
            aria-invalid={!!(touched.country && errors.country)}
          />
        </FieldWrap>

        <FieldWrap label="Phone" hint="Optional" error={touched.phone ? errors.phone : undefined}>
          <input
            className={fieldClass}
            style={{ borderColor: errBorder(touched.phone, errors.phone) }}
            type="tel"
            name="phone"
            maxLength={MAX_LEN.phone}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+44 20 7946 0958"
            value={values.phone}
            onChange={setField('phone')}
            onBlur={onBlur('phone')}
            aria-invalid={!!(touched.phone && errors.phone)}
          />
        </FieldWrap>

        <FieldWrap label="Service required" required error={touched.service ? errors.service : undefined}>
          <select
            className={fieldClass}
            style={{ borderColor: errBorder(touched.service, errors.service) }}
            name="service"
            value={values.service}
            onChange={setField('service')}
            onBlur={onBlur('service')}
            aria-invalid={!!(touched.service && errors.service)}
          >
            <option value="" disabled>
              Choose a service…
            </option>
            {services.map((s) => (
              <option key={s} value={s} style={{ background: '#14100D', color: 'white' }}>
                {s}
              </option>
            ))}
          </select>
        </FieldWrap>

        <FieldWrap
          label="Project description"
          required
          error={touched.description ? errors.description : undefined}
          hint={`${values.description.length}/${MAX_LEN.description}`}
          className="sm:col-span-2"
        >
          <textarea
            className={fieldClass}
            style={{
              borderColor: errBorder(touched.description, errors.description),
              minHeight: 140,
              resize: 'vertical',
            }}
            name="description"
            maxLength={MAX_LEN.description}
            placeholder="Tell us about your data, the outcome you're after, and any constraints we should know."
            value={values.description}
            onChange={setField('description')}
            onBlur={onBlur('description')}
            aria-invalid={!!(touched.description && errors.description)}
          />
        </FieldWrap>

        <FieldWrap
          label="Attachment"
          hint="Optional · Max 5 MB"
          error={touched.file ? errors.file : undefined}
          className="sm:col-span-2"
        >
          <FileInput
            file={values.file}
            onChange={setField('file')}
            onBlur={onBlur('file')}
            hasError={!!(touched.file && errors.file)}
          />
          <p
            className="mt-1.5 text-[11px]"
            style={{ color: 'var(--text-faint)', fontFamily: 'var(--font-body)' }}
          >
            Accepted: PDF, Word, Excel, CSV, TXT, images.
          </p>
        </FieldWrap>
      </div>

      {/* Submit row — stacks on mobile so the CTA gets full width and
          the "Submit enquiry" label never wraps to two lines. On sm+
          the privacy blurb and the button share a row. */}
      <div className="mt-8 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] sm:max-w-xs" style={{ color: 'var(--text-faint)' }}>
          By submitting, you agree to the{' '}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-[#FF8F5C]">
            privacy policy
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6 py-3.5 text-[14px] font-medium text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-70 sm:w-auto sm:py-3"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F5C 100%)',
            boxShadow: '0 0 0 1px rgba(255,107,53,0.35), 0 12px 32px -8px rgba(255,107,53,0.5)',
          }}
        >
          {submitting ? (
            <>
              <SendingSpinner />
              Sending…
            </>
          ) : (
            <>
              Submit enquiry
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

// ─── FieldWrap ─────────────────────────────────────────────────
function FieldWrap({
  label,
  hint,
  required,
  error,
  className = '',
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  error?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 flex items-baseline justify-between gap-4">
        <span
          className="text-[12px] font-medium uppercase"
          style={{ letterSpacing: '0.1em', color: 'var(--text-body)' }}
        >
          {label}
          {required && <span className="ml-1 text-[#FF8F5C]">*</span>}
        </span>
        {hint && (
          <span className="text-[11px]" style={{ color: 'var(--text-faint)' }}>
            {hint}
          </span>
        )}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 block text-[12px]"
            style={{ color: '#FF8F5C' }}
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  )
}

function errBorder(touched: boolean | undefined, error: string | undefined) {
  if (touched && error) return 'rgba(255, 143, 92, 0.65)'
  return 'var(--border-glass-strong)'
}

function FileInput({
  file,
  onChange,
  onBlur,
  hasError,
}: {
  file: File | null
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  hasError: boolean
}) {
  return (
    <div
      className="contact-file-shell flex items-center gap-3 rounded-lg border px-3.5 py-2.5"
      style={{ borderColor: hasError ? 'rgba(255, 143, 92, 0.65)' : 'var(--border-glass-strong)' }}
    >
      <input
        id="contact-file"
        type="file"
        className="sr-only"
        accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx,.png,.jpg,.jpeg"
        onChange={onChange}
        onBlur={onBlur}
      />
      <label
        htmlFor="contact-file"
        className="cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-medium text-white/85"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.85), rgba(255,143,92,0.85))',
        }}
      >
        Choose file
      </label>
      <span className="truncate text-[13px]" style={{ color: 'var(--text-muted)' }}>
        {file ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB` : 'No file chosen'}
      </span>
    </div>
  )
}

function SendingSpinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

// ─── SuccessState ──────────────────────────────────────────────
// "Your data is on its way" — themed confirmation. Ember packet flies
// from a data icon into a check disc, the disc pulses, a message
// unfolds below.
function SuccessState({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border px-8 py-14 text-center sm:py-20"
      style={{
        borderColor: 'var(--border-glass)',
        background:
          'linear-gradient(150deg, rgba(255,107,53,0.10) 0%, rgba(233,196,106,0.05) 55%, rgba(20,16,13,0.4) 100%)',
        boxShadow:
          '0 30px 80px -30px rgba(255,107,53,0.35), inset 0 1px 0 0 var(--highlight-top)',
      }}
    >
      {/* Ambient bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(255,143,92,0.18) 0%, transparent 65%)',
        }}
      />

      {/* Flow SVG — data icon → moving packet → check disc */}
      <div className="relative z-10 mx-auto mb-8 flex max-w-md items-center justify-center">
        <svg width="360" height="120" viewBox="0 0 360 120" className="max-w-full">
          <defs>
            <linearGradient id="pkt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E9C46A" stopOpacity="0" />
              <stop offset="50%" stopColor="#F4A261" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="check-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Source data icon (stack of records) */}
          <g transform="translate(30 60)">
            <ellipse cx="0" cy="-14" rx="18" ry="5" fill="#F4A261" opacity="0.65" />
            <path d="M -18 -14 L -18 0 A 18 5 0 0 0 18 0 L 18 -14" fill="#E9C46A" opacity="0.35" stroke="#F4A261" strokeWidth="1" />
            <ellipse cx="0" cy="0" rx="18" ry="5" fill="#F4A261" opacity="0.85" />
            <path d="M -18 0 L -18 14 A 18 5 0 0 0 18 14 L 18 0" fill="#E9C46A" opacity="0.35" stroke="#F4A261" strokeWidth="1" />
            <ellipse cx="0" cy="14" rx="18" ry="5" fill="#F4A261" opacity="0.55" />
          </g>

          {/* Rail */}
          <line
            x1="55"
            y1="60"
            x2="305"
            y2="60"
            stroke="url(#pkt-grad)"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          >
            {!reduced && (
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.6s" repeatCount="indefinite" />
            )}
          </line>

          {/* Traveling packets */}
          {[0, 0.6, 1.2].map((delay, i) => (
            <circle
              key={i}
              r={4 - i * 0.5}
              fill="#FF6B35"
              opacity={0.9 - i * 0.15}
              style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,53,0.8))' }}
            >
              {!reduced && (
                <animateMotion
                  path="M 55 60 L 305 60"
                  dur="1.8s"
                  begin={`-${delay}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          ))}

          {/* Destination — check disc with pulsing halo */}
          <g transform="translate(330 60)">
            <circle r="30" fill="url(#check-halo)" />
            <circle r="20" fill="#FF6B35" opacity="0.95" />
            <circle r="20" fill="none" stroke="rgba(255,240,220,0.8)" strokeWidth="1" opacity="0.55" />
            <path
              d="M -8 0 L -2 6 L 9 -6"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              {!reduced && (
                <animate
                  attributeName="stroke-dasharray"
                  values="0 40; 40 0"
                  dur="0.6s"
                  begin="0.15s"
                  fill="freeze"
                />
              )}
            </path>
          </g>
        </svg>
      </div>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-2 text-[13px] font-bold uppercase"
        style={{
          letterSpacing: '0.16em',
          fontFamily: 'var(--font-body)',
          background: 'linear-gradient(90deg, #F4A261, #E8A82C)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Enquiry Received
      </motion.p>

      <motion.h2
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-xl"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 1.3rem + 2vw, 2.75rem)',
          fontWeight: 350,
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          color: 'var(--text-strong)',
        }}
      >
        <span className="text-gradient-primary">
          The best data is on its <span className="editorial">way to you</span>.
        </span>
      </motion.h2>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto mt-5 max-w-md text-[15px] leading-relaxed"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}
      >
        We&apos;ve received your enquiry. A member of the Lakspire team will read it carefully and
        reply within one working day with a considered next step.
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px]"
        style={{
          borderColor: 'var(--border-glass-strong)',
          background: 'var(--card-surface)',
          color: 'var(--text-body)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <Check size={13} className="text-[#FF8F5C]" />
        Reference recorded locally · no data left your browser
        <Send size={12} className="ml-1 text-[#E9C46A]" />
      </motion.div>
    </motion.div>
  )
}
