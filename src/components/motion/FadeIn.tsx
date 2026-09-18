'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  y?: number
}

export function FadeIn({ children, delay = 0, duration = 0.6, className, y = 16 }: FadeInProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
