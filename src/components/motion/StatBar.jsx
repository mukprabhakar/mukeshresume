import { motion } from 'framer-motion'
import { EASE } from './Reveal'

/* ------------------------------------------------------------------ */
/* StatBar – progress bar that fills itself when scrolled into view     */
/* ------------------------------------------------------------------ */

/**
 * `pct` is the final width in percent (0-100). The bar grows from zero with
 * the shared brand easing, so difficulty/skill breakdowns read as motion
 * instead of a static block of colour.
 */
export function StatBar({ pct = 0, trackClass = 'bg-zinc-800', fillClass = 'bg-brand', height = 'h-1.5 sm:h-2', delay = 0 }) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(pct) ? pct : 0))
  return (
    <div className={`w-full ${trackClass} rounded-full ${height} overflow-hidden`}>
      <motion.div
        className={`${fillClass} h-full rounded-full relative`}
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 + delay }}
      >
        {/* travelling sheen – sells the "still loading / still climbing" feel */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/35 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, delay: 0.7 + delay, repeat: Infinity, repeatDelay: 3.4 }}
        />
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* SkeletonCard – shimmering placeholder while remote data loads        */
/* ------------------------------------------------------------------ */

export const SkeletonCard = ({ className = '', rounded = 'rounded-xl' }) => (
  <div className={`glass-card ${rounded} overflow-hidden ${className}`} aria-hidden="true">
    <div className="animate-pulse space-y-4 p-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-zinc-800" />
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-2/3 rounded bg-zinc-800" />
          <div className="h-2.5 w-1/3 rounded bg-zinc-800/70" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg bg-zinc-800/60" />
        <div className="h-16 rounded-lg bg-zinc-800/60" />
      </div>
      <div className="space-y-2 pt-1">
        <div className="h-2.5 rounded bg-zinc-800/70" />
        <div className="h-2.5 rounded bg-zinc-800/50" />
        <div className="h-2.5 w-4/5 rounded bg-zinc-800/50" />
      </div>
    </div>
  </div>
)

/* ------------------------------------------------------------------ */
/* Shine – sweeping highlight that runs across a card on hover          */
/* ------------------------------------------------------------------ */

export const HoverShine = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.14] to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[110%] group-hover:opacity-100 ${className}`}
  />
)

export default StatBar
