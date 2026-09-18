'use client'

/**
 * <DataStream /> — one or more particles (data packets) traveling along a path.
 * Uses SVG <animateMotion> attached to a hidden reference path.
 * Renders inside an <svg>.
 */
export function DataStream({
  path,
  color = '#FF8F5C',
  count = 3,
  size = 2.5,
  duration = 4,
  glow = true,
  offset = 0,
}: {
  path: string
  color?: string
  count?: number
  size?: number
  duration?: number
  glow?: boolean
  offset?: number
}) {
  const pathId = `stream-${path.length}-${Math.round(duration * 100)}-${offset}`
  return (
    <>
      <defs>
        <path id={pathId} d={path} />
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const begin = (offset + (duration / count) * i).toFixed(2)
        return (
          <circle
            key={i}
            r={size}
            fill={color}
            filter={glow ? `drop-shadow(0 0 4px ${color})` : undefined}
          >
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${begin}s`}
              rotate="0"
              path={path}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.85;1"
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${begin}s`}
            />
          </circle>
        )
      })}
    </>
  )
}