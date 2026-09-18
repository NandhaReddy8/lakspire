'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerGroup({ children, className, staggerDelay = 0.08 }: StaggerGroupProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduce ? 0 : staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      variants={
        shouldReduce
          ? {}
          : {
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
