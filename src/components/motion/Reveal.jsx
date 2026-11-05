import React from 'react'
import { motion } from 'framer-motion'

/* ------------------------------------------------------------------ */
/* Shared easing + variants (ported from the ERP reference site)       */
/* ------------------------------------------------------------------ */

export const EASE = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: EASE } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
}

const directionMap = {
  up: fadeUp,
  fade: fadeIn,
  scale: scaleIn,
  left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } },
  right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } },
}

/* ------------------------------------------------------------------ */
/* <Reveal> – single element scroll-in animation                       */
/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  as = 'div',
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
  ...rest
}) {
  const Tag = motion[as] || motion.div
  return (
    <Tag
      className={className}
      variants={directionMap[direction] || fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-60px' }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* <StaggerGroup> + <StaggerItem> – orchestrated list animations       */
/* ------------------------------------------------------------------ */

export function StaggerGroup({ children, className = '', stagger = 0.12, delay = 0.1 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', ...rest }) {
  return (
    <motion.div className={className} variants={fadeUp} style={{ willChange: 'transform, opacity' }} {...rest}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* <Floating> – gentle infinite float for decorative UI chips          */
/* ------------------------------------------------------------------ */

export function Floating({ children, className = '', duration = 6, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: delay + 0.8 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.4 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default Reveal
