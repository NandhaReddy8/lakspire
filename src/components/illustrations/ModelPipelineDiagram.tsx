'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { DataStream, FlowingLine, PulseDot } from '@/components/motion/primitives'

const steps = [
  { label: 'Data', icon: '◈', color: '#F4A261', status: 'complete' },
  { label: 'Features', icon: '◉', color: '#FF8F5C', status: 'complete' },
  { label: 'Train', icon: '⟳', color: '#FF6B35', status: 'running' },
  { label: 'Evaluate', icon: '◎', color: '#FF6B35', status: 'queued' },
  { label: 'Deploy', icon: '▲', color: '#E9C46A', status: 'queued' },
]

// Fixed viewBox — five stages evenly spaced at x = 20, 90, 160, 230, 300
// Each icon box is 36x36 (rx=8), centered at STAGE_X[i], y=32
const STAGE_X = [20, 90, 160, 230, 300]
const CENTER_Y = 32
const CONNECT_PAD = 20 // half-width of icon box + a small gap
const VIEW = { w: 320, h: 68 }

export function ModelPipelineDiagram() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="w-full" aria-hidden="true">
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="rail-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4A261" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E9C46A" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Base rail — a single continuous line under everything */}
        <line
          x1={STAGE_X[0] + CONNECT_PAD}
          y1={CENTER_Y}
          x2={STAGE_X[STAGE_X.length - 1] - CONNECT_PAD}
          y2={CENTER_Y}
          stroke="rgba(255,240,220,0.1)"
          strokeWidth="1"
        />

        {/* Per-connector flow + data packets */}
        {steps.slice(0, -1).map((step, i) => {
          const x1 = STAGE_X[i] + CONNECT_PAD
          const x2 = STAGE_X[i + 1] - CONNECT_PAD
          const path = `M ${x1} ${CENTER_Y} L ${x2} ${CENTER_Y}`
          const color = steps[i + 1].color
          return (
            <g key={`c-${i}`}>
              {!shouldReduce && (
                <>
                  <FlowingLine
                    d={path}
                    color={color}
                    dash="5 7"
                    speed={4.5}
                    width={1.25}
                    delay={i * 0.35}
                    opacity={0.9}
                  />
                  <DataStream
                    path={path}
                    color={color}
                    count={1}
                    size={2.4}
                    duration={2.6}
                    glow
                    offset={i * 0.55}
                  />
                </>
              )}
            </g>
          )
        })}

        {/* Stage boxes + icons — foreground */}
        {steps.map((step, i) => {
          const x = STAGE_X[i] - 18
          const y = CENTER_Y - 18
          return (
            <motion.g
              key={step.label}
              initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ transformOrigin: `${STAGE_X[i]}px ${CENTER_Y}px` }}
            >
              {/* Box */}
              <rect
                x={x}
                y={y}
                width={36}
                height={36}
                rx={8}
                fill={`${step.color}18`}
                stroke={`${step.color}55`}
                strokeWidth={1}
              />
              {/* Running indicator — pulse dot in top-right corner */}
              {step.status === 'running' && !shouldReduce && (
                <PulseDot cx={STAGE_X[i] + 14} cy={CENTER_Y - 14} color={step.color} size={2.2} />
              )}
              {/* Complete indicator — small filled dot */}
              {step.status === 'complete' && (
                <circle cx={STAGE_X[i] + 14} cy={CENTER_Y - 14} r={2} fill={step.color} opacity={0.85} />
              )}
              {/* Icon glyph */}
              <text
                x={STAGE_X[i]}
                y={CENTER_Y + 4}
                textAnchor="middle"
                fontSize={14}
                fill={step.color}
                fontFamily="system-ui"
                fontWeight={500}
              >
                {step.icon}
              </text>
              {/* Label under */}
              <text
                x={STAGE_X[i]}
                y={CENTER_Y + 32}
                textAnchor="middle"
                fontSize={8.5}
                fill="rgba(250,245,238,0.55)"
                fontFamily="var(--font-body)"
              >
                {step.label}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
