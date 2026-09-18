'use client'

import { motion, useReducedMotion } from 'framer-motion'

const layers = [
  { label: 'Access Layer', sub: 'APIs · Dashboards · Reports', color: '#E9C46A', opacity: 0.85 },
  { label: 'Governance Layer', sub: 'Policies · Audit · Compliance', color: '#FF6B35', opacity: 0.7 },
  { label: 'Storage Layer', sub: 'Data Lake · Warehouse · Archive', color: '#FF8F5C', opacity: 0.55 },
  { label: 'Ingestion Layer', sub: 'Batch · Stream · API Sources', color: '#F4A261', opacity: 0.4 },
]

export function DataArchitectureDiagram() {
  const shouldReduce = useReducedMotion()

  return (
    <div className="w-full space-y-1.5" aria-hidden="true">
      {layers.map((layer, i) => (
        <motion.div
          key={layer.label}
          initial={shouldReduce ? false : { opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2"
          style={{
            background: `${layer.color}0A`,
            border: `1px solid ${layer.color}22`,
          }}
        >
          {/* Sweeping activity shine — very subtle */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 arch-sweep"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${layer.color}22 50%, transparent 100%)`,
              animationDelay: `${i * 0.7}s`,
            }}
          />

          {/* Pulsing dot */}
          <div className="relative shrink-0">
            <span
              className="absolute inset-0 rounded-full arch-dot-ring"
              style={{ background: layer.color, animationDelay: `${i * 0.35}s` }}
            />
            <div
              className="relative h-1.5 w-1.5 rounded-full"
              style={{ background: layer.color, boxShadow: `0 0 6px ${layer.color}` }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-white/70" style={{ fontFamily: 'var(--font-display)' }}>{layer.label}</p>
            <p className="text-[9.5px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>{layer.sub}</p>
          </div>

          {/* Cascading activity dots */}
          <div className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="h-1 w-3 rounded-full arch-tick"
                style={{
                  background: layer.color,
                  animationDelay: `${i * 0.3 + j * 0.18}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
