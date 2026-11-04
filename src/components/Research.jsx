import React from 'react'
import { motion } from 'framer-motion'
import { trackEvent } from '../utils/analytics'
import { Reveal, EASE, Floating } from './motion/Reveal'

/* Research & Publications – dark academic-style section.
   Every entry is grounded in work already documented across this portfolio
   (Achievements, GitHub stats, blog publications). */

const publications = [
  {
    type: 'Technical Research Paper',
    date: 'Mar 2025',
    title: 'LLM Comparison 2025: DeepSeek vs ChatGPT vs Grok vs Google Gemini',
    summary: 'A comparative analysis benchmarking four leading large language models across reasoning, coding, and cost-efficiency dimensions — published on the portfolio blog.',
    link: '/blog/llm-comparative-analysis-2025',
    linkLabel: 'Read Paper',
    external: false,
    tags: ['LLM', 'Benchmarking', 'AI'],
  },
  {
    type: 'Field Research Collaboration',
    date: '2023',
    title: 'Climate Change Monitoring — ISRO NRSC Hyderabad',
    summary: 'Conducted field research at ISRO NRSC Hyderabad on climate change monitoring, working directly with Scientist Dr. Alok Taori to develop satellite data analysis methodologies.',
    link: 'https://github.com/mukprabhakar/isro-climate-research',
    linkLabel: 'View Repository',
    external: true,
    tags: ['Remote Sensing', 'Satellite Data', 'Climate'],
  },
  {
    type: 'Applied Engineering Research',
    date: '2023',
    title: 'Swarm Drone Technology for Indian Military',
    summary: 'Engineered swarm drone technology for the Indian Military under Garwal Battalion at Meerut Cantt, focusing on coordinated multi-drone operations and tactical applications.',
    link: 'https://github.com/mukprabhakar/swarm-drone-project',
    linkLabel: 'View Repository',
    external: true,
    tags: ['C++', 'Multi-Agent Systems', 'Defence Tech'],
  },
  {
    type: 'AI / Computer Vision Project',
    date: '2024',
    title: 'Campus Security Vision System — IIMT University',
    summary: 'AI/ML CCTV image-recognition system matching students to institutional records, reducing incident response time by 60% on campus.',
    link: 'https://github.com/mukprabhakar',
    linkLabel: 'View on GitHub',
    external: true,
    tags: ['Computer Vision', 'AI/ML', 'Security'],
  },
]

const interests = [
  { icon: '🧠', title: 'Large Language Models', desc: 'Benchmarking, prompt engineering and cost-aware model routing.' },
  { icon: '🛰️', title: 'Satellite & Geospatial AI', desc: 'Climate monitoring and remote-sensing data analysis methods.' },
  { icon: '🤖', title: 'Autonomous Agent Systems', desc: 'Multi-agent coordination — from swarm drones to AI work agents.' },
  { icon: '👁️', title: 'Applied Computer Vision', desc: 'Recognition pipelines for real-world security and search.' },
]

const Research = () => {
  return (
    <section id="research" className="section section-darker" aria-labelledby="research-heading">
      {/* Decorative glow + grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 erp-grid opacity-60" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-16 h-[420px] w-[420px] rounded-full erp-red-glow opacity-15 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Headline column */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="erp-eyebrow"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              Research &amp; Publications
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
              id="research-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.9rem] font-extrabold tracking-tight text-white mt-5 mb-5"
            >
              Where <span className="text-brand">curiosity</span> meets engineering rigour
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              My research spans large language models, satellite-based climate monitoring,
              autonomous agent systems and applied computer vision — carried out from
              ISRO NRSC field collaborations to published technical papers and
              open-source experiments on GitHub.
            </motion.p>
          </div>

          {/* Research-visual column */}
          <Reveal direction="scale" delay={0.15} className="hidden lg:flex justify-center">
            <div className="relative w-[280px] h-[280px]">
              <div className="absolute inset-6 rounded-full border border-brand/25 animate-spin-slow" aria-hidden="true">
                <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-brand shadow-red-glow" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-4xl shadow-red-glow-lg" aria-hidden="true">
                  🔬
                </div>
              </div>
              {['ISRO', 'LLM', 'Vision', 'Drones'].map((t, i) => (
                <Floating
                  key={t}
                  className={['top-2 left-1/2 -translate-x-1/2', 'top-1/2 -right-2', 'bottom-2 left-1/2 -translate-x-1/2', 'top-1/2 -right-8'][i]}
                  duration={6 + i}
                  delay={i * 0.5}
                >
                  <div className="rounded-xl border border-white/10 bg-card px-3 py-2 text-xs font-bold text-zinc-200">{t}</div>
                </Floating>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Publication cards */}
        <div className="mt-12 sm:mt-14 grid md:grid-cols-2 gap-5 sm:gap-6">
          {publications.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (i % 2) * 0.12, ease: EASE }}
              className="premium-card-dark p-6 flex flex-col group"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-block rounded-full bg-brand/10 border border-brand/30 px-3 py-1 text-[11px] font-bold text-brand-300">
                  {p.type}
                </span>
                <span className="text-zinc-500 text-xs font-semibold whitespace-nowrap">{p.date}</span>
              </div>
              <h3 className="font-display font-extrabold text-white text-lg leading-snug mb-3 group-hover:text-brand-300 transition-colors">
                {p.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">{p.summary}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] font-semibold text-zinc-300 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.link}
                {...(p.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => trackEvent('click', 'research', `open_${p.slug || p.title.slice(0, 20)}`)}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-300 transition-colors w-fit"
              >
                {p.linkLabel}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </motion.article>
          ))}
        </div>

        {/* Research interests */}
        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 sm:p-8">
            <h3 className="font-display font-extrabold text-white text-xl mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              Current Research Interests
            </h3>
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {interests.map((it, i) => (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: EASE }}
                  className="rounded-xl border border-white/8 bg-ink/60 p-4 hover:border-brand/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="text-2xl mb-2" aria-hidden="true">{it.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{it.title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">{it.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/blog"
                onClick={() => trackEvent('click', 'research', 'view_blog')}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-red-glow hover:-translate-y-0.5"
              >
                Browse All Publications
              </a>
              <a
                href="https://github.com/mukprabhakar"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click', 'research', 'view_github_research')}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:border-brand hover:text-brand-300 hover:-translate-y-0.5"
              >
                Research Repos on GitHub
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Research
