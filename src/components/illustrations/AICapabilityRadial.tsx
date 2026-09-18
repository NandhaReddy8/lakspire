'use client'

import { FlowingLine, DataStream, PulseDot } from '@/components/motion/primitives'

/**
 * AICapabilityRadial
 * ──────────────────
 * Hub-and-spoke: a pulsing "Your Data" core with six capability spokes
 * radiating out. Uses SVG native <animateTransform> for ring rotation
 * (reliable across browsers vs. CSS transform-origin on SVG groups).
 */

const VIEW = { w: 480, h: 320 }
const HUB = { x: 240, y: 160, r: 22 }

const SPOKES = [
  { angle: -78, label: 'LLM Fine-tuning',  radius: 108, color: '#FF6B35' },
  { angle: -22, label: 'Model Evaluation', radius: 112, color: '#FF8F5C' },
  { angle:  32, label: 'RAG Pipelines',    radius: 108, color: '#F4A261' },
  { angle:  90, label: 'Agent Workflows',  radius: 100, color: '#E9C46A' },
  { angle: 150, label: 'Multimodal',       radius: 112, color: '#FABD6C' },
  { angle: 208, label: 'Data Curation',    radius: 108, color: '#F4A261' },
]

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return {
    x: Math.round((cx + r * Math.cos(a)) * 100) / 100,
    y: Math.round((cy + r * Math.sin(a)) * 100) / 100,
  }
}

export function AICapabilityRadial() {
  return (
    <div className="relative w-full" aria-hidden="true">
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} className="h-auto w-full">
        <defs>
          <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8F5C" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF6B35" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Slowly rotating dashed rings (native SVG animateTransform) */}
        <g>
          {[95, 72, 50].map((r, i) => (
            <circle
              key={r}
              cx={HUB.x}
              cy={HUB.y}
              r={r}
              fill="none"
              stroke="rgba(255,107,53,0.18)"
              strokeWidth={i === 2 ? 0.8 : 0.6}
              strokeDasharray={i === 2 ? undefined : `${3 + i} ${6 + i * 2}`}
            />
          ))}
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${HUB.x} ${HUB.y}`}
            to={`360 ${HUB.x} ${HUB.y}`}
            dur="60s"
            repeatCount="indefinite"
          />
        </g>

        {/* Counter-rotating fine ring */}
        <g>
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={83}
            fill="none"
            stroke="rgba(255,143,92,0.22)"
            strokeWidth={0.6}
            strokeDasharray="1 8"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`360 ${HUB.x} ${HUB.y}`}
            to={`0 ${HUB.x} ${HUB.y}`}
            dur="28s"
            repeatCount="indefinite"
          />
        </g>

        {/* Spokes: base line + flowing dash + streaming packet + terminal pulse */}
        {SPOKES.map((s, i) => {
          const end = polar(HUB.x, HUB.y, s.radius, s.angle)
          const start = polar(HUB.x, HUB.y, HUB.r + 2, s.angle)
          const path = `M ${start.x} ${start.y} L ${end.x} ${end.y}`
          return (
            <g key={s.label}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,240,220,0.09)"
                strokeWidth={0.8}
              />
              <FlowingLine
                d={path}
                color={s.color}
                width={1.2}
                dash="3 6"
                speed={4}
                delay={i * 0.3}
                opacity={0.85}
              />
              <DataStream
                path={path}
                color={s.color}
                count={1}
                size={1.8}
                duration={2.6}
                offset={i * 0.35}
              />
              <PulseDot cx={end.x} cy={end.y} color={s.color} size={2.8} delay={i * 0.4} />
            </g>
          )
        })}

        {/* Hub glow */}
        <circle cx={HUB.x} cy={HUB.y} r={38} fill="url(#hub-grad)" />

        {/* Hub body */}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={HUB.r}
          fill="rgba(255,107,53,0.18)"
          stroke="rgba(255,107,53,0.6)"
          strokeWidth={1}
        />

        {/* Hub pulse rings — native SVG animate for guaranteed centering */}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={HUB.r}
          fill="none"
          stroke="rgba(255,143,92,0.7)"
          strokeWidth={1}
        >
          <animate attributeName="r" values={`${HUB.r};${HUB.r * 2.4};${HUB.r * 2.4}`} keyTimes="0;0.7;1" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0" keyTimes="0;0.7;1" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={HUB.r}
          fill="none"
          stroke="rgba(255,143,92,0.7)"
          strokeWidth={1}
        >
          <animate attributeName="r" values={`${HUB.r};${HUB.r * 2.4};${HUB.r * 2.4}`} keyTimes="0;0.7;1" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0" keyTimes="0;0.7;1" dur="2.6s" begin="1.3s" repeatCount="indefinite" />
        </circle>

        {/* Hub label */}
        <text
          x={HUB.x}
          y={HUB.y - 2}
          textAnchor="middle"
          fontSize={9.5}
          fill="rgba(250,245,238,0.9)"
          fontFamily="var(--font-display)"
          fontWeight={500}
        >
          Your
        </text>
        <text
          x={HUB.x}
          y={HUB.y + 9}
          textAnchor="middle"
          fontSize={9.5}
          fill="rgba(250,245,238,0.9)"
          fontFamily="var(--font-display)"
          fontWeight={500}
        >
          Data
        </text>

        {/* Spoke labels */}
        {SPOKES.map((s) => {
          const labelPos = polar(HUB.x, HUB.y, s.radius + 18, s.angle)
          const anchor =
            labelPos.x > HUB.x + 12 ? 'start' : labelPos.x < HUB.x - 12 ? 'end' : 'middle'
          const dx = anchor === 'start' ? 6 : anchor === 'end' ? -6 : 0
          return (
            <text
              key={`t-${s.label}`}
              x={labelPos.x + dx}
              y={labelPos.y + 3}
              textAnchor={anchor}
              fontSize={9.5}
              fill="rgba(250,245,238,0.7)"
              fontFamily="var(--font-body)"
            >
              {s.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
