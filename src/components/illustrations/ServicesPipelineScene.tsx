'use client'

/**
 * ServicesPipelineScene
 * ─────────────────────
 * Raw data blocks enter from the left, pass through three rotating
 * gears (representing the four service groups working in sequence),
 * and exit as structured record cards on the right. A continuous flow
 * of ember/gold packets moves along the belt.
 */

const VIEW = { w: 560, h: 360 }
const RAIL_Y = VIEW.h / 2

export function ServicesPipelineScene() {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="belt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E9C46A" stopOpacity="0" />
          <stop offset="20%" stopColor="#F4A261" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#FF6B35" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF8F5C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gear-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28211C" />
          <stop offset="100%" stopColor="#14100D" />
        </linearGradient>
      </defs>

      {/* Ambient warm bloom */}
      <ellipse
        cx={VIEW.w / 2}
        cy={RAIL_Y}
        rx="220"
        ry="80"
        fill="rgba(255,107,53,0.14)"
        style={{ filter: 'blur(20px)' }}
      />

      {/* Conveyor rail */}
      <line
        x1="20"
        y1={RAIL_Y}
        x2={VIEW.w - 20}
        y2={RAIL_Y}
        stroke="url(#belt-grad)"
        strokeWidth="1.6"
        strokeDasharray="4 6"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2.4s" repeatCount="indefinite" />
      </line>
      <line
        x1="20"
        y1={RAIL_Y}
        x2={VIEW.w - 20}
        y2={RAIL_Y}
        stroke="rgba(255,240,220,0.06)"
        strokeWidth="0.6"
      />

      {/* Input stack — raw records on the left */}
      <g transform={`translate(50 ${RAIL_Y - 44})`}>
        {[0, 1, 2].map((i) => (
          <rect
            key={`in-${i}`}
            x={-24}
            y={i * 24}
            width="48"
            height="18"
            rx="2"
            fill="rgba(28,22,17,0.9)"
            stroke={i === 0 ? '#FF8F5C' : 'rgba(255,143,92,0.35)'}
            strokeWidth="0.7"
            opacity={1 - i * 0.15}
          >
            <animate
              attributeName="opacity"
              values={`${1 - i * 0.15}; ${0.5 - i * 0.15}; ${1 - i * 0.15}`}
              dur="2.4s"
              begin={`-${i * 0.4}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
        {[0, 1, 2].map((i) =>
          [8, 20, 32].map((tx, ii) => (
            <rect
              key={`in-line-${i}-${ii}`}
              x={-24 + tx}
              y={i * 24 + 6}
              width={ii === 1 ? 12 : 8}
              height="1.4"
              fill="rgba(255,240,220,0.4)"
              opacity="0.6"
            />
          )),
        )}
        <text
          x="0"
          y="80"
          textAnchor="middle"
          fontSize="9"
          fill="rgba(255,143,92,0.85)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.14em' }}
        >
          RAW
        </text>
      </g>

      {/* Three processing gears */}
      {[
        { x: 180, r: 30, dur: 6, color: '#FF6B35' },
        { x: 280, r: 24, dur: 4, color: '#F4A261' },
        { x: 380, r: 30, dur: 7, color: '#E9C46A' },
      ].map((g, i) => (
        <g key={`gear-${i}`} transform={`translate(${g.x} ${RAIL_Y})`}>
          {/* Halo */}
          <circle r={g.r + 8} fill={`${g.color}22`} />
          {/* Rotating gear */}
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to={i % 2 === 0 ? '360' : '-360'}
              dur={`${g.dur}s`}
              repeatCount="indefinite"
            />
            {/* Gear teeth. Coordinates are rounded to 3 decimals so
                SSR and client hydrations produce identical string
                serialisations of the float (React complains if the
                last decimal drifts by 1 ulp between renders). */}
            {Array.from({ length: 10 }).map((_, k) => {
              const angle = (k / 10) * Math.PI * 2
              const r = g.r + 4
              const tx = Number((Math.cos(angle) * r).toFixed(3))
              const ty = Number((Math.sin(angle) * r).toFixed(3))
              const rot = Number(((angle * 180) / Math.PI + 90).toFixed(3))
              return (
                <rect
                  key={`tooth-${k}`}
                  x={tx - 2}
                  y={ty - 3}
                  width="4"
                  height="6"
                  rx="1"
                  fill={g.color}
                  transform={`rotate(${rot} ${tx} ${ty})`}
                  opacity="0.85"
                />
              )
            })}
            {/* Gear body */}
            <circle r={g.r} fill="url(#gear-body)" stroke={g.color} strokeWidth="0.8" />
            <circle r={g.r * 0.55} fill="rgba(20,15,11,0.85)" stroke={g.color} strokeWidth="0.6" />
            <circle r={g.r * 0.15} fill={g.color} />
          </g>
        </g>
      ))}

      {/* Output structured record cards — clean rows on the right */}
      <g transform={`translate(${VIEW.w - 70} ${RAIL_Y - 44})`}>
        {[0, 1, 2].map((i) => (
          <g key={`out-${i}`}>
            <rect
              x={-24}
              y={i * 24}
              width="48"
              height="18"
              rx="2"
              fill="rgba(20,15,11,0.9)"
              stroke={i === 0 ? '#E9C46A' : 'rgba(233,196,106,0.4)'}
              strokeWidth="0.7"
            />
            {/* Structured content lines */}
            {[3, 15, 27, 39].map((tx, ii) => (
              <rect
                key={`out-line-${i}-${ii}`}
                x={-24 + tx}
                y={i * 24 + 6}
                width={ii % 2 === 0 ? 10 : 8}
                height="1.4"
                fill={ii === 0 ? '#F4A261' : 'rgba(255,240,220,0.55)'}
                opacity="0.85"
              />
            ))}
            {/* Verification tick */}
            {i === 0 && (
              <g transform={`translate(${16} ${i * 24 + 9})`}>
                <circle r="3" fill="#E9C46A" opacity="0.95" />
                <path
                  d="M -1.4 0 L -0.4 1.1 L 1.6 -1.1"
                  stroke="rgba(20,15,11,0.95)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}
          </g>
        ))}
        <text
          x="0"
          y="80"
          textAnchor="middle"
          fontSize="9"
          fill="rgba(233,196,106,0.9)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.14em' }}
        >
          STRUCTURED
        </text>
      </g>

      {/* Flowing packets moving along the rail */}
      {[0, 1.5, 3, 4.5].map((delay, i) => (
        <g key={`pk-${i}`} opacity="0">
          <animate
            attributeName="opacity"
            values="0; 0.95; 0.95; 0"
            keyTimes="0; 0.08; 0.92; 1"
            dur="6s"
            begin={`-${delay}s`}
            repeatCount="indefinite"
          />
          <animateMotion
            dur="6s"
            begin={`-${delay}s`}
            repeatCount="indefinite"
            path={`M 80 ${RAIL_Y} L ${VIEW.w - 80} ${RAIL_Y}`}
          />
          <circle r="3" fill="#FF6B35" style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,53,0.8))' }} />
        </g>
      ))}
    </svg>
  )
}
