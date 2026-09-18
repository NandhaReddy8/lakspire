'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { CountUp, ProgressBar, Waveform } from '@/components/motion/primitives'

const rows = [
  { id: '#A-1042', text: 'Customer complaint regarding billing discrepancy...', label: 'Billing Issue', confidence: 97, status: 'approved' },
  { id: '#A-1043', text: 'Request for account data export in CSV format...', label: 'Data Request', confidence: 94, status: 'approved' },
  { id: '#A-1044', text: 'Technical support needed for API integration...', label: 'Technical', confidence: 88, status: 'review' },
  { id: '#A-1045', text: 'Product feedback: UI improvements suggested...', label: 'Feedback', confidence: 91, status: 'approved' },
]

const statusColors: Record<string, string> = {
  approved: '#E9C46A',
  review: '#F4A261',
}

export function AnnotationMockup() {
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
      {/* Header row */}
      <div className="grid grid-cols-12 gap-2 border-b border-white/[0.06] px-3 py-2">
        {['ID', 'Text Sample', 'Label', 'Conf.', ''].map((h, i) => (
          <p key={i} className={`text-[9px] font-medium uppercase tracking-[0.08em] text-white/25 ${i === 1 ? 'col-span-5' : i === 4 ? 'col-span-2 text-right' : 'col-span-1'}`} style={{ fontFamily: 'var(--font-body)' }}>{h}</p>
        ))}
        <p className="col-span-3 text-[9px] font-medium uppercase tracking-[0.08em] text-white/25 text-right" style={{ fontFamily: 'var(--font-body)' }}>Status</p>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.04]">
        {rows.map((row, i) => (
          <motion.div
            key={row.id}
            initial={shouldReduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="grid grid-cols-12 items-center gap-2 px-3 py-2.5 hover:bg-white/[0.02]"
          >
            <p className="col-span-1 text-[9px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>{row.id}</p>
            <p className="col-span-5 truncate text-[10px] text-white/55" style={{ fontFamily: 'var(--font-body)' }}>{row.text}</p>
            <span
              className="col-span-2 inline-block rounded px-1.5 py-0.5 text-[8.5px] font-medium"
              style={{ background: 'rgba(244, 162, 97,0.1)', color: '#F4A261', fontFamily: 'var(--font-body)' }}
            >
              {row.label}
            </span>
            <div className="col-span-1 flex flex-col gap-0.5">
              <p className="text-[10px] font-medium text-white/60" style={{ fontFamily: 'var(--font-body)' }}>{row.confidence}%</p>
              {!shouldReduce && (
                <ProgressBar value={row.confidence} color="#F4A261" delay={i * 0.1} height={2} />
              )}
            </div>
            <div className="col-span-3 flex items-center justify-end gap-1.5">
              {row.status === 'review' && !shouldReduce && (
                <Waveform bars={20} width={80} height={16} color="#FF8F5C" gap={2} />
              )}
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: statusColors[row.status] }} />
              <span className="text-[9px]" style={{ color: statusColors[row.status], fontFamily: 'var(--font-body)' }}>{row.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2">
        <p className="text-[9px] text-white/25" style={{ fontFamily: 'var(--font-body)' }}>
          Showing 4 of {shouldReduce ? '2,847' : <CountUp to={2847} format={(n) => Math.round(n).toLocaleString()} />} items
        </p>
        <div className="flex items-center gap-2">
          <div className="relative h-1.5 w-1.5 rounded-full bg-[#E9C46A]">
            {!shouldReduce && (
              <span
                aria-hidden="true"
                className="pulse-dot-ring absolute inset-0 rounded-full"
                style={{ background: '#E9C46A', opacity: 0.5 }}
              />
            )}
          </div>
          <p className="text-[9px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>QA Active</p>
        </div>
      </div>
    </motion.div>
  )
}
