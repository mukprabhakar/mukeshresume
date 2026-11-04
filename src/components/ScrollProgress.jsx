import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

// Thin brand-red reading-progress bar pinned to the very top (ERP style).
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-brand"
    />
  )
}

export default ScrollProgress
