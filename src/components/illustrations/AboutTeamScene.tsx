'use client'

/**
 * AboutTeamScene
 * ──────────────
 * Three abstract "team" nodes (representing data + technology + human
 * expertise) converging into a central pulsing insight core. Data
 * streams flow between them; the core radiates on a slow heartbeat.
 */

const VIEW = { w: 520, h: 420 }
const CENTER = { x: VIEW.w / 2, y: VIEW.h / 2 }

const NODES = [
  { x: 80, y: 90, color: '#FF6B35', label: 'DATA' },
  { x: VIEW.w - 80, y: 90, color: '#F4A261', label: 'TECHNOLOGY' },
  { x: VIEW.w / 2, y: VIEW.h - 80, color: '#E9C46A', label: 'HUMAN' },
]

export function AboutTeamScene() {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="core-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#F4A261" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stream-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E9C46A" stopOpacity="0" />
          <stop offset="50%" stopColor="#F4A261" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Backing halo */}
      <circle cx={CENTER.x} cy={CENTER.y} r="130" fill="url(#core-halo)">
        <animate
          attributeName="r"
          values="115; 145; 115"
          dur="4.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Concentric rings around the core */}
      {[46, 68, 92].map((r, i) => (
        <circle
          key={`ring-${i}`}
          cx={CENTER.x}
          cy={CENTER.y}
          r={r}
          fill="none"
          stroke="rgba(255,143,92,0.24)"
          strokeWidth="0.6"
          strokeDasharray="2 4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CENTER.x} ${CENTER.y}`}
            to={`${i % 2 === 0 ? 360 : -360} ${CENTER.x} ${CENTER.y}`}
            dur={`${18 + i * 4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Curved streams from each corner node to the core */}
      {NODES.map((n, i) => {
        const midX = (n.x + CENTER.x) / 2
        const midY = (n.y + CENTER.y) / 2
        const d = `M ${n.x} ${n.y} Q ${midX + (i === 0 ? 20 : i === 1 ? -20 : 0)} ${midY + (i === 2 ? -30 : 10)} ${CENTER.x} ${CENTER.y}`
        return (
          <g key={`stream-${i}`}>
            <path
              d={d}
              fill="none"
              stroke="url(#stream-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 6"
              opacity="0.6"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-50"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            {/* Traveling data packet — inbound to the core */}
            {[0, 1.1].map((delay, k) => (
              <g key={`pk-${i}-${k}`} opacity="0">
                <animate
                  attributeName="opacity"
                  values="0; 0.95; 0.95; 0"
                  keyTimes="0; 0.15; 0.85; 1"
                  dur="3.8s"
                  begin={`-${delay}s`}
                  repeatCount="indefinite"
                />
                <animateMotion
                  dur="3.8s"
                  begin={`-${delay}s`}
                  repeatCount="indefinite"
                  path={d}
                />
                <circle
                  r={2.6 - k * 0.4}
                  fill={n.color}
                  style={{ filter: `drop-shadow(0 0 6px ${n.color}cc)` }}
                />
              </g>
            ))}
          </g>
        )
      })}

      {/* Corner nodes with radar ping */}
      {NODES.map((n, i) => (
        <g key={`n-${i}`}>
          <circle
            cx={n.x}
            cy={n.y}
            r="16"
            fill="none"
            stroke={n.color}
            strokeWidth="0.7"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="14; 26"
              dur="2.6s"
              begin={`-${i * 0.6}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6; 0"
              dur="2.6s"
              begin={`-${i * 0.6}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={n.x}
            cy={n.y}
            r="9"
            fill={n.color}
            opacity="0.92"
            style={{ filter: `drop-shadow(0 0 10px ${n.color}dd)` }}
          />
          {/* Inner glyph */}
          <circle cx={n.x} cy={n.y} r="3.2" fill="rgba(20,15,11,0.9)" />
          <text
            x={n.x}
            y={n.y + 34}
            textAnchor="middle"
            fontSize="9"
            fill={n.color}
            fontFamily="var(--font-mono)"
            style={{ letterSpacing: '0.14em' }}
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* Central insight core — pulsing */}
      <g>
        <circle cx={CENTER.x} cy={CENTER.y} r="24" fill="rgba(20,15,11,0.85)" stroke="rgba(255,143,92,0.55)" strokeWidth="0.7" />
        <circle cx={CENTER.x} cy={CENTER.y} r="14" fill="#FF6B35" opacity="0.9" style={{ filter: 'drop-shadow(0 0 14px rgba(255,107,53,0.75))' }}>
          <animate attributeName="r" values="12; 15; 12" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx={CENTER.x} cy={CENTER.y} r="5" fill="rgba(255,240,220,0.95)" />
        <text
          x={CENTER.x}
          y={CENTER.y + 46}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(255,143,92,0.85)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.16em' }}
        >
          INSIGHT
        </text>
      </g>
    </svg>
  )
}
