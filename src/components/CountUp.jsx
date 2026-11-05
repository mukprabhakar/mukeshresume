import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { EASE } from './motion/Reveal'

/**
 * CountUp – animates a number from 0 to `value` the first time it scrolls
 * into view. Used on the coding, badges and products pages so statistics feel
 * alive instead of popping in fully formed.
 *
 * Falls back to the final value when the visitor prefers reduced motion.
 */
const CountUp = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1.4,
  decimals = 0,
  className = '',
}) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const progress = useMotionValue(0)
  const text = useTransform(progress, (v) => {
    const fixed = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US')
    return `${prefix}${fixed}${suffix}`
  })

  useEffect(() => {
    if (!inView) return undefined
    const target = Number.isFinite(value) ? value : 0
    if (reduceMotion) {
      progress.set(target)
      return undefined
    }
    // Delay a beat so the reveal of the card itself lands first.
    const controls = animate(progress, target, { duration, ease: EASE, delay: 0.15 })
    return () => controls.stop()
  }, [inView, value, duration, progress, reduceMotion])

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}

export default CountUp
