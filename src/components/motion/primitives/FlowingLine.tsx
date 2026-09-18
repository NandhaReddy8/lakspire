'use client'

/**
 * <FlowingLine /> — SVG path with animated dashed stroke moving along it.
 * Used for "data pipeline in motion" feel.
 *
 * Renders inside an <svg>.
 *
 * Props:
 *  d:         SVG path definition
 *  color:     stroke color
 *  width:     stroke width (default 1.5)
 *  dash:      dash pattern (default "6 10")
 *  speed:     seconds per full dash cycle (default 6, higher = slower)
 *  reverse:   flip flow direction
 *  delay:     seconds to stagger the start
 */
export function FlowingLine({
  d,
  color = '#FF6B35',
  width = 1.5,
  dash = '6 10',
  speed = 6,
  reverse = false,
  delay = 0,
  opacity = 0.9,
}: {
  d: string
  color?: string
  width?: number
  dash?: string
  speed?: number
  reverse?: boolean
  delay?: number
  opacity?: number
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash}
      strokeLinecap="round"
      opacity={opacity}
      className="flowing-line"
      style={{
        animationDuration: `${speed}s`,
        animationDelay: `${delay}s`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    />
  )
}