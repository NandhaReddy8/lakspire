'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

/**
 * Cloudflare Turnstile — CAPTCHA widget that renders itself and hands
 * back a token via onVerify. The token is single-use and must be
 * verified server-side via /api/turnstile-verify (baked into
 * /api/notify here).
 *
 * Requires NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time. If unset,
 * the component renders nothing and the server enforces "captcha
 * required" — so a missing key visibly breaks the form rather than
 * silently disabling protection.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileOpts) => string
      remove: (id: string) => void
      reset: (id?: string) => void
    }
    onloadTurnstileCallback?: () => void
  }
}

type TurnstileOpts = {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'flexible' | 'compact'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

type Props = {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'flexible' | 'compact'
  className?: string
}

export function Turnstile({
  onVerify,
  onExpire,
  onError,
  theme = 'auto',
  size = 'flexible',
  className,
}: Props) {
  const holderRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const cbRef = useRef({ onVerify, onExpire, onError })
  cbRef.current = { onVerify, onExpire, onError }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) return
    let cancelled = false

    const render = () => {
      if (cancelled || !holderRef.current || !window.turnstile) return
      if (widgetIdRef.current) return
      widgetIdRef.current = window.turnstile.render(holderRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token) => cbRef.current.onVerify(token),
        'expired-callback': () => cbRef.current.onExpire?.(),
        'error-callback': () => cbRef.current.onError?.(),
      })
    }

    if (window.turnstile) {
      render()
    } else {
      window.onloadTurnstileCallback = render
    }

    return () => {
      cancelled = true
      const id = widgetIdRef.current
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id)
        } catch {
          /* ignore */
        }
      }
      widgetIdRef.current = null
    }
  }, [siteKey, theme, size])

  if (!siteKey) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
        strategy="lazyOnload"
      />
      <div ref={holderRef} className={className} />
    </>
  )
}
