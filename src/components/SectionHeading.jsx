import React from 'react'
import { Reveal } from './motion/Reveal'

/**
 * SectionHeading – premium animated heading block.
 * Eyebrow pill chip + display title + muted description, each
 * revealing with a small stagger.
 *
 * tone: 'dark' (on black/#0A0A0A sections) | 'light' (on white/#F5F5F5 sections)
 */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'dark',
  className = '',
}) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const titleColor = tone === 'light' ? 'text-ink' : 'text-white'
  const descColor = tone === 'light' ? 'text-ink-muted' : 'text-zinc-400'
  const eyebrowCls = tone === 'light' ? 'erp-eyebrow-light' : 'erp-eyebrow'

  return (
    <div className={`mb-12 flex flex-col gap-4 sm:mb-16 ${alignCls} ${className}`}>
      {eyebrow ? (
        <Reveal direction="fade">
          <span className={eyebrowCls}>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.05}>
        <h2
          id={id}
          className={`font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15] ${titleColor}`}
        >
          {title}
        </h2>
      </Reveal>

      {description ? (
        <Reveal delay={0.1}>
          <p
            className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
              align === 'center' ? 'mx-auto' : ''
            } ${descColor}`}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
