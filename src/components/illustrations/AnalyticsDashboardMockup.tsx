'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CountUp, DrawPath, FlowingLine, PulseDot } from '@/components/motion/primitives'

type Kpi = {
  v: string
  l: string
  c: string
  numeric: number
  format: (n: number) => string
}

const kpis: Kpi[] = [
  { v: '+24%', l: 'Revenue Impact', c: '#E9C46A', numeric: 24, format: (n) => `+${Math.round(n)}%` },
  { v: '99.1%', l: 'Data Accuracy', c: '#FF6B35', numeric: 99.1, format: (n) => `${n.toFixed(1)}%` },
  { v: '3.2M', l: 'Rows Processed', c: '#F4A261', numeric: 3.2, format: (n) => `${n.toFixed(1)}M` },
]

export function AnalyticsDashboardMockup() {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      style={{ transform: 'perspective(900px) rotateX(5deg) rotateY(-2deg)', transformOrigin: 'center top' }}
      className="overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-white/[0.07]" />
            <div className="h-2 w-2 rounded-full bg-white/[0.07]" />
            <div className="h-2 w-2 rounded-full bg-white/[0.07]" />
          </div>
          <span className="text-[9px] text-white/20" style={{ fontFamily: 'var(--font-body)' }}>Analytics Overview</span>
        </div>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <span className="absolute inset-0 rounded-full arch-dot-ring" style={{ background: '#E9C46A' }} />
            <div className="relative h-1.5 w-1.5 rounded-full" style={{ background: '#E9C46A', boxShadow: '0 0 6px #E9C46A' }} />
          </div>
          <span className="text-[8px] uppercase tracking-[0.1em] text-white/40" style={{ fontFamily: 'var(--font-body)' }}>Live</span>
        </div>
      </div>

      <div className="p-3">
        {/* KPI tiles */}
        <div className="mb-3 grid grid-cols-3 gap-2">
          {kpis.map((kpi) => (
            <div key={kpi.l} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
              <p className="text-[12px] font-semibold" style={{ color: kpi.c, fontFamily: 'var(--font-display)' }}>
                {shouldReduce ? kpi.v : <CountUp to={kpi.numeric} format={kpi.format} />}
              </p>
              <p className="text-[8px] text-white/25" style={{ fontFamily: 'var(--font-body)' }}>{kpi.l}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="mb-2">
          <p className="mb-1.5 text-[8px] text-white/25" style={{ fontFamily: 'var(--font-body)' }}>Weekly Throughput</p>
          <div className="relative flex items-end gap-1" style={{ height: '48px' }}>
            {[55, 70, 48, 85, 62, 90, 78].map((h, i) => (
              <motion.div
                key={i}
                className={`relative flex-1 rounded-sm ${i === 5 && !shouldReduce ? 'bar-peak-pulse' : ''}`}
                style={{
                  height: `${h}%`,
                  background: i === 5 ? '#FF6B35' : 'rgba(255,107,53,0.22)',
                  transformOrigin: 'bottom',
                  boxShadow: i === 5 ? '0 0 12px rgba(255,107,53,0.55)' : undefined,
                }}
                initial={shouldReduce ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="flex-1 text-center text-[7px] text-white/20">{d}</span>
            ))}
          </div>
        </div>

        {/* Trend line — with animated flow overlay + leading dot */}
        <svg viewBox="0 0 200 30" className="w-full" preserveAspectRatio="none" aria-hidden="true" style={{ height: 30 }}>
          {shouldReduce ? (
            <path d="M0 25 C30 22 50 18 80 15 C110 12 140 8 170 5 C185 3 195 4 200 3" fill="none" stroke="#E9C46A" strokeWidth="1.2" strokeOpacity="0.5" />
          ) : (
            <>
              {/* Static base curve — subtle */}
              <path
                d="M0 25 C30 22 50 18 80 15 C110 12 140 8 170 5 C185 3 195 4 200 3"
                fill="none"
                stroke="#E9C46A"
                strokeWidth={1}
                strokeOpacity={0.25}
              />
              {/* Draw-in overlay on view */}
              <DrawPath
                d="M0 25 C30 22 50 18 80 15 C110 12 140 8 170 5 C185 3 195 4 200 3"
                color="#F4A261"
                width={1.4}
                duration={1.8}
                delay={0.4}
                opacity={0.85}
              />
              {/* Continuous flow dash on top */}
              <FlowingLine
                d="M0 25 C30 22 50 18 80 15 C110 12 140 8 170 5 C185 3 195 4 200 3"
                color="#FF8F5C"
                width={1}
                dash="2 4"
                speed={5}
                delay={2}
                opacity={0.6}
              />
              {/* Leading pulse dot at the trend endpoint */}
              <PulseDot cx={200} cy={3} color="#FF6B35" size={1.8} delay={2.2} />
            </>
          )}
        </svg>
      </div>
    </motion.div>
  )
}
