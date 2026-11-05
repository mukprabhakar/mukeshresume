import { motion } from 'framer-motion'
import { Reveal, EASE } from './motion/Reveal'
import CountUp from './CountUp'

/**
 * PageHero – the shared animated banner for the standalone routes
 * (blog, coding, badges, products).
 *
 * A pulsing eyebrow chip, a display headline whose highlighted word gets a
 * sweeping underline, an optional description and an optional stat strip that
 * counts itself up. Everything reveals with the site's shared easing.
 */
const PageHero = ({ eyebrow, title, highlight, description, stats = [], titleId }) => (
  <div className="text-center mb-14 sm:mb-20">
    {eyebrow ? (
      <Reveal direction="fade">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-300 backdrop-blur sm:text-xs">
          <motion.span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-brand"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {eyebrow}
        </span>
      </Reveal>
    ) : null}

    <Reveal delay={0.06}>
      <h1 id={titleId} className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl">
        {title}
        {highlight ? (
          <>
            {' '}
            <span className="relative inline-block bg-gradient-to-r from-brand-300 via-brand to-brand-700 bg-clip-text text-transparent">
              {highlight}
              <motion.span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-brand/70"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
              />
            </span>
          </>
        ) : null}
      </h1>
    </Reveal>

    {description ? (
      <Reveal direction="fade" delay={0.14}>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {description}
        </p>
      </Reveal>
    ) : null}

    {stats.length > 0 ? (
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            direction="scale"
            delay={0.22 + index * 0.07}
            className="min-w-[6.5rem] rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 backdrop-blur transition-colors duration-300 hover:border-brand/40"
          >
            <span className="block font-display text-xl font-extrabold text-white sm:text-2xl">
              {typeof stat.value === 'number' ? (
                <CountUp value={stat.value} prefix={stat.prefix || ''} suffix={stat.suffix || ''} />
              ) : (
                `${stat.prefix || ''}${stat.value}${stat.suffix || ''}`
              )}
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </div>
    ) : null}
  </div>
)

export default PageHero
