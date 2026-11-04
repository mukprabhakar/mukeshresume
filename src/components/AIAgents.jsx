import React from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { Reveal, EASE, Floating } from './motion/Reveal'
import { trackEvent } from '../utils/analytics'

/* AI Agents & Automation – signature dark section.
   Showcases 14+ AI agents and automation solutions built by Mukesh,
   with capability cards grounded in shipped work on this portfolio. */

const capabilities = [
  {
    icon: '🧠',
    title: 'AI-Powered Applications',
    description: 'Production apps with AI at the core — CodeOra\'s AI-guided full-stack project generation and adaptive quizzes, and the IIMT campus security vision system.',
    metric: '3 flagship AI products',
  },
  {
    icon: '⚙️',
    title: 'Intelligent Automation',
    description: 'Automated bus scheduling & route management for DTC-style operations, cutting delays by 45% with rules engines and real-time optimization.',
    metric: '45% delay reduction',
  },
  {
    icon: '🔗',
    title: 'LLM Integrations',
    description: 'Deep hands-on work with Claude, Gemini and open-source models — prompt design, benchmarking and a published comparative analysis research paper.',
    metric: '5+ model families',
  },
  {
    icon: '🤖',
    title: 'AI Assistants',
    description: 'Conversational assistants and tutors — from the ProLearn AI-tutor concept for Indian ed-tech to in-product help agents for SaaS platforms.',
    metric: '14+ agents built',
  },
  {
    icon: '🔄',
    title: 'Workflow Automation',
    description: 'End-to-end n8n workflows — bulk question-import pipelines, automated order notifications, analytics reporting and content automation.',
    metric: '20+ workflows',
  },
  {
    icon: '📡',
    title: 'API Integrations',
    description: 'Secure glue between AI and the real world: Google Drive API, payment gateways, WebSockets, CRMs, and multi-provider LLM fallback stacks.',
    metric: '15+ integrations',
  },
]

const agentHighlights = [
  { name: 'CodeOra Project Generator Agent', tag: 'AI/ML · Spring Boot', desc: 'AI-guided full-stack project generation with documentation for 500+ students.' },
  { name: 'Adaptive Quiz Agent', tag: 'EdTech · LLM', desc: 'Tech-stack-based interview question generation with performance analytics.' },
  { name: 'Campus Vision Security Agent', tag: 'Computer Vision', desc: 'CCTV image recognition matching students to records — 60% faster incident response.' },
  { name: 'Mission Person Find Agent', tag: 'AI · Search', desc: 'In-progress platform locating missing persons via image recognition and data analytics.' },
  { name: 'n8n Automation Suite', tag: 'Workflow · API', desc: 'Client-side automation pipelines for notifications, imports and reporting.' },
  { name: 'LLM Research Agent', tag: 'RAG · Analysis', desc: 'Comparative benchmarking assistant behind the published LLM research paper.' },
]

const AIAgents = () => {
  return (
    <section id="ai-agents" className="section section-dark" aria-labelledby="ai-heading">
      {/* Decorative glow + grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 erp-grid opacity-70" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full erp-red-glow opacity-20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-10 h-[420px] w-[420px] rounded-full erp-red-glow opacity-15 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Left: headline + counters */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="erp-eyebrow"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              AI Agents & Automation
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
              id="ai-heading"
              className="font-display text-3xl sm:text-4xl lg:text-[2.9rem] font-extrabold tracking-tight text-white mt-5 mb-5"
            >
              Building <span className="text-brand">14+ AI Agents</span> that do the busywork — so people do the breakthroughs
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              My AI development practice spans intelligent assistants, workflow automation,
              LLM integrations and computer-vision agents. Each solution is engineered for
              reliability: sandboxed execution, scoped credentials and measurable outcomes —
              lessons reinforced by tracking the 2026 AI-agent security landscape closely.
            </motion.p>

            {/* Counters band */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="mt-10 grid grid-cols-3 gap-4 max-w-lg"
            >
              {[
                { v: '14+', l: 'AI Agents' },
                { v: '20+', l: 'Automations' },
                { v: '30+', l: 'API Integrations' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/10 bg-card p-4 text-center hover:border-brand/50 transition-colors">
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand">{s.v}</div>
                  <div className="text-zinc-400 text-xs sm:text-sm mt-1">{s.l}</div>
                </div>
              ))}
            </motion.div>

            <Reveal delay={0.25} className="mt-8">
              <a
                href="/blog"
                onClick={() => trackEvent('click', 'ai_agents', 'read_research')}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-red-glow hover:-translate-y-0.5"
              >
                Read My AI Research & Explainers
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Right: orbiting agent chip visual */}
          <Reveal direction="scale" delay={0.15} className="hidden lg:flex justify-center items-center">
            <div className="relative w-[340px] h-[340px]">
              <div className="absolute inset-8 rounded-full border border-brand/25 animate-spin-slow" aria-hidden="true">
                <span className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-brand shadow-red-glow" />
              </div>
              <div className="absolute inset-20 rounded-full border border-white/10" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-5xl shadow-red-glow-lg" aria-hidden="true">
                  🤖
                </div>
              </div>
              {['LLM', 'Vision', 'RAG', 'n8n'].map((t, i) => (
                <Floating
                  key={t}
                  className={
                    ['top-2 left-1/2 -translate-x-1/2', 'top-1/2 -right-4', 'bottom-2 left-1/2 -translate-x-1/2', 'top-1/2 -left-6'][i]
                  }
                  duration={6 + i}
                  delay={i * 0.4}
                >
                  <div className="rounded-xl border border-white/10 bg-card px-3 py-2 text-xs font-bold text-zinc-200">{t}</div>
                </Floating>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Capability cards */}
        <div className="mt-14 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.12, ease: EASE }}
              className="premium-card-dark p-6 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 border border-brand/30 text-2xl transition-all group-hover:bg-brand group-hover:shadow-red-glow" aria-hidden="true">
                  {c.icon}
                </span>
                <h3 className="font-display font-extrabold text-white text-lg leading-tight">{c.title}</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">{c.description}</p>
              <span className="inline-block rounded-full bg-brand/10 border border-brand/30 px-3 py-1 text-[11px] font-bold text-brand-300">
                {c.metric}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Agent highlights */}
        <Reveal delay={0.1} className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-card/60 p-6 sm:p-8">
            <h3 className="font-display font-extrabold text-white text-xl mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              Selected Agents & Automations
            </h3>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {agentHighlights.map((a, i) => (
                <motion.div
                  key={a.name}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                  className="rounded-xl border border-white/8 bg-ink/60 p-4 hover:border-brand/40 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">{a.name}</h4>
                    <span className="text-[10px] font-bold text-brand-300 bg-brand/10 border border-brand/25 rounded-full px-2 py-0.5 whitespace-nowrap">{a.tag}</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed mt-2">{a.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AIAgents
