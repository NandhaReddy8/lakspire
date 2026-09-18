'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PulseDot, DataStream, FlowingLine } from '@/components/motion/primitives'

const nodes = [
  { id: 'raw', label: 'Raw Data', sublabel: 'Ingestion', x: 20, color: '#FF6B35' },
  { id: 'transform', label: 'Transform', sublabel: 'Clean & Normalise', x: 120, color: '#FF8F5C' },
  { id: 'validate', label: 'Validate', sublabel: 'QA & Schema', x: 220, color: '#F4A261' },
  { id: 'output', label: 'Structured', sublabel: 'Output', x: 320, color: '#E9C46A' },
]

export function DataPipelineDiagram() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative w-full" aria-hidden="true">
      <svg viewBox="0 0 360 80" className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Connecting lines — animated flow */}
        {nodes.slice(0, -1).map((node, i) => {
          const path = `M ${node.x + 28} 32 L ${nodes[i + 1].x - 2} 32`
          return (
            <g key={`link-${node.id}`}>
              {/* Base line */}
              <line
                x1={node.x + 28}
                y1={32}
                x2={nodes[i + 1].x - 2}
                y2={32}
                stroke="rgba(255,240,220,0.08)"
                strokeWidth="1"
              />
              {/* Flowing dashes on top */}
              <FlowingLine
                d={path}
                color={nodes[i + 1].color}
                width={1.2}
                dash="4 6"
                speed={3.5}
                delay={i * 0.4}
                opacity={0.9}
              />
              {/* Data packet traveling */}
              <DataStream
                path={path}
                color={nodes[i + 1].color}
                count={1}
                size={2.2}
                duration={2.5}
                offset={i * 0.6}
              />
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            <rect
              x={node.x - 2}
              y={16}
              width={32}
              height={32}
              rx="6"
              fill={`${node.color}14`}
              stroke={`${node.color}40`}
              strokeWidth="1"
            />
            <PulseDot cx={node.x + 14} cy={32} color={node.color} size={3} delay={i * 0.4} />
            <text x={node.x + 14} y={58} textAnchor="middle" fontSize="7.5" fill="rgba(250,245,238,0.6)" fontFamily="var(--font-body)">{node.label}</text>
            <text x={node.x + 14} y={67} textAnchor="middle" fontSize="6" fill="rgba(250,245,238,0.3)" fontFamily="var(--font-body)">{node.sublabel}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
