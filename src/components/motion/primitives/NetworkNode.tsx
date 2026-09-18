'use client'

/**
 * <NetworkNode /> — a neuron-style node with a pulsing ring.
 * Rendered inside an <svg>.
 */
export function NetworkNode({
  cx,
  cy,
  r = 6,
  color = '#FF6B35',
  active = true,
  delay = 0,
  label,
}: {
  cx: number
  cy: number
  r?: number
  color?: string
  active?: boolean
  delay?: number
  label?: string
}) {
  const style = { animationDelay: `${delay}s` } as React.CSSProperties
  return (
    <g>
      {active && (
        <>
          <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.25} className="node-ring-outer" style={style} />
          <circle cx={cx} cy={cy} r={r} fill={color} opacity={0.4} className="node-ring-inner" style={style} />
        </>
      )}
      <circle cx={cx} cy={cy} r={r * 0.65} fill={color} />
      <circle cx={cx} cy={cy} r={r * 0.35} fill="white" opacity={0.85} />
      {label && (
        <text
          x={cx}
          y={cy - r - 8}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(250,245,238,0.55)"
          fontFamily="var(--font-body)"
        >
          {label}
        </text>
      )}
    </g>
  )
}