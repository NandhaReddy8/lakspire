'use client'

/**
 * <PulseDot /> — SVG dot with pulsing halo. Use inside an <svg>.
 *
 * Props:
 *  cx, cy: center coordinates
 *  color:  fill color (default ember orange)
 *  size:   inner dot radius (default 3)
 *  delay:  seconds to offset the pulse (stagger multiple dots)
 */
export function PulseDot({
  cx,
  cy,
  color = '#FF6B35',
  size = 3,
  delay = 0,
  intensity = 1,
}: {
  cx: number
  cy: number
  color?: string
  size?: number
  delay?: number
  intensity?: number
}) {
  const style = { animationDelay: `${delay}s` } as React.CSSProperties
  return (
    <g style={style} className="pulse-dot-group">
      {/* Outer halo — animates */}
      <circle cx={cx} cy={cy} r={size} fill={color} opacity={0.4 * intensity} className="pulse-dot-ring" style={style} />
      {/* Inner dot — solid */}
      <circle cx={cx} cy={cy} r={size} fill={color} />
      <circle cx={cx} cy={cy} r={size * 0.6} fill="white" opacity={0.9} />
    </g>
  )
}