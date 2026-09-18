'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CountUp, ProgressBar } from '@/components/motion/primitives'

const tasks = [
  { name: 'Data Processing Batch #44', sla: 'On Track', due: 'Today', progress: 78 },
  { name: 'Client Report — Q3 Analytics', sla: 'Complete', due: 'Done', progress: 100 },
  { name: 'Model Training Dataset', sla: 'At Risk', due: 'Tomorrow', progress: 42 },
]

const slaColor: Record<string, string> = {
  'On Track': '#E9C46A',
  'Complete': '#FF6B35',
  'At Risk': '#F4A261',
}

type Kpi = {
  v: string
  l: string
  c: string
  numeric?: number
  format?: (n: number) => string
}

const kpis: Kpi[] = [
  { v: '18 / 24', l: 'Tasks Done', c: '#FF6B35', numeric: 18, format: (n) => `${Math.round(n)} / 24` },
  { v: '99.1%', l: 'SLA Met', c: '#E9C46A', numeric: 99.1, format: (n) => `${n.toFixed(1)}%` },
  { v: '< 24h', l: 'Avg Turnaround', c: '#F4A261' },
]

export function OperationsDashboardMockup() {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      className="overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5">
        <p className="text-[10px] font-medium text-white/40" style={{ fontFamily: 'var(--font-body)' }}>Operations Summary</p>
        <div className="flex items-center gap-1.5">
          <div className="relative h-1.5 w-1.5 rounded-full bg-[#E9C46A]">
            {!shouldReduce && (
              <span
                aria-hidden="true"
                className="pulse-dot-ring absolute inset-0 rounded-full"
                style={{ background: '#E9C46A', opacity: 0.5 }}
              />
            )}
          </div>
          <p className="text-[9px] text-[#E9C46A]/70" style={{ fontFamily: 'var(--font-body)' }}>Live</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.05] border-b border-white/[0.05]">
        {kpis.map((kpi) => (
          <div key={kpi.l} className="p-2.5">
            <p className="text-[13px] font-semibold" style={{ color: kpi.c, fontFamily: 'var(--font-display)' }}>
              {shouldReduce || kpi.numeric === undefined || !kpi.format ? (
                kpi.v
              ) : (
                <CountUp to={kpi.numeric} format={kpi.format} />
              )}
            </p>
            <p className="text-[8.5px] text-white/25" style={{ fontFamily: 'var(--font-body)' }}>{kpi.l}</p>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div className="divide-y divide-white/[0.04] p-2">
        {tasks.map((task, i) => (
          <motion.div
            key={task.name}
            initial={shouldReduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="py-2"
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-1.5">
                {task.sla === 'At Risk' && !shouldReduce && (
                  <span
                    aria-hidden="true"
                    className="relative inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: slaColor[task.sla] }}
                  >
                    <span
                      className="pulse-dot-ring absolute inset-0 rounded-full"
                      style={{ background: slaColor[task.sla], opacity: 0.5 }}
                    />
                  </span>
                )}
                <p className="truncate text-[10px] text-white/60" style={{ fontFamily: 'var(--font-body)' }}>{task.name}</p>
              </div>
              <span
                className="ml-2 shrink-0 rounded px-1.5 py-0.5 text-[8px] font-medium"
                style={{
                  background: `${slaColor[task.sla]}18`,
                  color: slaColor[task.sla],
                  fontFamily: 'var(--font-body)',
                }}
              >
                {task.sla}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {shouldReduce ? (
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full" style={{ width: `${task.progress}%`, background: slaColor[task.sla], opacity: 0.6 }} />
                </div>
              ) : (
                <div className="flex-1">
                  <ProgressBar value={task.progress} color={slaColor[task.sla]} delay={i * 0.1} height={4} />
                </div>
              )}
              <p className="shrink-0 text-[8px] text-white/25" style={{ fontFamily: 'var(--font-body)' }}>{task.progress}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
