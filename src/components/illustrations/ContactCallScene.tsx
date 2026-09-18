'use client'

/**
 * ContactCallScene
 * ────────────────
 * A phone-handset with ringing signal waves radiating out and small
 * envelope-shaped message packets arcing in from the corners. Ember/
 * gold palette, cursor-agnostic (this scene loops on its own — the
 * contact page's main interactivity is the form beside it).
 */

const VIEW = { w: 520, h: 420 }

export function ContactCallScene() {
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="h-auto w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="phone-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="phone-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8F5C" />
          <stop offset="100%" stopColor="#E05220" />
        </linearGradient>
        <linearGradient id="msg-flow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E9C46A" stopOpacity="0" />
          <stop offset="50%" stopColor="#F4A261" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Center halo behind phone */}
      <circle cx={VIEW.w / 2} cy={VIEW.h / 2} r="120" fill="url(#phone-halo)">
        <animate
          attributeName="r"
          values="100; 130; 100"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Ringing signal waves — three concentric expanding arcs */}
      {[0, 1, 2].map((i) => (
        <g key={`ring-${i}`}>
          <circle
            cx={VIEW.w / 2}
            cy={VIEW.h / 2}
            r="60"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="1.4"
            opacity="0.7"
          >
            <animate
              attributeName="r"
              values="55; 165"
              dur="2.4s"
              begin={`-${i * 0.8}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.75; 0"
              dur="2.4s"
              begin={`-${i * 0.8}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Phone handset — classic curved handset silhouette, tilted with a
          gentle ring wobble on a slow cycle */}
      <g transform={`translate(${VIEW.w / 2} ${VIEW.h / 2})`}>
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-8; 12; -8; -6; 4; -8"
            keyTimes="0; 0.15; 0.3; 0.45; 0.6; 1"
            dur="3s"
            repeatCount="indefinite"
          />
          {/* Handset body */}
          <path
            d="M -34 -30 Q -38 -34 -32 -38 L -18 -38 Q -12 -34 -14 -28 L -8 -8 L 8 -8 L 14 -28 Q 12 -34 18 -38 L 32 -38 Q 38 -34 34 -30 L 24 -10 Q 22 6 12 14 L -12 14 Q -22 6 -24 -10 Z"
            fill="url(#phone-body)"
            stroke="#F4A261"
            strokeWidth="0.7"
            opacity="0.95"
            style={{ filter: 'drop-shadow(0 0 12px rgba(255, 107, 53, 0.55))' }}
          />
          {/* Highlight strip */}
          <path
            d="M -30 -34 L -20 -34 M 20 -34 L 30 -34"
            stroke="rgba(255,240,220,0.75)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* Speaker dots on the handset */}
          {[-22, -18, -14].map((y) => (
            <circle key={`sd-${y}`} cx={-24} cy={y} r={0.9} fill="rgba(255,240,220,0.6)" />
          ))}
          {[-22, -18, -14].map((y) => (
            <circle key={`sd2-${y}`} cx={24} cy={y} r={0.9} fill="rgba(255,240,220,0.6)" />
          ))}
        </g>
      </g>

      {/* Envelope-shaped message packets arcing in — top-left → phone */}
      {[
        { start: { x: 50, y: 60 }, delay: 0, color: '#E9C46A' },
        { start: { x: VIEW.w - 60, y: 90 }, delay: 1.4, color: '#F4A261' },
        { start: { x: 90, y: VIEW.h - 60 }, delay: 2.8, color: '#FF8F5C' },
      ].map((m, i) => {
        const cx = VIEW.w / 2
        const cy = VIEW.h / 2
        const mid = { x: (m.start.x + cx) / 2, y: (m.start.y + cy) / 2 - 40 }
        const path = `M ${m.start.x} ${m.start.y} Q ${mid.x} ${mid.y} ${cx} ${cy}`
        return (
          <g key={`msg-${i}`}>
            <path
              d={path}
              fill="none"
              stroke="url(#msg-flow)"
              strokeWidth="1"
              strokeDasharray="3 5"
              opacity="0.5"
            />
            <g opacity="0">
              <animate
                attributeName="opacity"
                values="0; 0.95; 0.95; 0"
                keyTimes="0; 0.1; 0.85; 1"
                dur="4.2s"
                begin={`${m.delay}s`}
                repeatCount="indefinite"
              />
              <animateMotion
                dur="4.2s"
                begin={`${m.delay}s`}
                repeatCount="indefinite"
                path={path}
              />
              {/* Envelope glyph */}
              <rect
                x="-6"
                y="-4"
                width="12"
                height="8"
                rx="1"
                fill={m.color}
                stroke="rgba(255,240,220,0.6)"
                strokeWidth="0.6"
                style={{ filter: `drop-shadow(0 0 6px ${m.color}bb)` }}
              />
              <path
                d="M -6 -4 L 0 1 L 6 -4"
                fill="none"
                stroke="rgba(255,240,220,0.75)"
                strokeWidth="0.7"
              />
            </g>
          </g>
        )
      })}

      {/* Chat bubbles rising */}
      {[
        { x: VIEW.w - 90, y: VIEW.h - 80, w: 34, h: 18, delay: 0.6 },
        { x: 70, y: VIEW.h - 110, w: 28, h: 16, delay: 2.4 },
      ].map((b, i) => (
        <g key={`bub-${i}`} opacity="0">
          <animate
            attributeName="opacity"
            values="0; 0.9; 0.9; 0"
            keyTimes="0; 0.15; 0.85; 1"
            dur="5s"
            begin={`${b.delay}s`}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`${b.x} ${b.y}; ${b.x} ${b.y - 30}`}
            dur="5s"
            begin={`${b.delay}s`}
            repeatCount="indefinite"
          />
          <rect
            width={b.w}
            height={b.h}
            rx="4"
            fill="rgba(20,15,11,0.75)"
            stroke="rgba(255,143,92,0.55)"
            strokeWidth="0.7"
          />
          {[0.25, 0.5, 0.75].map((t, ii) => (
            <circle
              key={ii}
              cx={b.w * t}
              cy={b.h / 2}
              r="1.4"
              fill="rgba(255,240,220,0.65)"
            />
          ))}
        </g>
      ))}

      {/* "Available" chip pinned bottom-right — widened so the full
          "LIVE · MON–FRI" label sits comfortably inside the rounded
          rectangle with even trailing padding. */}
      <g transform={`translate(${VIEW.w - 156} ${VIEW.h - 32})`}>
        <rect
          width="140"
          height="22"
          rx="11"
          fill="rgba(20,15,11,0.75)"
          stroke="rgba(233,196,106,0.5)"
          strokeWidth="0.7"
        />
        <circle cx="14" cy="11" r="3.2" fill="#E9C46A">
          <animate
            attributeName="opacity"
            values="1; 0.35; 1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <text
          x="26"
          y="15"
          fontSize="9.5"
          fill="rgba(250,245,238,0.85)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.1em' }}
        >
          LIVE · MON–FRI
        </text>
      </g>
    </svg>
  )
}
