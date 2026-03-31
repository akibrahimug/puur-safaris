'use client'

import { motion } from 'framer-motion'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeUp({ children, delay = 0, duration = 0.52, className }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  )
}
