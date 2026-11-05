import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { trackEvent } from '../utils/analytics'
import Portal from './Portal'
import { EASE } from './motion/Reveal'

/* Konami easter egg: ↑ ↑ ↓ ↓ ← → ← → B A (or triggered from the ⌘K palette).
   Fires a short confetti celebration with a hidden call-to-action. */

const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const COLORS = ['#e31e24', '#ffffff', '#fbd7da', '#0a0a0a', '#f97316']

const EasterEgg = () => {
  const [revealed, setRevealed] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let index = 0
    const onKeyDown = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      if (key === SEQUENCE[index]) {
        index += 1
        if (index === SEQUENCE.length) {
          index = 0
          setRevealed(true)
          trackEvent('secret', 'easter_egg', 'konami')
        }
      } else {
        index = key === SEQUENCE[0] ? 1 : 0
      }
    }
    const onSecret = () => setRevealed(true)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mukesh:secret', onSecret)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mukesh:secret', onSecret)
    }
  }, [])

  useEffect(() => {
    if (!revealed) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setRevealed(false) }
    window.addEventListener('keydown', onKey)
    const timer = setTimeout(() => setRevealed(false), 12000)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(timer)
    }
  }, [revealed])

  const confetti = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        id: i,
        left: `${(i * 97) % 100}%`,
        delay: `${(i % 11) * 0.12}s`,
        duration: `${2.4 + (i % 5) * 0.4}s`,
        color: COLORS[i % COLORS.length],
        size: 6 + (i % 4) * 3,
      })),
    []
  )

  return (
    <Portal>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-[110] flex items-center justify-center overflow-hidden bg-ink/80 px-4 backdrop-blur-sm"
            onClick={() => setRevealed(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Secret unlocked"
          >
          <div aria-hidden="true" className="egg-confetti">
            {confetti.map((c) => (
              <span
                key={c.id}
                style={{
                  left: c.left,
                  backgroundColor: c.color,
                  width: `${c.size}px`,
                  height: `${c.size}px`,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.9, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-brand/40 bg-white p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="mb-4 text-5xl" aria-hidden="true">🕹️</div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand">Secret unlocked</p>
            <h3 className="font-display mt-2 text-2xl font-extrabold text-ink">
              You found the Konami code
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Cheat codes work here too — I build products the same way: fast, playful and
              engineered to win. Want a demo of what I can ship for you?
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => { navigate('/clients'); setRevealed(false) }}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-brand-dark hover:shadow-red-glow"
              >
                See client results
              </button>
              <button
                onClick={() => { window.location.href = 'mailto:contact@mukprabhakar.in'; setRevealed(false) }}
                className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-bold text-ink transition-all hover:border-brand hover:text-brand"
              >
                Start a project
              </button>
            </div>
            <p className="mt-5 text-[11px] font-semibold text-ink-muted">Press esc or click anywhere to close</p>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

export default EasterEgg
