'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * <DrawPath /> — SVG path that draws itself on view (stroke-dashoffset trick).
 * Rendered inside an <svg>. Trigger: intersection observer on `triggerRef` if provided,
 * otherwise fires immediately after mount.
 */
export function DrawPath({
  d,
  color = '#FF6B35',
  width = 1.5,
  duration = 1.2,
  delay = 0,
  opacity = 1,
  fill,
}: {
  d: string
  color?: string
  width?: number
  duration?: number
  delay?: number
  opacity?: number
  fill?: string
}) {
  const ref = useRef<SVGPathElement>(null)
  const [length, setLength] = useState(0)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const l = ref.current.getTotalLength()
    setLength(l)
    const t = setTimeout(() => setDrawn(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <path
      ref={ref}
      d={d}
      fill={fill || 'none'}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      style={{
        strokeDasharray: length || 0,
        strokeDashoffset: drawn ? 0 : length,
        transition: `stroke-dashoffset ${duration}s cubic-bezier(0.65, 0, 0.35, 1)`,
      }}
    />
  )
}
