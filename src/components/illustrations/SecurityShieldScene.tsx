'use client'

/**
 * SecurityShieldScene
 * ───────────────────
 * A central shield with a lock icon. Encryption "particles" (small
 * hex/dot markers with fragments of ciphertext-looking characters)
 * drift inward from the edges, hit the shield boundary, and dissolve.
 * Rotating dashed rings orbit the shield to convey "always on."
 */

const VIEW = { w: 520, h: 420 }
const CENTER = { x: VIEW.w / 2, y: VIEW.h / 2 }
const HEX_CHARS = ['0', '1', 'A', 'F', '8', 'E', '3', 'D', '7', 'B']

function hashRand(seed: number) {
  let t = seed + 0x6d2b79f5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

// Rounded to 3 decimals so SSR & CSR produce byte-identical output.
const round3 = (n: number) => Number(n.toFixed(3))
const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2 + hashRand(i * 3) * 0.6
  const dist = 160 + hashRand(i * 7) * 40
  return {
    sx: round3(CENTER.x + Math.cos(angle) * dist),
    sy: round3(CENTER.y + Math.sin(angle) * dist),
    ex: round3(CENTER.x + Math.cos(angle) * 60),
    ey: round3(CENTER.y + Math.sin(angle) * 60),
    ch: HEX_CHARS[Math.floor(hashRand(i * 11) * HEX_CHARS.length)],
    delay: round3(hashRand(i * 17) * -3),
    color: ['#FF6B35', '#F4A261', '#E9C46A'][i % 3],
  }
})

export function SecurityShieldScene() {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="shield-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="shield-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF8F5C" />
          <stop offset="100%" stopColor="#E05220" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <circle cx={CENTER.x} cy={CENTER.y} r="130" fill="url(#shield-halo)">
        <animate attributeName="r" values="115; 145; 115" dur="3.2s" repeatCount="indefinite" />
      </circle>

      {/* Orbit rings */}
      {[80, 110, 145].map((r, i) => (
        <circle
          key={`ring-${i}`}
          cx={CENTER.x}
          cy={CENTER.y}
          r={r}
          fill="none"
          stroke={['#FF6B35', '#F4A261', '#E9C46A'][i]}
          strokeWidth="0.6"
          opacity="0.28"
          strokeDasharray="4 6"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${CENTER.x} ${CENTER.y}`}
            to={`${i % 2 === 0 ? 360 : -360} ${CENTER.x} ${CENTER.y}`}
            dur={`${20 + i * 10}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Encryption particles — drift inward and fade at the boundary */}
      {PARTICLES.map((p, i) => {
        const path = `M ${p.sx} ${p.sy} L ${p.ex} ${p.ey}`
        return (
          <g key={`p-${i}`}>
            <path d={path} stroke={p.color} strokeWidth="0.5" strokeDasharray="2 3" opacity="0.35" fill="none" />
            <g opacity="0">
              <animate
                attributeName="opacity"
                values="0; 0.95; 0.95; 0"
                keyTimes="0; 0.2; 0.75; 1"
                dur="3.6s"
                begin={`${p.delay}s`}
                repeatCount="indefinite"
              />
              <animateMotion dur="3.6s" begin={`${p.delay}s`} repeatCount="indefinite" path={path} />
              <circle r="2.5" fill={p.color} style={{ filter: `drop-shadow(0 0 4px ${p.color}bb)` }} />
              <text
                x="4"
                y="4"
                fontSize="8"
                fontFamily="var(--font-mono)"
                fill={p.color}
                opacity="0.85"
              >
                {p.ch}
              </text>
            </g>
          </g>
        )
      })}

      {/* Central shield */}
      <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
        <path
          d="M 0 -60 L 46 -46 L 46 6 Q 46 42 0 62 Q -46 42 -46 6 L -46 -46 Z"
          fill="url(#shield-body)"
          stroke="rgba(255,240,220,0.5)"
          strokeWidth="0.9"
          opacity="0.98"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255,107,53,0.65))' }}
        />
        {/* Inner bezel */}
        <path
          d="M 0 -52 L 38 -40 L 38 4 Q 38 34 0 52 Q -38 34 -38 4 L -38 -40 Z"
          fill="none"
          stroke="rgba(255,240,220,0.3)"
          strokeWidth="0.6"
        />

        {/* Lock body */}
        <rect x="-14" y="-6" width="28" height="22" rx="3" fill="rgba(20,15,11,0.85)" stroke="rgba(255,240,220,0.65)" strokeWidth="0.7" />
        <path
          d="M -8 -6 L -8 -14 A 8 8 0 0 1 8 -14 L 8 -6"
          stroke="rgba(255,240,220,0.85)"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Keyhole */}
        <circle cx="0" cy="3" r="2.4" fill="#FF8F5C" />
        <rect x="-1" y="4" width="2" height="6" rx="1" fill="#FF8F5C" />

        {/* Radial scan sweep across the shield */}
        <g style={{ transformOrigin: '0px 0px' }}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="8s"
            repeatCount="indefinite"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-50"
            stroke="rgba(233,196,106,0.9)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.55"
          />
        </g>
      </g>

      {/* Bottom badge */}
      <g transform={`translate(${VIEW.w / 2 - 60} ${VIEW.h - 44})`}>
        <rect width="120" height="22" rx="11" fill="rgba(20,15,11,0.75)" stroke="rgba(233,196,106,0.5)" strokeWidth="0.7" />
        <circle cx="12" cy="11" r="3.2" fill="#E9C46A">
          <animate attributeName="opacity" values="1; 0.35; 1" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <text
          x="22"
          y="15"
          fontSize="9.5"
          fill="rgba(250,245,238,0.85)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.14em' }}
        >
          ENCRYPTED · IN-TRANSIT
        </text>
      </g>
    </svg>
  )
}
