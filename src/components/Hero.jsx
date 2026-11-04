import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import Button from './ui/Button'
import { EASE, Floating } from './motion/Reveal'

/* Hero – black base, white typography, strategic red accents.
   Staggered entrance orchestration + lightweight particle field. */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

const RESUME_URL = '/resume'

const socials = [
  { name: 'GitHub', url: 'https://github.com/mukprabhakar', d: 'M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.25-.26-4.6-1.13-4.6-5.01 0-1.11.39-2.01 1.03-2.72-.1-.26-.45-1.28.1-2.68 0 0 .85-.27 2.79 1.03A9.58 9.58 0 0 1 12 6.84c.85.004 1.7.114 2.5.33 1.94-1.3 2.79-1.03 2.79-1.03.55 1.4.2 2.42.1 2.68.64.71 1.03 1.61 1.03 2.72 0 3.89-2.35 4.75-4.61 5.01.36.31.68.92.68 1.85v2.73c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/mukprabhakar/', d: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-7 6.67h-2.5v7.66h2.5v-7.66zM9.25 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zm4.08 2.17c-1.1 0-1.84.51-2.17 1.25h-.03v-1.09h-2.1v7.66h2.19v-3.78c0-.99.2-1.94 1.41-1.94s1.21.94 1.21 2.02v3.7h2.19v-4.5c0-2.5-1.33-3.63-3.1-3.63z' },
  { name: 'Instagram', url: 'https://www.instagram.com/mukprabhakar/', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.668.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { name: 'Portfolio', url: 'https://mukprabhakar.in', d: 'M12 2a10 10 0 100 20 10 10 0 000-20zm7.93 9h-3.59a13.5 13.5 0 00-1.15-5.1A8.03 8.03 0 0119.93 11zM12 4.07A12.3 12.3 0 0114.14 11h-4.28A12.3 12.3 0 0112 4.07zM7.81 5.9A13.5 13.5 0 006.66 11H3.07a8.03 8.03 0 014.74-5.1zM3.07 13h3.59a13.5 13.5 0 001.15 5.1A8.03 8.03 0 013.07 13zM12 19.93A12.3 12.3 0 019.86 13h4.28A12.3 12.3 0 0112 19.93zM14.19 18.1a13.5 13.5 0 001.15-5.1h3.59a8.03 8.03 0 01-4.74 5.1z' },
]

const Hero = () => {
  const canvasRef = useRef(null)
  const [typedText, setTypedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150)
  const [projectCount, setProjectCount] = useState(0)
  const [studentCount, setStudentCount] = useState(0)

  const roles = [
    'AI Agent Developer',
    'Co-Founder & CTO',
    'Google Student Ambassador',
    'Microsoft Learn Student Ambassador',
    'Freelance Software Developer',
    'Technical Team Lead',
  ]

  // Animate counters for social proof
  useEffect(() => {
    let animationFrame
    const duration = 2000
    const startTime = Date.now()
    const animateCounters = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setProjectCount(Math.floor(20 * progress))
      setStudentCount(Math.floor(2000 * progress))
      if (progress < 1) animationFrame = requestAnimationFrame(animateCounters)
      else {
        setProjectCount(20)
        setStudentCount(2000)
      }
    }
    animationFrame = requestAnimationFrame(animateCounters)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Typewriter for rotating roles
  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length
      const fullText = roles[i]
      if (isDeleting) {
        setTypedText(fullText.substring(0, typedText.length - 1))
        setTypingSpeed(60)
      } else {
        setTypedText(fullText.substring(0, typedText.length + 1))
        setTypingSpeed(110)
      }
      if (!isDeleting && typedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1400)
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }
    }
    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [typedText, isDeleting, loopNum, typingSpeed, roles])

  // Lightweight particle network (perf-aware, reduced-motion aware)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext ? canvas.getContext('2d') : null
    if (!ctx) return
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles = []
    const particleCount = window.innerWidth < 768 ? 36 : 90

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2.2 + 0.5
        this.speedX = Math.random() * 0.8 - 0.4
        this.speedY = Math.random() * 0.8 - 0.4
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.55 ? '227, 30, 36' : '255, 255, 255'
      }
      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY
      }
      draw() {
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 110) {
            const opacity = 0.18 * (1 - distance / 110)
            ctx.strokeStyle = `rgba(227, 30, 36, ${opacity})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
        particles[i].update()
        particles[i].draw()
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink pt-28 pb-20"
      aria-labelledby="hero-heading"
    >
      {/* Decorative grid + red glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 erp-grid erp-grid-fade" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full erp-red-glow opacity-25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 bottom-0 h-[420px] w-[420px] rounded-full erp-red-glow opacity-10 blur-3xl"
      />

      {/* Particle network */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text column */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left lg:w-[55%]"
          >
            <motion.div variants={item} className="mb-6">
              <span className="erp-eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
                Full-Stack Developer&ensp;|&ensp;Software Engineer&ensp;|&ensp;AI Agent Developer
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              id="hero-heading"
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-extrabold leading-[1.04] tracking-tight text-white mb-4"
            >
              <span className="block text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-400 mb-3">Hi, I&apos;m</span>
              <span className="relative inline-block text-white">
                Mukesh{' '}
                <span className="relative inline-block text-brand">
                  Pal
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
                    className="absolute -bottom-1 left-0 h-[4px] w-full origin-left rounded-full bg-brand shadow-red-glow"
                  />
                </span>
              </span>
            </motion.h1>

            <motion.div variants={item} className="h-12 sm:h-14 mb-5">
              <h2 className="font-display text-2xl sm:text-3xl md:text-[2rem] text-zinc-100 font-semibold">
                I build with <span className="text-brand">{typedText}</span>
                <span className="inline-block w-1 h-8 sm:h-9 ml-1 bg-brand animate-blink align-middle" aria-hidden="true"></span>
              </h2>
            </motion.div>

            <motion.p variants={item} className="text-base sm:text-lg text-zinc-400 mb-8 max-w-2xl leading-relaxed">
              From blank screens to bold solutions — I craft scalable web applications, SaaS
              products and <span className="text-white font-semibold">AI-powered agents</span> using{' '}
              <span className="text-brand font-semibold">React.js</span>,{' '}
              <span className="text-brand font-semibold">Java Spring Boot</span> and the{' '}
              <span className="text-brand font-semibold">MERN stack</span>, delivering measurable
              ROI for startups and growing businesses.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                as="a"
                href="#work"
                variant="brand"
                size="lg"
                onClick={() => trackEvent('click', 'hero', 'explore_work_cta')}
                aria-label="Explore Mukesh Pal's work"
              >
                Explore My Work
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button
                as="a"
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlineInvert"
                size="lg"
                onClick={() => trackEvent('click', 'hero', 'download_resume_cta')}
                aria-label="Download Mukesh Pal's resume"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
                </svg>
                Download Resume
              </Button>
            </motion.div>

            {/* Social links */}
            <motion.div variants={item} className="mt-8 flex justify-center lg:justify-start gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target={s.name === 'Portfolio' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={`Follow me on ${s.name}`}
                  onClick={() => trackEvent('click', 'hero', `social_${s.name.toLowerCase()}`)}
                  className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:border-brand hover:bg-brand hover:shadow-red-glow"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </motion.div>

            {/* Social proof counters */}
            <motion.div
              variants={item}
              className="mt-10 flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-5 border-t border-white/10 pt-8"
            >
              {[
                { value: `${projectCount}+`, label: 'Projects Delivered' },
                { value: `${studentCount}+`, label: 'Community Reached' },
                { value: '14+', label: 'AI Agents Built' },
                { value: '3+', label: 'Years Experience' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center lg:items-start">
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {s.value.replace('+', '')}
                    <span className="text-brand">+</span>
                  </div>
                  <div className="text-zinc-400 text-sm">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Profile image with red accent ring */}
          <div className="lg:w-[45%] flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
              className="relative group"
            >
              {/* Rotating red accent ring */}
              <div
                aria-hidden="true"
                className="absolute -inset-6 rounded-full border border-brand/30 animate-spin-slow"
              >
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand shadow-red-glow" />
              </div>
              {/* Glow */}
              <div className="absolute -inset-4 rounded-full erp-red-glow opacity-25 group-hover:opacity-40 transition-opacity blur-2xl" aria-hidden="true" />

              {/* Portrait */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[340px] lg:h-[340px] rounded-full overflow-hidden border-4 border-brand/70 shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]">
                <img
                  src="https://res.cloudinary.com/dddmyjevn/image/upload/q_auto/f_auto/v1775281267/mukeshp_ybprrz.png"
                  alt="Mukesh Pal – Full-Stack Developer, Software Engineer and AI Agent Developer"
                  width="340"
                  height="340"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden="true" />
              </div>

              {/* Availability badge */}
              <Floating className="absolute top-2 left-1/2 -translate-x-1/2" duration={6} delay={0.2}>
                <div className="rounded-full bg-brand px-4 py-1.5 text-xs font-bold text-white shadow-red-glow whitespace-nowrap">
                  Available for Projects
                </div>
              </Floating>

              {/* Floating tech chips */}
              <Floating className="absolute -top-4 -right-4" duration={6.5} delay={0.4}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-card text-2xl shadow-xl">
                  ☕
                </div>
              </Floating>
              <Floating className="absolute -bottom-4 -left-4" duration={7.5} delay={0.9}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-card text-2xl shadow-xl">
                  ⚛️
                </div>
              </Floating>
              <Floating className="absolute top-1/3 -left-10" duration={8} delay={0.6}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-card text-2xl shadow-xl">
                  🤖
                </div>
              </Floating>
              <Floating className="absolute top-1/3 -right-10" duration={7} delay={1.1}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-card text-2xl shadow-xl">
                  🚀
                </div>
              </Floating>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            trackEvent('click', 'hero', 'scroll_indicator')
          }}
        >
          <span className="text-zinc-400 text-sm mb-2 group-hover:text-brand transition-colors">Scroll to Explore</span>
          <div className="w-10 h-16 rounded-full border-2 border-brand/50 flex justify-center p-1 relative overflow-hidden">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-3 bg-brand rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
