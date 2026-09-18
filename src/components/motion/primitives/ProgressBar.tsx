'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * <ProgressBar /> — animated fill bar that grows on view.
 * Standalone (non-SVG) — put inside a div layout.
 */
export function ProgressBar({
  value,
  color = '#FF6B35',
  duration = 1.2,
  delay = 0,
  track = 'rgba(255,240,220,0.06)',
  className,
  height = 4,
}: {
  value: number
  color?: string
  duration?: number
  delay?: number
  track?: string
  className?: string
  height?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const t = setTimeout(() => setW(value), delay * 1000)
            return () => clearTimeout(t)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, delay])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height,
        borderRadius: height,
        background: track,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: `${w}%`,
          height: '100%',
          background: color,
          borderRadius: height,
          transition: `width ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`,
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
  )
}
