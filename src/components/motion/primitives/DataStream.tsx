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
          // Wrapped in a visibility-gated <g>: the SVG spec applies
          // <animateMotion> as a translate on top of the referenced
          // element, and until begin fires the circle sits at (0,0)
          // fully opaque. Without this gate every waiting packet piled
          // up in the top-left corner of the parent SVG.
          <g key={i} visibility="hidden">
            <set
              attributeName="visibility"
              to="visible"
              begin={`${begin}s`}
              fill="freeze"
            />
            <animateMotion
              dur={`${duration}s`}
              repeatCount="indefinite"
              begin={`${begin}s`}
              rotate="0"
              path={path}
            />
            <circle
              r={size}
              fill={color}
              opacity={0}
              filter={glow ? `drop-shadow(0 0 4px ${color})` : undefined}
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.15;0.85;1"
                dur={`${duration}s`}
                repeatCount="indefinite"
                begin={`${begin}s`}
              />
            </circle>
          </g>
        )
      })}
    </>
  )
}