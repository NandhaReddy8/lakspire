import { NextResponse, after } from 'next/server'
import { Resend } from 'resend'
import { and, eq, gt } from 'drizzle-orm'
import { db } from '@/db/client'
import { contactSubmissions, leadSubmissions } from '@/db/schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FROM = process.env.MAIL_FROM ?? 'Lakspire <notifications@lakspireai.com>'
const TO = process.env.MAIL_TO ?? 'hello@lakspire.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lakspireai.com'

type ContactPayload = {
  type: 'contact'
  name: string
  company: string
  email: string
  country: string
  phone?: string
  service: string
  description: string
}

type LeadPayload = {
  type: 'lead'
  name: string
  kind: string
  scale: string
  email: string
}

type Payload = ContactPayload | LeadPayload

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]{1,64}@[a-zA-Z0-9.\-]{1,190}\.[a-zA-Z]{2,24}$/
const clean = (s: unknown, max: number) =>
  typeof s === 'string' ? s.replace(/[\r\n]{3,}/g, '\n\n').trim().slice(0, max) : ''

function validate(body: unknown): { ok: true; payload: Payload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid payload.' }
  const b = body as Record<string, unknown>
  const type = b.type

  if (type === 'contact') {
    const p: ContactPayload = {
      type: 'contact',
      name: clean(b.name, 80),
      company: clean(b.company, 120),
      email: clean(b.email, 254),
      country: clean(b.country, 60),
      phone: clean(b.phone, 24),
      service: clean(b.service, 80),
      description: clean(b.description, 2000),
    }
    if (!p.name || !p.company || !p.email || !p.country || !p.service || !p.description) {
      return { ok: false, error: 'Missing required fields.' }
    }
    if (!EMAIL_RE.test(p.email)) return { ok: false, error: 'Invalid email.' }
    return { ok: true, payload: p }
  }

  if (type === 'lead') {
    const p: LeadPayload = {
      type: 'lead',
      name: clean(b.name, 80),
      kind: clean(b.kind, 40),
      scale: clean(b.scale, 40),
      email: clean(b.email, 254),
    }
    if (!p.name || !p.kind || !p.scale || !p.email) {
      return { ok: false, error: 'Missing required fields.' }
    }
    if (!EMAIL_RE.test(p.email)) return { ok: false, error: 'Invalid email.' }
    return { ok: true, payload: p }
  }

  return { ok: false, error: 'Unknown submission type.' }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const nl2br = (s: string) => escapeHtml(s).replace(/\n/g, '<br />')

function contactInternalHtml(p: ContactPayload) {
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55;color:#1a1a1a">
      <h2 style="margin:0 0 16px;font-size:18px">New contact form submission</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td>${escapeHtml(p.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td>${escapeHtml(p.company)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Country</td><td>${escapeHtml(p.country)}</td></tr>
        ${p.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td>${escapeHtml(p.phone)}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;color:#666">Service</td><td>${escapeHtml(p.service)}</td></tr>
      </table>
      <p style="margin:16px 0 8px;color:#666;font-size:13px">Message</p>
      <div style="padding:12px 14px;background:#f7f4f0;border-radius:8px;font-size:14px">${nl2br(p.description)}</div>
      <p style="margin-top:20px;font-size:12px;color:#999">Reply directly to this email to reach ${escapeHtml(p.name)}. Submitted from lakspireai.com.</p>
    </div>`
}

function leadInternalHtml(p: LeadPayload) {
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.55;color:#1a1a1a">
      <h2 style="margin:0 0 16px;font-size:18px">New LeadBot capture</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td>${escapeHtml(p.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Data type</td><td>${escapeHtml(p.kind)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Volume</td><td>${escapeHtml(p.scale)}</td></tr>
      </table>
      <p style="margin-top:20px;font-size:12px;color:#999">Reply directly to reach ${escapeHtml(p.name)}. Captured via the LeadBot on lakspireai.com.</p>
    </div>`
}

function submitterConfirmationHtml(p: ContactPayload) {
  const first = p.name.split(/\s+/)[0]
  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6;color:#1a1a1a;max-width:520px">
      <p style="font-size:15px">Hi ${escapeHtml(first)},</p>
      <p style="font-size:15px">Thanks for getting in touch. We received your enquiry about <strong>${escapeHtml(p.service)}</strong> and someone from the team will reply within one business day.</p>
      <p style="font-size:15px">If there's anything else you'd like to add, just reply to this email — it goes straight to us.</p>
      <p style="font-size:15px;margin-top:24px">— The Lakspire team</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <p style="font-size:12px;color:#999">Lakspire · Turning data into insight · <a href="${SITE_URL}" style="color:#FF6B35">${SITE_URL.replace(/^https?:\/\//, '')}</a></p>
    </div>`
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<{ ok: true } | { ok: false; reason: string; status: number }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('[notify] TURNSTILE_SECRET_KEY is not set')
    return { ok: false, reason: 'Captcha not configured.', status: 500 }
  }
  if (!token) return { ok: false, reason: 'Captcha token missing.', status: 400 }
  const params = new URLSearchParams()
  params.set('secret', secret)
  params.set('response', token)
  if (ip) params.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
    })
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (!data.success) {
      console.warn('[notify] turnstile failed:', data['error-codes'])
      return { ok: false, reason: 'Captcha check failed.', status: 400 }
    }
    return { ok: true }
  } catch (err) {
    console.error('[notify] turnstile verify threw:', err)
    return { ok: false, reason: 'Captcha check failed.', status: 502 }
  }
}

// A submitter who fires the same request twice in quick succession (double
// click, retry-happy client) shouldn't create two rows. This is deliberately
// a simple app-level check against the row we already store — no extra
// moving parts (no Redis, no separate rate-limit store) for a form that
// gets a handful of submissions a day.
const RESUBMIT_WINDOW_MS = 30_000

async function recentlySubmitted(
  table: typeof contactSubmissions | typeof leadSubmissions,
  email: string,
): Promise<boolean> {
  const since = new Date(Date.now() - RESUBMIT_WINDOW_MS)
  const rows = await db
    .select({ id: table.id })
    .from(table)
    .where(and(eq(table.email, email), gt(table.createdAt, since)))
    .limit(1)
  return rows.length > 0
}

const truncateError = (err: unknown) => String(err instanceof Error ? err.message : err).slice(0, 500)

// Both send functions run via `after()` — strictly after the response
// carrying {ok:true} has already been flushed to the client. The row was
// already committed before that response went out, so the visitor's
// "success" state never depends on Resend being up. Delivery outcome is
// written back onto the same row for ops visibility (and future retry
// tooling) rather than being silently dropped.

async function sendContactEmails(id: number, p: ContactPayload) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[notify] RESEND_API_KEY not set — email skipped for contact submission', id)
    await db
      .update(contactSubmissions)
      .set({ emailStatus: 'failed', emailError: 'RESEND_API_KEY not configured' })
      .where(eq(contactSubmissions.id, id))
    return
  }
  const resend = new Resend(key)
  try {
    const internalRes = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: p.email,
      subject: `New contact enquiry — ${p.name} (${p.company})`,
      html: contactInternalHtml(p),
    })
    if (internalRes.error) throw new Error(internalRes.error.message ?? 'internal send failed')

    try {
      await resend.emails.send({
        from: FROM,
        to: [p.email],
        replyTo: TO,
        subject: 'Thanks for reaching out — Lakspire',
        html: submitterConfirmationHtml(p),
      })
    } catch (err) {
      // The internal notification (the one that matters operationally)
      // already succeeded — a failed courtesy confirmation shouldn't
      // flip the row to "failed".
      console.error('[notify] confirmation send failed (non-fatal) for submission', id, err)
    }

    await db
      .update(contactSubmissions)
      .set({ emailStatus: 'sent', emailSentAt: new Date() })
      .where(eq(contactSubmissions.id, id))
  } catch (err) {
    console.error('[notify] contact email send failed for submission', id, err)
    await db
      .update(contactSubmissions)
      .set({ emailStatus: 'failed', emailError: truncateError(err) })
      .where(eq(contactSubmissions.id, id))
  }
}

async function sendLeadEmail(id: number, p: LeadPayload) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[notify] RESEND_API_KEY not set — email skipped for lead submission', id)
    await db
      .update(leadSubmissions)
      .set({ emailStatus: 'failed', emailError: 'RESEND_API_KEY not configured' })
      .where(eq(leadSubmissions.id, id))
    return
  }
  const resend = new Resend(key)
  try {
    const internalRes = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: p.email,
      subject: `New LeadBot capture — ${p.name}`,
      html: leadInternalHtml(p),
    })
    if (internalRes.error) throw new Error(internalRes.error.message ?? 'internal send failed')

    await db
      .update(leadSubmissions)
      .set({ emailStatus: 'sent', emailSentAt: new Date() })
      .where(eq(leadSubmissions.id, id))
  } catch (err) {
    console.error('[notify] lead email send failed for submission', id, err)
    await db
      .update(leadSubmissions)
      .set({ emailStatus: 'failed', emailError: truncateError(err) })
      .where(eq(leadSubmissions.id, id))
  }
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 })
  }

  const raw = (body ?? {}) as Record<string, unknown>
  const token = typeof raw.turnstileToken === 'string' ? raw.turnstileToken : undefined
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent')?.slice(0, 255) ?? null

  const turn = await verifyTurnstile(token, ip)
  if (!turn.ok) {
    return NextResponse.json({ ok: false, error: turn.reason }, { status: turn.status })
  }

  const parsed = validate(body)
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 })
  const p = parsed.payload

  if (p.type === 'contact') {
    if (await recentlySubmitted(contactSubmissions, p.email)) {
      return NextResponse.json(
        { ok: false, error: 'Already received — please wait a moment before submitting again.' },
        { status: 429 },
      )
    }

    let insertId: number
    try {
      const [result] = await db.insert(contactSubmissions).values({
        name: p.name,
        company: p.company,
        email: p.email,
        country: p.country,
        phone: p.phone || null,
        service: p.service,
        description: p.description,
        ip,
        userAgent,
      })
      insertId = result.insertId
    } catch (err) {
      console.error('[notify] DB insert failed for contact submission:', err)
      return NextResponse.json({ ok: false, error: 'Could not save your enquiry. Please try again.' }, { status: 500 })
    }

    // The row is committed. Everything below this line is best-effort
    // notification and cannot affect the response already decided above.
    after(() => sendContactEmails(insertId, p))
    return NextResponse.json({ ok: true })
  }

  if (await recentlySubmitted(leadSubmissions, p.email)) {
    return NextResponse.json(
      { ok: false, error: 'Already received — please wait a moment before submitting again.' },
      { status: 429 },
    )
  }

  let insertId: number
  try {
    const [result] = await db.insert(leadSubmissions).values({
      name: p.name,
      kind: p.kind,
      scale: p.scale,
      email: p.email,
      ip,
      userAgent,
    })
    insertId = result.insertId
  } catch (err) {
    console.error('[notify] DB insert failed for lead submission:', err)
    return NextResponse.json({ ok: false, error: 'Could not save. Please try again.' }, { status: 500 })
  }

  after(() => sendLeadEmail(insertId, p))
  return NextResponse.json({ ok: true })
}
