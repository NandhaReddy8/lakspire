'use client'

/**
 * ServicesPipelineScene
 * ─────────────────────
 * A heap of chunky raw data on the left enters a belt, passes through
 * three rotating processing gears (representing the service groups
 * working in sequence), and exits as clean structured record cards on
 * the right. Packets stream continuously along the belt with a small
 * spark burst as each one passes a gear.
 */

const VIEW = { w: 560, h: 360 }
const RAIL_Y = VIEW.h / 2
const GEARS = [
  { x: 180, r: 30, dur: 6, color: '#FF6B35' },
  { x: 280, r: 24, dur: 4, color: '#F4A261' },
  { x: 380, r: 30, dur: 7, color: '#E9C46A' },
]

// Chunky raw blocks — five uneven stacked slabs with per-slab jitter so
// the pile reads as MESSY / unstructured. Each carries a dense byte row
// pattern with the occasional "corrupt" red mark to sell "raw".
const RAW_BLOCKS = [
  { w: 66, h: 24, dx: -4, rot: -2.4, tone: 0.95 },
  { w: 72, h: 24, dx: 3, rot: 1.6, tone: 0.85 },
  { w: 64, h: 24, dx: -6, rot: -1.1, tone: 0.78 },
  { w: 70, h: 24, dx: 5, rot: 2.2, tone: 0.7 },
  { w: 62, h: 24, dx: -2, rot: -0.6, tone: 0.6 },
]

// Deterministic bit pattern per block row — hex-ish glyphs of varying
// width so the block interiors feel dense and irregular.
function bytes(seed: number, width: number) {
  const cells: Array<{ x: number; w: number; corrupt?: boolean }> = []
  let x = 4
  let s = seed
  while (x < width - 6) {
    s = (s * 9301 + 49297) % 233280
    const w = 2 + (s % 4)
    const gap = 1 + ((s >> 2) % 2)
    const corrupt = ((s >> 4) % 17) === 0
    if (x + w > width - 4) break
    cells.push({ x, w, corrupt })
    x += w + gap
  }
  return cells
}

