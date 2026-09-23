import { NextResponse } from 'next/server'
import { Resend } from 'resend'

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

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[notify] RESEND_API_KEY is not set')
    return NextResponse.json({ ok: false, error: 'Server misconfigured.' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 })
  }

  const raw = (body ?? {}) as Record<string, unknown>
  const token = typeof raw.turnstileToken === 'string' ? raw.turnstileToken : undefined
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null

  const turn = await verifyTurnstile(token, ip)
  if (!turn.ok) {
    return NextResponse.json({ ok: false, error: turn.reason }, { status: turn.status })
  }

  const parsed = validate(body)
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 })
  const p = parsed.payload

  const resend = new Resend(key)

  const internal =
    p.type === 'contact'
      ? {
          subject: `New contact enquiry — ${p.name} (${p.company})`,
          html: contactInternalHtml(p),
        }
      : {
          subject: `New LeadBot capture — ${p.name}`,
          html: leadInternalHtml(p),
        }

  try {
    const internalRes = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: p.email,
      subject: internal.subject,
      html: internal.html,
    })
    if (internalRes.error) {
      console.error('[notify] internal send failed:', internalRes.error)
      return NextResponse.json({ ok: false, error: 'Delivery failed.' }, { status: 502 })
    }
  } catch (err) {
    console.error('[notify] internal send threw:', err)
    return NextResponse.json({ ok: false, error: 'Delivery failed.' }, { status: 502 })
  }

  if (p.type === 'contact') {
    try {
      await resend.emails.send({
        from: FROM,
        to: [p.email],
        replyTo: TO,
        subject: 'Thanks for reaching out — Lakspire',
        html: submitterConfirmationHtml(p),
      })
    } catch (err) {
      console.error('[notify] confirmation send failed (non-fatal):', err)
    }
  }

  return NextResponse.json({ ok: true })
}
