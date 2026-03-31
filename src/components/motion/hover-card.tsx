'use client'

import { motion } from 'framer-motion'

interface HoverCardProps {
  children: React.ReactNode
  className?: string
  lift?: number
}

export function HoverCard({ children, className, lift = 6 }: HoverCardProps) {
  return (
    <motion.div
      className={className}
      style={{ display: 'flex', flexDirection: 'column' }}
      whileHover={{ y: -lift, transition: { duration: 0.26, ease: 'easeOut' } }}
    >
      {children}
    </motion.div>
  )
}