export function ServicesPipelineScene() {
  return (
    <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="belt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E9C46A" stopOpacity="0" />
          <stop offset="18%" stopColor="#F4A261" stopOpacity="0.95" />
          <stop offset="82%" stopColor="#FF6B35" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FF8F5C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gear-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#28211C" />
          <stop offset="100%" stopColor="#14100D" />
        </linearGradient>
        <linearGradient id="raw-slab" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A211B" />
          <stop offset="100%" stopColor="#17110D" />
        </linearGradient>
        <radialGradient id="gear-spark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD9B4" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#FF8F5C" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient warm bloom */}
      <ellipse
        cx={VIEW.w / 2}
        cy={RAIL_Y}
        rx="230"
        ry="88"
        fill="rgba(255,107,53,0.16)"
        style={{ filter: 'blur(22px)' }}
      />

      {/* Conveyor rail — thicker + brighter, faster dash */}
      <line
        x1="20"
        y1={RAIL_Y}
        x2={VIEW.w - 20}
        y2={RAIL_Y}
        stroke="rgba(255,240,220,0.08)"
        strokeWidth="1"
      />
      <line
        x1="20"
        y1={RAIL_Y}
        x2={VIEW.w - 20}
        y2={RAIL_Y}
        stroke="url(#belt-grad)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeDasharray="6 8"
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,107,53,0.5))' }}
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="1.6s" repeatCount="indefinite" />
      </line>

      {/* Chunky RAW input heap — five uneven slabs with jitter, dense
          byte content, some corrupt cells. A subtle group-level wobble
          sells the "pile is unstable, needs sorting" story. */}
      <g transform={`translate(56 ${RAIL_Y - RAW_BLOCKS.length * 12})`}>
        <animateTransform
          attributeName="transform"
          type="translate"
          additive="sum"
          values="0 0; 0.6 -0.4; -0.5 0.5; 0 0"
          keyTimes="0; 0.35; 0.7; 1"
          dur="2.2s"
          repeatCount="indefinite"
        />
        {RAW_BLOCKS.map((b, i) => (
          <g
            key={`raw-${i}`}
            transform={`translate(${b.dx} ${i * 22}) rotate(${b.rot} ${b.w / 2} ${b.h / 2})`}
          >
            {/* slab body */}
            <rect
              x={-b.w / 2}
              y={0}
              width={b.w}
              height={b.h}
              rx="2.5"
              fill="url(#raw-slab)"
              stroke={`rgba(255,143,92,${0.28 + i * 0.06})`}
              strokeWidth="0.9"
            />
            {/* jagged left "torn" edge */}
            <path
              d={`M ${-b.w / 2 + 0.6} 3 L ${-b.w / 2 - 2} 6 L ${-b.w / 2 + 0.6} 9 L ${-b.w / 2 - 1.4} 12 L ${-b.w / 2 + 0.6} 15 L ${-b.w / 2 - 2} 18 L ${-b.w / 2 + 0.6} 21`}
              fill="none"
              stroke={`rgba(255,143,92,${0.5 + i * 0.05})`}
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            {/* byte cells across two rows */}
            {[7, 15].map((rowY, ri) => {
              const cells = bytes(i * 41 + ri * 17, b.w - 4)
              return cells.map((c, ci) => (
                <rect
                  key={`bc-${i}-${ri}-${ci}`}
                  x={-b.w / 2 + c.x}
                  y={rowY}
                  width={c.w}
                  height="2.4"
                  rx="0.5"
                  fill={
                    c.corrupt
                      ? 'rgba(255,80,60,0.85)'
                      : ci % 3 === 0
                        ? 'rgba(255,143,92,0.75)'
                        : 'rgba(250,245,238,0.55)'
                  }
                />
              ))
            })}
            {/* corner warning bit on the top slab */}
            {i === 0 && (
              <g transform={`translate(${b.w / 2 - 6} 4)`}>
                <circle r="2.2" fill="rgba(255,80,60,0.85)">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </g>
        ))}
        <text
          x="0"
          y={RAW_BLOCKS.length * 22 + 22}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,143,92,0.9)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.18em' }}
        >
          RAW
        </text>
      </g>

      {/* Three processing gears with pulsing halos */}
      {GEARS.map((g, i) => (
        <g key={`gear-${i}`} transform={`translate(${g.x} ${RAIL_Y})`}>
          {/* Ambient halo — pulsing so gears feel "hot" */}
          <circle r={g.r + 10} fill={`${g.color}22`}>
            <animate
              attributeName="r"
              values={`${g.r + 6};${g.r + 14};${g.r + 6}`}
              dur="1.8s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.55;0.95;0.55"
              dur="1.8s"
              begin={`${i * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
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
                  opacity="0.9"
                />
              )
            })}
            {/* Gear body */}
            <circle r={g.r} fill="url(#gear-body)" stroke={g.color} strokeWidth="1" />
            <circle r={g.r * 0.55} fill="rgba(20,15,11,0.9)" stroke={g.color} strokeWidth="0.7" />
            <circle r={g.r * 0.18} fill={g.color}>
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="1.2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
          {/* Spark burst — a small bright ring that expands + fades on a
              staggered cycle so each gear "fires" when a packet arrives. */}
          <circle r="4" fill="url(#gear-spark)" opacity="0">
            <animate
              attributeName="r"
              values="3;22"
              dur="1.5s"
              begin={`${i * 0.55}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0"
              dur="1.5s"
              begin={`${i * 0.55}s`}
              repeatCount="indefinite"
            />
          </circle>
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
          fontSize="10"
          fill="rgba(233,196,106,0.95)"
          fontFamily="var(--font-mono)"
          style={{ letterSpacing: '0.18em' }}
        >
          STRUCTURED
        </text>
      </g>

      {/* Flowing packets — 7 packets on a 4.8s cycle so the belt reads
          as a continuous stream instead of pulsing beads. Each packet is
          a small ember dot with a warm drop-shadow. cx/cy stay at 0 with
          the position living in the M-coordinate of the motion path (see
          hero for why). Group is hidden until motion attaches so no
          packet flashes at (0,0). */}
      {[0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2].map((delay, i) => (
        <g key={`pk-${i}`} visibility="hidden">
          <set
            attributeName="visibility"
            to="visible"
            begin="0.08s"
            fill="freeze"
          />
          <animateMotion
            dur="4.8s"
            begin={`-${delay}s`}
            repeatCount="indefinite"
            path={`M 90 ${RAIL_Y} L ${VIEW.w - 90} ${RAIL_Y}`}
          />
          {/* Trailing halo — soft aura breathing 5→13px around each
              belt packet on a 1.4s loop. */}
          <circle cx={0} cy={0} r={7} fill="#FF6B35" opacity="0">
            <animate
              attributeName="r"
              values="5;13;5"
              dur="1.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0; 0.3; 0.3; 0"
              keyTimes="0; 0.08; 0.92; 1"
              dur="4.8s"
              begin={`-${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          <circle cx={0} cy={0} r={3.4} fill="#FF6B35" opacity="0" style={{ filter: 'drop-shadow(0 0 8px rgba(255,107,53,0.95))' }}>
            <animate
              attributeName="opacity"
              values="0; 0.98; 0.98; 0"
              keyTimes="0; 0.08; 0.92; 1"
              dur="4.8s"
              begin={`-${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  )
}
