'use client'

/**
 * <Waveform /> — audio-spectrum-style vertical bars that animate independently.
 * Standalone SVG (not embedded), sized via width/height props.
 */
export function Waveform({
  bars = 32,
  width = 240,
  height = 32,
  color = '#FF6B35',
  gap = 2,
}: {
  bars?: number
  width?: number
  height?: number
  color?: string
  gap?: number
}) {
  const barWidth = (width - gap * (bars - 1)) / bars
  // Deterministic heights to avoid SSR/CSR mismatch
  const heights = Array.from({ length: bars }, (_, i) => {
    const t = i / bars
    // Multiple sines for organic spectrum feel
    return (
      0.35 +
      0.25 * Math.sin(t * Math.PI * 3) +
      0.15 * Math.sin(t * Math.PI * 7) +
      0.15 * Math.sin(t * Math.PI * 13)
    )
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {heights.map((h, i) => {
        const round = (n: number) => Math.round(n * 1000) / 1000
        const x = round(i * (barWidth + gap))
        const barHeight = round(Math.max(2, Math.abs(h) * height))
        const y = round((height - barHeight) / 2)
        const delay = (i * 0.05).toFixed(2)
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={round(barWidth)}
            height={barHeight}
            rx={round(barWidth / 2)}
            fill={color}
            className="waveform-bar"
            style={{ animationDelay: `${delay}s`, transformOrigin: `${round(x + barWidth / 2)}px ${round(height / 2)}px` }}
          />
        )
      })}
    </svg>
  )
}