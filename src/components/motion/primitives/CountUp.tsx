'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * <CountUp /> — counts from 0 → `to` when scrolled into view.
 * Preserves the exact display format via `format` (e.g. n => `${n.toFixed(1)}%`).
 */
export function CountUp({
  to,
  duration = 1.6,
  format = (n) => n.toFixed(0),
  className,
  style,
}: {
  to: number
  duration?: number
  format?: (n: number) => string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    let raf = 0
    let started = false

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true
            const start = performance.now()
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / (duration * 1000))
              const eased = 1 - Math.pow(1 - t, 3)
              setValue(to * eased)
              if (t < 1) raf = requestAnimationFrame(tick)
            }
            raf = requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, duration])

  return (
    <span ref={ref} className={className} style={style}>
      {format(value)}
    </span>
  )
}
